import { model, Schema } from "mongoose";
import { IDept } from "../types/DVA";

const DeptSchema = new Schema(
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
  },
  { versionKey: false }
);

export default model<IDept>("Dept", DeptSchema);
