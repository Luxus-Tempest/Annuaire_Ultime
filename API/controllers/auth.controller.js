import bcryptjs from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  //   res.send(req.body);
  //console.log(req.body);
  const { username, email, password } = req.body;

  try {
    const hashPassword = await bcryptjs.hash(password, 10);
    //console.log(hashPassword);

    //CHECK IF THE USER ALREADY EXISTS

    const ifUsernameExists = await prisma.user.findUnique({
      where: { username },
    });

    if (ifUsernameExists)
      return res.status(401).json({
        message: "This Username already exists",
      });

    const ifEmailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (ifEmailExists) {
      return res.status(401).json({
        message: "This Email already exists",
      });
    }

    //CREATE A NEW USER
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });

    console.log("new user created : ", newUser);
    res.status(200).json({
      message: "User created successfully",
      userInfos: newUser,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // CHECK IF THE USER EXISTS
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user)
      return res.status(401).json({ message: "Oops, incorrect username !" });

    // CHECK IF THE PASSWORD IS CORRECT

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Incorrect password." });

    //res.status(401).json({ message: "logged in", user: user });

    // GENERATE A TOKEN
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      }
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,
        //maxAge: 1000 * 60 * 60 * 24 * 7, // Expire each week after
      })
      .status(200)
      .json({ message: "logged in successfully", token: token, user: user });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "logged out successfully" });
};
