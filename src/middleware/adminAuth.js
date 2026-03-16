function adminAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "Missing API key"
    });
  }

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key"
    });
  }

  next();
}

module.exports = adminAuth;