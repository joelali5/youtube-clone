import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
} from "../contollers/like.controllers.js";

const router = Router();

router.route("/:videoId").post(verifyJwt, toggleVideoLike);
router.route("/liked-videos").get(verifyJwt, getLikedVideos);
router.route("/comment/:commentId").post(verifyJwt, toggleCommentLike);

export default router;
