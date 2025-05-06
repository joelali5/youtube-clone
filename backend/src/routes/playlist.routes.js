import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../contollers/playlist.controllers.js";

const router = Router();

router.route("/create-playlist").post(verifyJwt, createPlaylist);
router.route("/get-user-playlists").get(verifyJwt, getUserPlaylists);
router.route("/get-a-playlist/:playlistId").get(verifyJwt, getPlaylistById);
router
  .route("/add-video-to-playlist/:playlistId/:videoId")
  .post(verifyJwt, addVideoToPlaylist);

router
  .route("/remove-video-from-playlist/:playlistId/:videoId")
  .delete(verifyJwt, removeVideoFromPlaylist);

router.route("/delete-playlist/:playlistId").delete(verifyJwt, deletePlaylist);

router.route("/update-playlist/:playlistId").patch(verifyJwt, updatePlaylist);

export default router;
