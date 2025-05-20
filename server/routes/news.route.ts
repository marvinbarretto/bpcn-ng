import { Router } from 'express';
import axios from 'axios';
import { getRedisClient } from '../redis/redis.client';
import { checkCache } from '../middleware/check-cache.middleware';
import { XMLParser } from 'fast-xml-parser';

const router = Router();
const NEWS_CACHE_TTL = Number(process.env['NEWS_CACHE_TTL_DAYS'] || 28) * 86400;
const rssUrl = `https://news.google.com/rss/search?q=prostate+cancer&hl=en-GB&gl=GB&ceid=GB:en`;

router.get('/api/news', checkCache, async (req, res, next) => {
  const redis = await getRedisClient();
  if (!redis) return next();

  const cachedData = await redis.get('newsData');

  if (cachedData) {
    console.log('✅ Served from Redis cache');
    return res.json(JSON.parse(cachedData));
  }

  try {
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
      'newsData', NEWS_CACHE_TTL, JSON.stringify(parsed)
    );
    console.log('✅ Cached new data in Redis', typeof parsed, parsed?.length);
    return res.json(parsed);
  } catch (error) {
    console.error('❌ Error fetching news:', error);
    return res.status(500).send('Error fetching news');
  }
});

export default router;
