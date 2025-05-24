import cookieParser from 'cookie-parser';
import express from 'express';
import navRoute from '../routes/nav.route';

export async function createTestServer() {
  const app = express();
  app.use(cookieParser());
  app.use(navRoute);

  return app;
}
