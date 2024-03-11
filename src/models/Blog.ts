import mongoose, { Types } from "mongoose";
const Schema = mongoose.Schema;

export const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    long_description: {
      type: String,
      required: true,
    },
    cover_image: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    slug:{
      type:String,
      required:true,
      unique: true
    },
    created_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    updated_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

BlogSchema.index({ title: 'text', long_description: 'text'});

