import { model, Schema } from "mongoose";
import { IReportCard } from "../types/DVA";

const ReportCardSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  exam: {
    type: Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  grades: [
    {
      subject: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
      grade: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default model<IReportCard>("ReportCard", ReportCardSchema);
