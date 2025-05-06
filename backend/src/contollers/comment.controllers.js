import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) throw new ApiError("Video not found.");

  try {
    const comments = await Comment.findOne({ video: videoId })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments fetched successfully"));
  } catch (error) {
    throw new ApiError("Something went wrong.");
  }
});

const addComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;
  const { content } = req.body;

  const video = await Video.findById(videoId);

  if (!video)
    return res.status(200).json(new ApiResponse(200, {}, "Video not found"));

  if (!userId)
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User not found. Please signin"));

  try {
    const comment = await Comment.create({
      content: content,
      video: videoId,
      owner: userId,
    });

    video.comments.push(comment._id);
    await video.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment posted successfully"));
  } catch (error) {
    console.log("Error: ", error);
    return new ApiError("Something went wrong");
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findById(commentId);

  if (!comment) throw new ApiError("Comment not found.");

  if (comment.owner.toString() !== userId.toString())
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "You are not authorized to update this comment"
        )
      );

  try {
    comment.content = content;
    await comment.save();

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment Update Successful"));
  } catch (error) {
    throw new ApiError("Something went wrong");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);

  if (!comment)
    return res.status(404).json(new ApiResponse(404, {}, "Comment not found."));

  if (userId.toString() !== comment.owner.toString()) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, "Unauthorized to delete this comment"));
  }

  try {
    await Comment.findByIdAndDelete(commentId);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment deleted successfully"));
  } catch (error) {
    throw new ApiError("Something went wrong.");
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
