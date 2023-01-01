import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  accessLevel: number;
  password: string;
}

export interface IDept extends Document {
  code: string;
  name: string;
}

export interface ISubject extends Document {
  code: string;
  name: string;
  credits: number;
}

export interface IExam extends Document {
  subjects: mongoose.Types.ObjectId[];
  examDate: Date;
  semester: number;
}

export interface IReportCard extends Document {
  student: mongoose.Types.ObjectId;
  department: mongoose.Types.ObjectId;
  exam: mongoose.Types.ObjectId;
  grades: {
    subject: mongoose.Types.ObjectId;
    grade: string;
  }[];
  file: {
    name: string;
    url: string;
    path: string;
  };
  publishDate: Date;
}

export interface IStudent extends Document {
  srn: string;
  name: string;
  email: string;
  phone: string;
  department: mongoose.Types.ObjectId;
  joiningDate: Date;
  reportCards: mongoose.Types.ObjectId[];
}
