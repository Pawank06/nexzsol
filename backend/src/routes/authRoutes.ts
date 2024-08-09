import { Router } from "express";

const authRoutes = Router();

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
      client_id: "Ov23li6NL0UGR6ckpI25",
      client_secret: "3bc18e85d16fa085a0fc0746d166d4ec8eaf362c",
      code: code,
    }),
  });
  let responseData: Response = await data;
  let response = await responseData.text();
  console.log(response);
  let accessToken = response.split("&")[0].split("=")[1];
  console.log(accessToken);
  res.redirect(`http://localhost:3000?`);
});

export default authRoutes; 
