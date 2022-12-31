import jwt from "jsonwebtoken";
import { User } from "../types/Dva";

export default (user: User, secret: string, expiresIn: string) => {
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
