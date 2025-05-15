import { Router } from 'express';
import axios from 'axios';
import { getRedisClient } from '../redis/redis.client';
import { checkCache } from '../middleware/check-cache.middleware';
import path from 'path';


const router = Router();

const NEWS_CACHE_TTL = Number(process.env['NEWS_CACHE_TTL_DAYS'] || 28) * 86400;
const rssUrl = `https://news.google.com/rss/search?q=prostate+cancer&hl=en-GB&gl=GB&ceid=GB:en`;

router.get('/api/news', checkCache, async (req, res) => {
  try {
    console.log('🔄 Fetching fresh RSS feed');
    const response = await axios.get(rssUrl);

    const redis = await getRedisClient();
    await redis.setEx(
      'newsData',
      NEWS_CACHE_TTL,
      JSON.stringify(response.data)
    );
    console.log('✅ Cached new data in Redis');

    res.send(response.data);
  } catch (error) {
    console.error('❌ Error fetching news:');
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error(error);
    }

    res.status(500).send('Error fetching news');
  }
});

// Debugging
// const fs = require('fs');
// const filePath = path.resolve(process.cwd(), 'news.xml');
// console.log('[🧪 Loading mock RSS from]', filePath);

// router.get('/api/news', async (req, res) => {
//   const data = fs.readFileSync(filePath, 'utf8');
//   res.send(data);
// });

export default router;
