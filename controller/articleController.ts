import { Request, Response } from "express";
import authorModel from "../model/authorModel";
import articleModel from "../model/articleModel";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";
import categoryModel from "../model/categoryModel";
import { iCategoryData } from "../config/interfaces";


export const createArticle = async (req: any, res: Response) => {
  try {
    const { description, content, categoryName,title } = req.body;
    const { authorID} = req.params;

    
    const author: any = await authorModel.findById(authorID);
  

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file?.path,
      );
    
    // const cat = await categoryModel.findOne(category.categoryName);
    const arts:any = await articleModel.create({
      description,
      content,
      // category,
      categoryName,
      title,
      authorID: author._id,
      // categoryID: Category,
      author,
      image: secure_url,
      imageID: public_id,
    });
    // console.log("reading",arts);
    

  


    author?.articles.push(new mongoose.Types.ObjectId(arts._id));
    await  author.save();

    // arts.category.push(new mongoose.Types.ObjectId(arts._id));
    await arts
    // if((categoryID.categoryName)===category){
    //   Category?.article?.push(arts._id);
    //   console.log("awesome")
    // }  

    // Category?.save()
  // Category?.article.push(arts);

await arts.save()
   return res.status(201).json({
      message: "Article created",
      data: arts,
    });
  } catch (error:any) {
   return res.status(404).json({
      message: "Error Found",
      data: error.message,
      err: error
    });
  }
};

export const getAuthorArticles = async (req: any, res: Response) => {
  try {
    const { authorID } = req.params;

    const author: any = await authorModel.findById(authorID).populate({
      path: "articles",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    res.status(201).json({
      message: "Author's Article ",
      data: author,
    });
  } catch (error) {
    res.status(404).json({
      message: "Error Found",
      data: error,
    });
  }
};

export const getAllArticles = async (req: any, res: Response) => {
  try {
    const author: any = await articleModel.find()

    res.status(200).json({
      message: "veiwing all Article",
      data: author,
    });
  } catch (error:any) {
    res.status(404).json({
      message: "Error Found",
      data: error.message,
    });
  }
};

export const getFriendArticles = async (req: any, res: Response) => {
  try {
    const { authorID } = req.params;

    const authors = await authorModel.findById(authorID);
    const article = await articleModel.find();

    const author: any = await authorModel.findById(authorID).populate({
      path: "articles",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });


    let data = article?.filter((el: any) =>
      authors?.friends!.includes(el.authorID),
    );

    res.status(201).json({
      message: "Author's Article ",
      data,
    });
  } catch (error) {
    res.status(404).json({
      message: "Error Found",
      data: error
        });
  }
};