function gameAuth(req, res, next) {
  const serverKey = req.headers["x-server-key"];

  if (!serverKey) {
    return res.status(401).json({
      success: false,
      message: "Missing server key"
    });
  }

  if (serverKey !== process.env.SERVER_API_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid server key"
    });
  }

  next();
}

module.exports = gameAuth;