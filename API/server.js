import express from "express";
import cookieParser from "cookie-parser";
import router from "./route/user.route.js";
import authRouter from "./route/auth.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(8080, () => {
  console.log("Server running on 8080");
});

app.use("/api/user", router);

app.use("/api/auth", authRouter);
