import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import * as bodyParser from "body-parser";

async function bootstrap() {
  new ValidationPipe({
    whitelist: true,
    transform: true, // WAJIB
    transformOptions: { enableImplicitConversion: true },
  });

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.use(bodyParser.json({ limit: "30mb" }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

  // app.enableCors({
  //   origin: "http://localhost:3000",
  //   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  //   credentials: true,
  // });

  app.enableCors({
    origin: true,
    methods: "*",
    allowedHeaders: "*",
    exposedHeaders: "*",
    credentials: true,
  });

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(4000);
  console.log("🚀 Server running on http://localhost:4000");
}

bootstrap();
