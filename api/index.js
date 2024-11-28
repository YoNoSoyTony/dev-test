import express from "express";
import { JSONFilePreset } from "lowdb/node";
import jwt from "jsonwebtoken";

// database setup
const db = await JSONFilePreset("../data/users.json", { users: [] });
const { users } = db.data;

// this key is for JWT, ideally this should be stored secretly
const secret_key =
  "this is a random string, ideally a token loaded from dotenv, not in this case tho";

// express setup
const app = express();
app.use(express.json());

// support middlewares

// this checks the validity of the token, and puts userId into req, for next handlers to use
const validateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).send({ message: "no token provided" });

  try {
    const verifiedToken = jwt.verify(token, secret_key);
    req.userId = verifiedToken.id;
    next();
  } catch (error) {
    res.status(500).send({ message: "invalid token" });
  }
};

// puts the user data into the req, so handlers have context of the current user
const getUserData = (req, res, next) => {
  const { userId } = req;
  const user = users.find((u) => u._id == userId);
  if (user != undefined) {
    req.user = user;
    next();
  } else {
    res.status(500).send({
      message: "no user found for given token",
    });
  }
};

// api endpoints

// requires email and password, returns a token to be used in the authorization header
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const token = jwt.sign({ id: user._id }, secret_key);
    res.send({ token });
  } else {
    res.status(401).send({ message: "Invalid credentials" });
  }
});

// returns the user the token was signed for
app.get("/api/profile", validateToken, getUserData, (req, res) => {
  res.json(req.user);
});

// returns updated user
app.post("/api/profile", validateToken, getUserData, async (req, res) => {
  const { picture, eyeColor, name, company, email, password, phone, address } =
    req.body;

  let updatedUser = { ...req.user };

  if (email !== req.user.email) {
    const existingUserWithNewEmail = users.find(
      (u) => u.email === email && u._id !== req.userId
    );
    if (existingUserWithNewEmail) {
      return res.status(400).send({ message: "Email already exists" });
    }
    updatedUser.email = email;
  }

  updatedUser.picture = picture || updatedUser.picture;
  updatedUser.eyeColor = eyeColor || updatedUser.eyeColor;
  updatedUser.name = name || updatedUser.name;
  updatedUser.company = company || updatedUser.company;
  updatedUser.password = password || updatedUser.password;
  updatedUser.phone = phone || updatedUser.phone;
  updatedUser.address = address || updatedUser.address;

  const updatedUserIndex = users.findIndex((u) => u._id === req.userId);
  if (updatedUserIndex !== -1) {
    users[updatedUserIndex] = { ...users[updatedUserIndex], ...updatedUser };
    db.write(users);
    res.json(users[updatedUserIndex]);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
