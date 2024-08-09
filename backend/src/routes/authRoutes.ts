import { Router } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { env } from "process";
const authRoutes = Router();


const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
authRoutes.get("/", async (req, res, next) => {
  const code = req.query.code;
  console.log(code);
  console.log(req.body);
  const data = fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: client_id,
      client_secret: client_secret,
      code: code,
    }),
  });
  let responseData: Response = await data;
  let response = await responseData.text();
  console.log(response);
  let accessToken = response.split("&")[0].split("=")[1];
  console.log(accessToken);
  const user = fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
  let userData = await user;
  if (!userData.ok) {
    res.redirect(`http://localhost:3000?error=${userData.statusText}`);
  }
  let userResponse = await userData.json();
  let { login, avatar_url, id, email } = userResponse;
  const userModel = await User.insertMany({
    gitId: id,
    name: login,
    accessToken,
    avatarUrl: avatar_url,
  });

  
  const token = jwt.sign({ id: userModel[0]._id }, "secret", {
    expiresIn: "1000d",
  });
  console.log(userResponse);
  res.redirect(`http://localhost:3000?token=${token}`);
});

export default authRoutes;
