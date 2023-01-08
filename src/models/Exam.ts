import { model, Schema } from "mongoose";
import { IExam } from "../types/DVA";

const ExamSchema = new Schema(
  {
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
    ],
    examDate: {
      type: Date,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

export default model<IExam>("Exam", ExamSchema);
