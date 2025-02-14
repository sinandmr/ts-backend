import mongoose from 'mongoose';

import config from '../config';

export class MongoDBService {
  private static instance: MongoDBService;

  private constructor() {}

  public static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('✅ MongoDB bağlantısı başarılı');
    } catch (error) {
      console.error('❌ MongoDB bağlantı hatası:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('MongoDB bağlantısı kapatıldı');
    } catch (error) {
      console.error('MongoDB bağlantısı kapatılırken hata oluştu:', error);
      throw error;
    }
  }
} 