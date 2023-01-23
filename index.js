const express = require("express");
const app = express();
const mongoose = require("mongoose");
const env = require("dotenv").config();
const Post = require("./model/post");
const cors = require("cors");
const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration


mongoose.set('strictQuery', true);
const cloudinary = require("cloudinary").v2;
const upload = require("./multer");
const path = require("path");
const bodyParser = require("body-parser");

try {
    mongoose.connect(process.env.MONGO_URL,{
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log("connected to db");
  } catch (error) {
    handleError(error);
  }


  process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
  });

  app.use(express.json());

  app.use(express.urlencoded({
    extended: true
  }));

  app.use(bodyParser.urlencoded({extended:false}));
  
cloudinary.config({
  cloud_name: "dq025q89y",
  api_key: 398134747924423,
  api_secret: "cWzikQXWL-SkksB_2P3xeJZDi_8",
});


app.post("/post-page",upload.single("image"), async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      // Create new user
      let user = await Post.create({
        Name: req.body.Name,
        Location: req.body.Location,
        Description:req.body.Description,
        image: result.secure_url,
        cloudinary_id: result.public_id
      });
      // save user details in mongodb

      res.status(200)
        .json({
          user
        });
    } catch (err) {
      console.log(err);
    }
  });

 app.get("/post-page", async (req, res) => {
    try {
      let user = await Post.find(req.body.id);
      if (!user)
        res.status(404)
        .send({
          message: "User not found!"
        });
      res.send({
        user
      })
    } catch (err) {
      console.log(err);
    }
  });

  app.listen(3000, function () {
    console.log("App running!");
  });