
const User = require('../models/user')

// getUser
async function getUser(req, res, next) {
    let user;
    try {
      user = await User.findById(req.params.id);
      if (user == null) {
        return res.status(404).json({ message: "Cannot find User", data: {} });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message, data: {} });
    }
    res.user = user;
    next();
}


module.exports = getUser
