import mongoose, { Types } from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt"

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  added_by : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.checkPassword = async function (enteredPassword:string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.comparePassword = function (candidatePassword:string, cb:any) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
