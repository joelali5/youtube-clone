import { Router } from "express";
import {
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  getAllVideos,
} from "../contollers/video.controllers.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router
  .route("/publish-video")
  .post(verifyJwt, upload.single("videoFile"), publishAVideo);

router.route("/:videoId").get(verifyJwt, getVideoById);
router
  .route("/update-video/:videoId")
  .patch(verifyJwt, upload.single("thumbnail"), updateVideo);

router.route("/delete-video/:videoId").delete(verifyJwt, deleteVideo);
router.route("/").get(getAllVideos);

export default router;
