import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  accessLevel: number;
  password: string;
}

export interface IDept extends Document {
  _id: string;
  code: string;
  name: string;
}

export interface ISubject extends Document {
  _id: string;
  code: string;
  name: string;
  credits: number;
}

export interface IExam extends Document {
  _id: string;
  subjects: string[];
  MMYYofExam: string;
  semester: number;
}

export interface IReportCard extends Document {
  _id: string;
  student: string;
  department: string;
  exam: string;
  grades: {
    subject: string;
    grade: string;
  }[];
}

export interface IStudent extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  batch: string;
  reportCards: string[];
}
