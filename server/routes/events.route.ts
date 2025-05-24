import { Router } from 'express';
import { getRedisClient } from '../redis/redis.client';
import axios from 'axios';
import { ENDPOINT_CACHE_CONFIG } from '../config/endpoint.config';
import dotenv from 'dotenv';
import { EventModel, StrapiEvent } from '../../src/app/events/utils/event.model';
import type { RedisClientType } from 'redis';
import type { AppRedisClient } from '../redis/redis.client';

dotenv.config();

const router = Router();
const cacheKey = 'events:v1';

const EVENTS_CACHE_KEY = 'events:v1';

// TODO: this feels like its overkill, why dont we just get a proper value from it rather than operating on it?
const TTL_MS = Number(ENDPOINT_CACHE_CONFIG.events.ttlSeconds) * 1000;

function normaliseEvent(strapiEvent: StrapiEvent): EventModel {
  return {
    id: strapiEvent.id,
    title: strapiEvent.title,
    slug: strapiEvent.slug,
    date: strapiEvent.date,
    content: strapiEvent.content ?? [],
    eventStatus: strapiEvent.eventStatus,
    location: strapiEvent.location ?? '',
  }
}

async function fetchAndCacheAllEvents(redis: AppRedisClient) {
  // TODO: Lets store all these Strapi APIs in some sort of look up file, that way we can just get the URL from it
  const url = `${process.env['STRAPI_URL']}/api/events?populate=*`;
  const headers = { Authorization: `Bearer ${process.env['STRAPI_TOKEN']}` };

  const { data } = await axios.get(url, { headers });

  const events = data.data.map(normaliseEvent);
  const payload = {
    data: { events },
    cachedAt: Date.now()
  };

  await redis.set(cacheKey, JSON.stringify(payload));
  console.log('✅ [Events] Cached new data in Redis');

  return payload.data;
}

router.get('/api/events', async (req, res, next) => {
  const redis = await getRedisClient();
  if (!redis) return next();

  const force = req.query['force'] === 'true';

  const cachedRaw = await redis.get(EVENTS_CACHE_KEY);
  if (cachedRaw) {
    const parsed = JSON.parse(cachedRaw);
    const isExpired = Date.now() - parsed.cachedAt > TTL_MS;

    console.log('✅ Served from Redis cache');
    res.json(parsed.data);

    if (isExpired || force) {
      console.log('!!! [Events] Fetching from Strapi');
      fetchAndCacheAllEvents(redis).catch(err => {
        console.error('❌ [Events] Failed to fetch from Strapi:', err);
      });
    }

    return;
  }

  try {
    console.log('⚠️ [Events] No cache, cold fetch...');
    const data = await fetchAndCacheAllEvents(redis);
    res.json(data);
  } catch (err) {
    console.error('❌ [Events] Initial fetch failed:', err);
    res.status(500).send('Failed to fetch events');
  }
});

router.get('/api/events/:slug', async (req, res, next) => {
  const redis = await getRedisClient();
  if (!redis) return next();

  const slug = req.params.slug;
  const cacheKey = `event:${slug}`;
  const force = req.query['force'] === 'true';

  if (!force && redis) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`✅ Served /api/events/${slug} from Redis`);
      return res.json(JSON.parse(cached));
    }
  }

  try {
    console.log(`!!! [Events] Fetching slug=${slug} from Strapi`);
    const url = `${process.env['STRAPI_URL']}/api/events?filters[slug][$eq]=${slug}&populate=*`;
    const headers = { Authorization: `Bearer ${process.env['STRAPI_TOKEN']}` };
    const { data } = await axios.get(url, { headers });

    const raw = data?.data?.[0];
    if (!raw) return res.status(404).send('Event not found');

    const event = normaliseEvent(raw);
    const payload = { event };

    const ttl = Number(ENDPOINT_CACHE_CONFIG.events.ttlSeconds);
    if (!Number.isInteger(ttl)) throw new Error('Invalid TTL');

    await redis.setEx(cacheKey, ttl, JSON.stringify(payload));
    return res.json(payload);
  } catch (err) {
    console.error(`❌ [Events] Error in /api/events/${slug}:`, err);
    return res.status(500).send('Failed to fetch event');
  }
});

export default router;
