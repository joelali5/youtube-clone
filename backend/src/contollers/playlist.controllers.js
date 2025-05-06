import { Playlist } from "../models/playlists.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description = "" } = req.body;
  const userId = req.user._id;

  if (!name) throw new ApiError(400, "Please name your playlist");
  if (!userId) throw new ApiError(404, "Unauthorozed to create a playlist");

  try {
    const playlist = await Playlist.create({
      name,
      description,
      owner: userId,
    });
    await playlist.save();

    return res
      .status(201)
      .json(new ApiResponse(201, playlist, "Playlist created successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong");
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId.toString()) {
    throw new ApiError(400, "Unauthorized to get playlists");
  }

  try {
    const playlists = await Playlist.findOne({ owner: userId });
    if (!playlists) {
      throw new ApiError(400, "Oops! There are playlists available");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, playlists, "Playlists fetched successfully."));
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user._id;

  if (!userId)
    throw new ApiError(404, "You are unauthorized to retrieve the playlist");

  if (!playlistId) throw new ApiError(400, "Playlist unknown");

  try {
    const playlist = await Playlist.findById(playlistId).populate("videos");

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user._id;

  if (!playlistId || !videoId) {
    throw new ApiError(404, "No playlists or videos available");
  }
  if (!userId)
    throw new ApiError(404, "Unauthorized to add a video tp this playlist");

  try {
    const video = await Video.findById(videoId);
    const playlist = await Playlist.findById(playlistId);

    playlist.videos.push(video);
    await playlist.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "Video added playlist successfully.")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findById(playlistId).populate("videos");

  if (!videoId) {
    throw new ApiError(404, "No video ID provided!");
  }
  if (!playlist) {
    throw new ApiError(404, "Playlist not found!");
  }
  try {
    const filteredPlaylistVideos = playlist.videos.filter(
      (video) => video.toString() !== videoId.toString()
    );

    await Playlist.findByIdAndUpdate(playlistId, {
      videos: filteredPlaylistVideos,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Video deleted successfully!"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong.");
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user._id;

  if (!userId) throw new ApiError(400, "Unauthorised to delete playlist");
  if (!playlistId) throw new ApiError(400, "Playlist not found.");

  try {
    await Playlist.findByIdAndDelete(playlistId);

    return res.status(200).json(new ApiResponse(200, {}, "Playlist deleted."));
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  const userId = req.user._id;

  if (!userId) throw new ApiError(404, "User not found.");
  if (!playlistId) throw new ApiError(404, "Playlist not found.");

  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
      name: name,
      description: description,
    }).populate("owner", "firstname lastname");

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedPlaylist, "Playlist update successful.")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong.");
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
