import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token invalid or expired"
      });
    }
  }

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'No token provided'
    });
  }
}
