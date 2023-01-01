import { model, Schema } from "mongoose";
import { IStudent } from "../types/DVA";

const StudentSchema = new Schema({
  srn: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  name: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Dept",
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  reportCards: [
    {
      type: Schema.Types.ObjectId,
      ref: "ReportCard",
    },
  ],
  accessibleTo: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default model<IStudent>("Student", StudentSchema);
