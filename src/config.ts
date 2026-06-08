import dotenv from 'dotenv';
dotenv.config();

interface Config {
  apiUrl: string;
  apiKey: string;
}

export const config: Config = {
  apiUrl: process.env.API_URL ?? 'http://localhost:3000',
  apiKey: process.env.API_KEY ?? '',
};