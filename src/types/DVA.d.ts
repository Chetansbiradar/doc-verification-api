import mongoose, { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  accessLevel: number;
  password: string;
  canAccess: IStudent[];
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
  dept: IDept;
  subjects: ISubject[];
  examDate: Date;
  semester: number;
}

export interface IReportCard extends Document {
  student: IStudent;
  department: IDept;
  exam: IExam;
  grades: {
    subject: ISubject;
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
  department: IDept;
  joiningDate: Date;
  reportCards: IReportCard[];
}
