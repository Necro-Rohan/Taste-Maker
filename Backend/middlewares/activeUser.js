import User from "../models/users.model.js";

const checkActiveUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.isActive) {
      return res.status(403).json({
        code: "ACCOUNT_DISABLED",
        message: "Account is disabled. Do you want to restore it ?",
        restoreRequired: true,
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export default checkActiveUser;

// const checkActiveUser = (req, res, next) => {
//   if (!req.user.isActive) {
//     return res.status(403).json({
//       message: "Account is disabled",
//     });
//   }
//   next();
// };

// export default checkActiveUser;
// i am changing from this to new db query because in case of using this when user was disabling his/her account the token skill had the isActive = true and causing auto login.
