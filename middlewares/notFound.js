const notFound = (req, res, next) => {
  res.status(404).json({
    code: 404,
    status: "failed",
    message: `Can't find ${req.originalUrl} on this server`,
  });
};

module.exports = notFound;
