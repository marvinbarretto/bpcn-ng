import { Router } from "express";
import os from 'os';

const router = Router();

router.get('/api/debug', (req, res) => {
  res.json({
    cwd: process.cwd(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    uptime: process.uptime(),
    envKeys: Object.keys(process.env)
  });
});

export default router;
