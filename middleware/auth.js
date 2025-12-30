import jwt from 'jsonwebtoken';
 
export const authenticateToken = (req, res, next) => {
  // ✅ Cookie ЭСВЭЛ Authorization header-ээс token авах
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
 
  if (!token) {
    return res.status(401).json({ error: 'Нэвтрэх шаардлагатай' });
  }
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Буруу эсвэл хүчингүй token' });
  }
}; 