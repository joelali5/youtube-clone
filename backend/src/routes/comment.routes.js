import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../contollers/comment.controllers.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/:videoId").post(verifyJwt, addComment);
router.route("/update-comment/:commentId").patch(verifyJwt, updateComment);
router.route("/video-comments/:videoId").get(getVideoComments);
router.route("/delete-comment/:commentId").delete(verifyJwt, deleteComment);

export default router;
