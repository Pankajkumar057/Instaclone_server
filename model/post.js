const mongoose = require("mongoose");
const schema = mongoose.Schema
const objectId = schema.objectId;

const postschema = new schema({
    Name:{type:String, required:true},
    Location:{type:String, required:true},
    Description:{type:String},
    image:{type:String, required:true},
    cloudinary_id: {type: String}

})

const Post = mongoose.model("Posts", postschema);

module.exports = Post;