import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse.js";

const router = Router();

router
  .route("/github")
  .get(passport.authenticate("github", { scope: ["user:email"] }));

router
  .route("/callback")
  .get(
    passport.authenticate("github", { session: false }),
    async (req, res) => {
      const user = req.user;

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
      );

      user.refreshToken = refreshToken;
      await user.save();

      const options = {
        httpOnly: true,
        secure: (process.env.NODE_ENV = "production"),
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, user, "User logged in successfully"));
    }
  );
export default router;
