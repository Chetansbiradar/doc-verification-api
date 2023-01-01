import { model, Schema } from "mongoose";
import { IReportCard, IStudent } from "../types/DVA";
import Student from "./Student";

const ReportCardSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Dept",
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
  file: {
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    url: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  publishDate: {
    type: Date,
  },
});

ReportCardSchema.pre("save", async function (next): Promise<void> {
  const student: IStudent | null = await Student.findByIdAndUpdate(
    this.student,
    {
      $addToSet: {
        reportCards: this._id,
      },
    },
    {
      new: true,
    }
  );

  next();
});

export default model<IReportCard>("ReportCard", ReportCardSchema);
