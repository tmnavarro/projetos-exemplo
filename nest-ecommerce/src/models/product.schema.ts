import * as mongoose from 'mongoose';
import { UserSchema } from './user.schema';

export const ProductSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: String,
    description: String,
    image: String,
    price: Number,
  },
  { timestamps: true },
);
