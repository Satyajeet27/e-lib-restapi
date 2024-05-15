import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  //   console.log("files", req.files);
  const { title, genre } = req.body;
  //@ts-ignore
  //   console.log("userId", req.userId);
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

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        //humlog pdf upload kr rhe h, so resource type raw use kr rhe h, image and video ke case m use nahi hota h
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );
    // console.log("upload bookfile upload", bookFileUploadResult);
    const newBook = await bookModel.create({
      title,
      genre,
      author: (req as AuthRequest).userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });
    try {
      //deleting temp file after uploading in cloudinary
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
    } catch (error) {
      next(
        createHttpError(
          500,
          "Something went wrong while removing temporary files"
        )
      );
    }

    return res.status(201).json({ id: newBook._id });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Error while uploading the files"));
  }

  //cloudinary site pr, setting>security idhar check krna hoga pdf and zip files delivery tb humlog console m result dekh paenge else ye upload toh ho jaega but result console m nahi aaega

  res.json({});
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  try {
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }
    //checking access- jo client book ko update krna chahta h, woh book ka author wahi h kya
    if (book.author.toString() !== (req as AuthRequest).userId) {
      return next(createHttpError(403, "You cannot update others book"));
    }

    //check image field exist
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = "";
    if (files.coverImage) {
      const fileName = files.coverImage[0].filename;
      const converMimeType = files.coverImage[0].mimetype.split(" ").at(-1);

      //send files to cloudinary
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads/" + fileName
      );
      completeCoverImage = fileName;
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: completeCoverImage,
        folder: "book-covers",
        format: converMimeType,
      });
      completeCoverImage = uploadResult.secure_url;
      await fs.promises.unlink(filePath);
    }

    let completeFileName = "";
    if (files.file) {
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads/" + files.file[0].filename
      );
      const bookFileName = files.file[0].filename;
      completeFileName = bookFileName;
      const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
        filename_override: completeFileName,
        folder: "book-covers",
        format: "pdf",
      });
      completeFileName = uploadResultPdf.secure_url;
      await fs.promises.unlink(bookFilePath);
    }
    const updatedBook = await bookModel.findOneAndUpdate(
      {
        _id: bookId,
      },
      {
        title,
        genre,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        file: completeFileName ? completeFileName : book.file,
      },
      { new: true }
    );
    res.json(updatedBook);
  } catch (error) {
    console.log(error);
    return next(
      createHttpError(500, "Something went wrong while updating book")
    );
  }
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookModel.find({});
    return res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error while getting books"));
  }
};
const getSingleBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }
    return res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error while getting a book"));
  }
};

export { createBook, updateBook, listBooks, getSingleBooks };
