import jwt from "jsonwebtoken";
import { IUser } from "../types/DVA";

export default (user: IUser, secret: string, expiresIn: string) => {
  const { _id, name, accessLevel } = user;
  return jwt.sign(
    {
      _id,
      name,
      accessLevel,
    },
    secret,
    { expiresIn }
  );
};
