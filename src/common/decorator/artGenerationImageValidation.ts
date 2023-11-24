import { HttpException, HttpStatus } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path, { extname } from "path";
import fs from "fs";
import console from "console";

export const ArtImageValidation = FileFieldsInterceptor(
  [{ name: "Image", maxCount: 100 }],
  {
    dest: "./public/ArtGeneration/",
    limits: {
      fileSize: 5000000,
    },
    fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        // Allow storage of file
        cb(null, true);
      } else {
        // Reject file
        cb(
          new HttpException(
            `Unsupported file type ${extname(file.originalname)}`,
            HttpStatus.BAD_REQUEST
          ),
          false
        );
      }
    },
    storage: diskStorage({
      destination: function (req, file, callback) {
        const { projectname, blockchaintype } = req.headers;
        const path = `./public/ArtGeneration/${blockchaintype}/${projectname}/Images`;
        fs.mkdirSync(path, { recursive: true });
        callback(null, path);
      },
      filename: (req, file, callback) => {
        const ext = extname(file.originalname);
        const filename = `${file.originalname}`;
        callback(null, filename);
      },
    }),
  }
);

export const ArtImageValidationJsonFile = FileFieldsInterceptor(
  [
    { name: "Image", maxCount: 100 },
    { name: "MetaData", maxCount: 1 },
  ],
  {
    dest: "./public/ArtGeneration/",
    limits: {
      fileSize: 5000000,
    },
    fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|json)$/)) {
        // Allow storage of file
        cb(null, true);
      } else {
        // Reject file
        cb(
          new HttpException(
            `Unsupported file type ${extname(file.originalname)}`,
            HttpStatus.BAD_REQUEST
          ),
          false
        );
      }
    },
    storage: diskStorage({
      destination: function (req, file, callback) {
        const { projectname, blockchaintype } = req.headers;
        let path = "";
        if (file.mimetype === "application/json") {
          path = `./public/ArtGeneration/${blockchaintype}/${projectname}/metaData`;
          fs.mkdirSync(path, { recursive: true });
        } else {
          path = `./public/ArtGeneration/${blockchaintype}/${projectname}/Images`;
          fs.mkdirSync(path, { recursive: true });
        }

        callback(null, path);
      },
      filename: (req, file, callback) => {
        const ext = extname(file.originalname);
        const filename = `${file.originalname}`;
        callback(null, filename);
      },
    }),
  }
);
