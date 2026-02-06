const checkActiveUser = (req, res, next) => {
  if (!req.user.isActive) {
    return res.status(403).json({
      message: "Account is disabled",
    });
  }
  next();
};

export default checkActiveUser;
