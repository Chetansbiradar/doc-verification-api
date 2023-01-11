import { model, Schema } from "mongoose";
import { IReportCard, IStudent } from "../types/DVA";
import Student from "./Student";

const ReportCardSchema = new Schema(
  {
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
          type: String,
          required: true,
        },
      },
    ],
    sgpa: {
      type: Number,
      required: true,
    },
    file: {
      name: {
        type: String,
        maxlength: 255,
      },
      url: {
        type: String,
      },
      path: {
        type: String,
      },
    },
    publishDate: {
      type: Date,
    },
  },
  {
    versionKey: false,
  }
);

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

// findbyidanddelete hook
ReportCardSchema.pre("findOneAndDelete", async function (next): Promise<void> {
  // pull report from student
  const student: IStudent | null = await Student.findByIdAndUpdate(
    this.getQuery()._id,
    {
      $pull: {
        reportCards: this.getQuery()._id,
      },
    },
    {
      new: true,
    }
  );

  next();
});

export default model<IReportCard>("ReportCard", ReportCardSchema);
