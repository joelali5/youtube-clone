import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import googleAuthRouter from "./routes/google.auth.routes.js";
import githubAuthRouter from "./routes/github.auth.routes.js";
import subscriptionRouter from "./routes/subcription.routes.js";
import "./passportSocialLogin/google.passport.js";
import "./passportSocialLogin/github.passport.js";
import passport from "passport";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(passport.initialize());

app.get("/auth1", (req, res) => {
  res.send(`
    <a href="api/v1/auth/google">Authenticate with Google</a><br>
    <a href="api/v1/auth-1/github">Authenticate with Github</a>
`);
});

import healthcheckRouter from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/auth", googleAuthRouter);
app.use("/api/v1/auth-1", githubAuthRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

export { app };
