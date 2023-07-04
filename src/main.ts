import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
// import { httpsOptions } from './configs/https-options.config';
// import { Environment } from './constants/environment.constant';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

async function bootstrap() {
  // const isDevelopment = process.env.NODE_ENV === Environment.Development;
  const app = await NestFactory.create(AppModule, {
    // httpsOptions: !isDevelopment ? httpsOptions : undefined,
  });

  app.enableCors({
    origin: ['http://localhost:3000', 'https://laundrex-web.vercel.app'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  const reflector = app.get(Reflector);

  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
    }),
  );

  await app.listen(8080);
}
bootstrap();
