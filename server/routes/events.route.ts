import { Router } from 'express';
import { getRedisClient } from '../redis/redis.client';
import axios from 'axios';
import dotenv from 'dotenv';
import debug from 'debug';

import { STRAPI_HEADERS, STRAPI_ENDPOINTS } from '../config/strapi.config';
import { ENDPOINT_CACHE_CONFIG } from '../config/endpoint.config';
import { EventModel, StrapiEvent } from '../../src/app/events/utils/event.model';
import type { CachedPayload } from '../utils/cache.types';
import type { AppRedisClient } from '../redis/redis.client';

dotenv.config();
const log = debug('api:events');

const router = Router();
const EVENTS_CACHE_KEY = 'events:v1';
const TTL_MS = Number(ENDPOINT_CACHE_CONFIG.events.ttlSeconds) * 1000;
const LOCK_KEY = 'lock:events:v1';

function normaliseEvent(strapiEvent: StrapiEvent): EventModel {
  return {
    id: strapiEvent.id,
    title: strapiEvent.title,
    slug: strapiEvent.slug,
    date: strapiEvent.date,
    content: strapiEvent.content ?? [],
    eventStatus: strapiEvent.eventStatus,
    location: strapiEvent.location ?? '',
  };
}

async function fetchAndCacheAllEvents(redis: AppRedisClient) {
  const lock = await redis.set(LOCK_KEY, 'locked', { NX: true, PX: 10_000 });
  if (!lock) {
    log('⏳ Skipping refresh — already in progress');
    return;
  }

  try {
    const existing = await redis.get(EVENTS_CACHE_KEY);
    if (existing) {
      log('♻️ Cache was set by another process, skipping fetch');
      return JSON.parse(existing)?.data;
    }

    const { data } = await axios.get(STRAPI_ENDPOINTS.allEvents, {
      headers: STRAPI_HEADERS,
    });

    const events = data.data.map(normaliseEvent);
    const payload: CachedPayload<{ events: EventModel[] }> = {
      cachedAt: Date.now(),
      data: { events },
    };

    // ✅ Set with TTL — makes cache eventually expire as fallback
    await redis.setEx(
      EVENTS_CACHE_KEY,
      ENDPOINT_CACHE_CONFIG.events.ttlSeconds, // e.g. 86400 = 1 day
      JSON.stringify(payload)
    );

    log('📝 Writing to Redis:', JSON.stringify(payload, null, 2));
    log('✅ [Events] Cache updated');
    return payload.data;
  } catch (err) {
    log('❌ [Events] Refresh failed', err);
    throw err;
  } finally {
    await redis.del(LOCK_KEY); // Always release lock
  }
}



router.get('/api/events', async (req, res, next) => {
  const redis = await getRedisClient();
  if (!redis) return next();

  const force = req.query['force'] === 'true';

  try {
    const cachedRaw = await redis.get(EVENTS_CACHE_KEY);
    log('📦 Redis payload:', cachedRaw);

    if (cachedRaw) {
      const parsed: CachedPayload<{ events: EventModel[] }> = JSON.parse(cachedRaw);
      const isExpired = Date.now() - parsed.cachedAt > TTL_MS;

      if (!parsed?.data?.events?.length) {
        log('⚠️ Cache exists but no events found');
        return res.status(500).send('Cache is corrupted or empty');
      }

      log('📦 Parsed data:', parsed);

      log('✅ Cache hit — serving cached data');
      res.json(parsed.data);

      if (isExpired || force) {
        log('♻️ Stale or forced — triggering background revalidation');
        fetchAndCacheAllEvents(redis).catch((err) =>
          log('❌ Background refresh failed:', err)
        );
      }
      return;
    }

    log('⚠️ No cache — cold fetch');
    const data = await fetchAndCacheAllEvents(redis);
    if (data) return res.json(data);

    return res.status(500).send('Failed to load events');
  } catch (err) {
    log('❌ Error handling /api/events', err);
    return res.status(500).send('Server error');
  }
});

router.get('/api/events/:slug', async (req, res, next) => {

  // ensure things like .map files don’t match and trigger real API logic
  if (req.params.slug.includes('.')) {
    return res.status(400).send('Invalid slug');
  }

  const redis = await getRedisClient();
  if (!redis) return next();

  const slug = req.params.slug;
  const key = `event:${slug}`;
  const force = req.query['force'] === 'true';

  try {
    if (!force) {
      const cached = await redis.get(key);
      if (cached) {
        log(`✅ Cache hit for slug=${slug}`);
        return res.json(JSON.parse(cached));
      }
    }

    const { data } = await axios.get(STRAPI_ENDPOINTS.eventBySlug(slug), {
      headers: STRAPI_HEADERS,
    });

    const raw = data?.data?.[0];
    if (!raw) return res.status(404).send('Event not found');

    const payload = {
      event: normaliseEvent(raw),
    };

    await redis.setEx(key, ENDPOINT_CACHE_CONFIG.events.ttlSeconds, JSON.stringify(payload));
    return res.json(payload);
  } catch (err) {
    log(`❌ Error fetching slug=${slug}`, err);
    return res.status(500).send('Failed to fetch event');
  }
});

export default router;
