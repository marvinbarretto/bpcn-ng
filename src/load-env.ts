import dotenv from 'dotenv';
import { resolveRelativePath } from './utils/resolve-module-path';

const resolvePath = resolveRelativePath(import.meta.url);
const envPath = resolvePath('.env');

if (process.env['VERBOSE_ENV']) {
  console.log('⚙️ Attempting to load .env from:', envPath);
}

dotenv.config({ path: envPath });

if (process.env['VERBOSE_ENV']) {
  console.log('🧪 ENV KEYS:', Object.keys(process.env));
}
