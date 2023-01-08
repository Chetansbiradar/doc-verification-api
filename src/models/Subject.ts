import { model, Schema } from "mongoose";
import { ISubject } from "../types/DVA";

const SubjectSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 10,
    },
    name: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    credits: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model<ISubject>("Subject", SubjectSchema);
