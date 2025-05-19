import { Router } from 'express';
import axios from 'axios';
import { getRedisClient } from '../redis/redis.client';
import { checkCache } from '../middleware/check-cache.middleware';
import { XMLParser } from 'fast-xml-parser';

const router = Router();
const raw = process.env['NEWS_CACHE_TTL_DAYS'];
console.log('🧪 Raw env var:', raw);

const NEWS_CACHE_TTL = Number(raw || 28) * 86400;
console.log('🔧 NEWS_CACHE_TTL (seconds):', NEWS_CACHE_TTL);

// TODO: Make this configurable
const rssUrl = `https://news.google.com/rss/search?q=prostate+cancer&hl=en-GB&gl=GB&ceid=GB:en`;

router.get('/api/news', checkCache, async (req, res) => {
  const redis = await getRedisClient();
  const today = new Date().toISOString().split('T')[0];

  const cachedData = await redis.get('newsData');
  const lastFetchDate = await redis.get('newsLastFetchDate');

  if (cachedData && lastFetchDate === today) {
    console.log('✅ Served from Redis cache');
    return res.json(JSON.parse(cachedData));
  }

  try {
    console.log('♻️ Fetching fresh RSS data from source');
    const xmlResponse = await axios.get(rssUrl);
    const parser = new XMLParser({ ignoreAttributes: false });
    const json = parser.parse(xmlResponse.data);
    const items = json.rss?.channel?.item ?? [];

    const parsed = items.map((item: any) => ({
      title: item.title ?? '',
      link: item.link ?? '',
      pubDate: item.pubDate ?? '',
      description: item.description ?? '',
    }));

    await redis.setEx(
      'newsData',
      NEWS_CACHE_TTL,
      JSON.stringify(parsed)
    );
    console.log('✅ Cached new data in Redis', typeof parsed, parsed?.length);
    return res.json(parsed);
  } catch (error) {
    console.error('❌ Error fetching fresh news:', error);
    if (cachedData) {
      console.warn('⚠️ Returning stale news due to fetch error');
      return res.json(JSON.parse(cachedData));
    }
    return res.status(500).send('Failed to fetch news and no cache available');
  }
});

export default router;
