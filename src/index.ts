import app from './app';
import config from './config';

const startServer = async () => {
  try {
    // Veritabanı bağlantılarını başlat
    await Promise.all([
      global.mongoDBService.connect(),
      global.redisService.connect()
    ]);

    // Sunucuyu başlat
    app.listen(config.port, () => {
      console.log(`
        🚀 Sunucu başlatıldı!
        📡 Port: ${config.port}
        🌍 Ortam: ${config.environment}
      `);
    });

    // Uygulama kapatıldığında veritabanı bağlantılarını kapat
    const cleanup = async () => {
      console.log('\nUygulama kapatılıyor...');
      await Promise.all([
        global.mongoDBService.disconnect(),
        global.redisService.disconnect()
      ]);
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  } catch (error) {
    console.error('❌ Sunucu başlatılırken hata oluştu:', error);
    process.exit(1);
  }
};

startServer(); 