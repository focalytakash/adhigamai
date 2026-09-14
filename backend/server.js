const env = require('./src/config/env');
const connectDB = require('./src/config/db');
const app = require('./src/app');

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });

    const shutdown = async () => {
      server.close(async () => {
        const mongoose = require('mongoose');
        await mongoose.connection.close();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
