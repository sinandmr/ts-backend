import Redis from 'ioredis';

import config from '../config';

export class RedisService {
  private static instance: RedisService;
  private client: Redis;

  private constructor() {
    this.client = new Redis(config.redisUrl);
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.ping();
      console.log('✅ Redis bağlantısı başarılı');
    } catch (error) {
      console.error('❌ Redis bağlantı hatası:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.quit();
      console.log('Redis bağlantısı kapatıldı');
    } catch (error) {
      console.error('Redis bağlantısı kapatılırken hata oluştu:', error);
      throw error;
    }
  }

  public getClient(): Redis {
    return this.client;
  }

  // Cache işlemleri için yardımcı metodlar
  public async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    if (expireSeconds) {
      await this.client.setex(key, expireSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  public async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }
} 