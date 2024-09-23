const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies["token"];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });  // Made the message generic
    }

    if (user.banned) {
      return res.status(403).json({ message: "User is banned and not allowed to perform this operation" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });  // Made the message generic
  }
};

module.exports = authenticate;
