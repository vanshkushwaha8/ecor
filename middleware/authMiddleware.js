import jwt from 'jsonwebtoken';

export const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // 

      console.log("Decoded Token:", decoded); 

      if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: `Access Denied: You Are Not a ${allowedRoles.join(" or ")}` });
      }
      
      next(); 
    } catch (error) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
  };
};
