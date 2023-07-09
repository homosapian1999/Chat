const Users = require("../../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { username, mail, password } = req.body;

    // If User already exists
    const existingUser = await Users.exists({ mail: mail.toLowerCase() });
    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    // Encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await Users.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    });

    // Create the Jwt token;
    const token = jwt.sign(
      { userId: newUser._id, mail },
      process.env.TOKEN_KEY,
      { expiresIn: "2d" }
    );

    res.status(201).send({
      userDetails: {
        mail: newUser.mail,
        token: token,
        username: newUser.username,
        _id: newUser._id,
      },
    });
  } catch (error) {
    return res.status(500).send("Error occured. Please try again");
  }
};

module.exports = registerController;
