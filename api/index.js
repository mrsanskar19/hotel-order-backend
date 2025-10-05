const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/src/app.module');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

let app;

async function bootstrap() {
  if (!app) {
    const expressApp = express();
    app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });
    await app.init();
  }
  return app.getHttpAdapter().getInstance();
}

module.exports = async function handler(req, res) {
  const expressApp = await bootstrap();
  expressApp.handle(req, res);
};
