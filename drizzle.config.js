import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";
import { ENV } from './src/config/env.js';

config({ path: '' });

export default defineConfig({
  schema: "./src/db/schema.js",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DATABASE_URL
  },
});
