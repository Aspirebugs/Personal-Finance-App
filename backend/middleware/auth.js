import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.SECRET_KEY;

export function auth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ error: "No token" });

  const token = auth.slice(7);
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload?.sub;
    return next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};