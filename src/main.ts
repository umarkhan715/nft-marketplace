import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import { listen } from "./events/events.listener";
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Enable Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix("v1");
  // Swaggar API's Docs
  const config = new DocumentBuilder()
    .setTitle("Marketplace Api Swagger Documentation")
    .setDescription("This is the Complete documentation of Api's")
    .setVersion("1.0")
    .addTag("User")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter your JWT token",
        in: "header",
      },
      "JWT-AUTH"
    )
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "Refresh",
        name: "Refresh",
        description: "Enter your Refresh token",
        in: "header",
      },
      "Refresh-AUTH"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("marketplace", app, document);

  ///
  app.enableCors();
  app.use(bodyParser.json({ limit: "1000gb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "1000gb", extended: true }));

  // Use Helmet
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "../.././public/generatedArt")));
  app.use(express.static(path.join(__dirname, "../views")));
  app.setViewEngine("hbs");
  //
  app.use(cookieParser());
  //
  app.useGlobalPipes(
    new ValidationPipe({
      //whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  let port = 3001;
  await app.listen(port);
  listen();
  console.log("port running :", port);
}
bootstrap();
