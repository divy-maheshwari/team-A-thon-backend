const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const ClassRoom = require("../models/classModel");
const getToken = require("../config/jwt").getToken;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

router.post("/api/v1/auth/google", async (req, res) => {
  const { token } = req.body;
  const ticket = client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID
  });
  const { name, email } = ticket.getPayload();
  const user = await User.updateOne(
    { email },
    { $set: { name, email, password: `${email + name}` } },
    { upsert: true }
  );
  res.json(user);
});

router.patch("/join/", async (req, res) => {
  const classRoom = await ClassRoom.findOne({
    classRoomId: req.body.classRoomId
  });
  if (classRoom) {
    classRoom.studentsId.push({ studentId: req.body.email });
    await classRoom.save();
  } else {
    res.json({ msg: "ClassRoom not found! " });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    user.classRoomIds.push({ classRoomId: req.body.classRoomId });
    await user.save();
  } else {
    res.json({ msg: "User not found! " });
  }
  res.json({ user, classRoom });
});

router.get("/",(req, res) => {
  User.findOne({ email: req.user.email }, (err, user) => {
    if (err) res.status(401).json({ msg: "User not found!" });
    else {
      if (user.classRoomIds.length === 0) res.json({ msg: "no class joined" });
      else {
        const classRoomData = user.classRoomIds.forEach((id) => {
          ClassRoom.findById(id, (err, classroom) => classroom);
        });
        res.json({ user, classRoomData });
      }
    }
  });
});

router.post("/register", (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, registeredUser) => {
    if (registeredUser) {
      res.json({ msg: "user already registered" });
    } else {
      const user = new User(req.body);
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) {
            throw err;
          } else {
            user.password = hash;
            user.token = getToken(user);
            user.save().then((userData) => res.json(userData));
          }
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      user.token = getToken(user);
      res.json(user);
    }
  });
});

router.delete("/", (req, res) => {
  User.deleteOne({ email: req.body.email }, (err, deletedUser) => {
    if (deletedUser) res.json({ msg: "User deleted" });
    else res.json({ msg: "User failed to delete" });
  });
});

module.exports = router;
