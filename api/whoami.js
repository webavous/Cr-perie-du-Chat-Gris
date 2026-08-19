const { verifyToken, getTokenFromReq } = require("./_auth");

module.exports = async (req, res) => {
  const token = getTokenFromReq(req);
  res.status(200).json({ admin: verifyToken(token) });
};
