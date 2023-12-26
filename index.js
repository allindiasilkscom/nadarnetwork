const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const app = express();

const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://nadarnetwork:Mumbai%402050@nadarnetwork.bw3emob.mongodb.net/nadarnetwork",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to Mongoose DB");
  })
  .catch((err) => {
    console.log("Failed to Connect", err);
  });

app.listen(port, () => {
  console.log("server Running in the Port number 8000");
});

const User = require("./models/user");
const Post = require("./models/post");

//end point for register user
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("email Is Already Register");
      res.status(400).json({ message: "email Is already Register" });
    }

    const newUser = new User({
      name,
      email,
      password,
      profileImage,
    });

    newUser.varificationToken = crypto.randomBytes(20).toString("hex");

    await newUser.save();

    sendVerificationEmail(newUser.email, newUser.varificationToken);
    res
      .status(202)
      .json({ message: "Registration Successfull Please Cheack your Mail ID" });
  } catch (error) {
    console.log("Error in Register", error);
    res.status(500).json({ message: "Registration Failed" });
  }
});
const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "mail.actorsboard.com",
      port: 465,
      secure: true,
      auth: {
        user: "care@actorsboard.com",
        pass: "Mumbai@2050",
      },
    });

    const mailOptions = {
      from: "care@actorsboard.com",
      to: email,
      subject: "NadarNetwork Email Verification Link",
      text: `Please click the following link to verify your email: http://192.168.43.31:8000/verify/${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending the email:", error);
  }
};
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await user.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalide Token" });
    }
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({ message: "email Verified Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email Verification Failes" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

//login user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);
    res.status(200).json({token});
  } catch (error) {
    res.status(500).json({ message: "Login Failed " });
  }
});
