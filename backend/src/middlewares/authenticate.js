import asynHandler from "express-async-handler";
import jwt from "jsonwebtoken";
export default {
  verifyToken: asynHandler(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(404).json({ message: "Invalid token", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_CODE);

    req.user = decoded;
    next();
  }),
};
