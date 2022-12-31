import { model, Schema } from "mongoose";
import { IExam } from "../types/DVA";

const ExamSchema = new Schema({
  subjects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  ],
  MMYYofExam: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
});

export default model<IExam>("Exam", ExamSchema);
