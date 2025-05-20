import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '.env');


if (existsSync(envPath)) {
  dotenv.config({ path: envPath });

  console.log('*** Environment variables loaded from', envPath);

  if (process.env['VERBOSE_ENV']) {
    console.log(
      '🧪 ENV KEYS:',
      Object.keys(process.env).filter((k) => k.includes('NEWS'))
    );
  } else {
    console.warn(`.env file not found at ${envPath}`);
  }
}
