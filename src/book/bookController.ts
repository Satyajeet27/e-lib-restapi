import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);

  try {
    //typecasting
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    //cloudinary mostly image and videos upload ke liye use hota hai, pdf ke liye thoda different h

    const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
      //humlog pdf upload kr rhe h, so resource type raw use kr rhe h, image and video ke case m use nahi hota h
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-pdfs",
      format: "pdf",
    });
    console.log("upload bookfile upload", bookFileUpload);
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Error while uploading the files"));
  }

  //cloudinary site pr, setting>security idhar check krna hoga pdf and zip files delivery tb humlog console m result dekh paenge else ye upload toh ho jaega but result console m nahi aaega

  res.json({});
};

export { createBook };
