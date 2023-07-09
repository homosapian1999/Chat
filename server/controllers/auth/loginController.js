const Users = require("../../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  try {
    const { mail, password } = req.body;
    const user = await Users.findOne({ mail: mail.toLowerCase() });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create the new token
      const token = jwt.sign(
        { userId: user._id, mail },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2d",
        }
      );
      return res.status(200).json({
        userDetails: {
          mail: user.mail,
          token: token,
          username: user.username,
          _id: user._id,
        },
      });
    }
    return res.status(400).send("Invalid Credentials. Please try again");
  } catch (error) {
    return res.status(500).send("Error in login controller ");
  }
};

module.exports = loginController;
