import { Like } from "../models/like.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  const video = await Video.findById(videoId);

  if (!videoId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Something went wrong"));
  }
  if (!userId)
    res
      .status(400)
      .json(new ApiResponse(400, {}, "Please signin to like a video"));

  try {
    const existingLike = await Like.findById(videoId);

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      video.likes = video.likes.filter((like) => like._id !== existingLike._id);
      await video.save();

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video unliked successfully"));
    }
    const newLike = await Like.create({
      video: videoId,
      owner: userId,
    });
    video.likes.push(newLike._id);
    await video.save();

    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Video liked successfully"));
  } catch (error) {
    console.log("Error: ", error);
    throw new ApiError("Something went wrong");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);

  if (!commentId)
    res.status(404).json(new ApiResponse(404, {}, "Comment not found"));

  if (!userId) throw new ApiError("No user found, please signin");

  try {
    const existingCommentLike = await Like.findById(commentId);
    if (existingCommentLike) {
      await Like.findByIdAndDelete(existingCommentLike._id);
      comment.likes = comment.likes.filter(
        (like) => like._id !== existingCommentLike._id
      );
      await comment.save();

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Like successfully deleted"));
    }
    const newLike = await Like.create({ comment: commentId, owner: userId });

    comment.likes.push(newLike);
    await comment.save();
    return res
      .status(201)
      .json(
        new ApiResponse(201, newLike, "You successfully liked this comment")
      );
  } catch (error) {
    console.log("Error: ", error);
    throw new ApiError("Something went wrong");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const likedVideos = await Like.find({ owner: userId }).select("video");

    const videoIds = likedVideos.map((like) => like.video);

    const videos = await Video.find({ _id: { $in: videoIds } }).populate(
      "owner",
      "firstname lastname"
    );
    return res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos fetched successfully"));
  } catch (error) {
    console.log("Error: ", error);
    throw new ApiError("Something went wrong");
  }
});

export { toggleCommentLike, toggleVideoLike, getLikedVideos };
