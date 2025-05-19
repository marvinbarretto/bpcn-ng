// Having issues with loading env variables in SSR
// So we load them here
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });
console.log('🧪 ENV KEYS:', Object.keys(process.env).filter(k => k.includes('NEWS')));
