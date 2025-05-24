export const ENDPOINT_CACHE_CONFIG = {
  primaryNavLinks: {
    ttlSeconds: 7 * 24 * 60 * 60, // 1 week
    redisKey: 'primaryNavLinks:v1',
    cacheEmpty: false,
  },
  newsFeed: {
    ttlSeconds: Number(process.env['NEWS_CACHE_TTL_DAYS']) * 86400,
    redisKey: 'newsData',
    cacheEmpty: true,
  },
};
