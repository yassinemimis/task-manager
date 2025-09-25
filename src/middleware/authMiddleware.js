// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  try {
    // نتحقق إذا الهيدر يحتوي على Authorization Bearer
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // نتأكد من وجود السر
      if (!process.env.JWT_SECRET) {
        return res
          .status(500)
          .json({ success: false, message: "JWT secret is not defined" });
      }

      // نفك التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // نجيب المستخدم من قاعدة البيانات (بدون كلمة السر)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

export default protect;
