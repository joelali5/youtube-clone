import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import requestIp from "request-ip";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, sortBy = "-createdAt", query } = req.query;

  try {
    if (query) {
      const queryArr = query.split(" ");
      const owner = await User.find({
        $or: [{ firstname: queryArr[0] }, { lastname: queryArr[1] }],
      }).select("_id");

      const userIds = owner.map((user) => user._id);

      const videos = await Video.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { owner: { $in: userIds } },
        ],
      })
        .populate("owner", "firstname lastname avatar")
        .sort(sortBy)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      if (videos.length === 0) {
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              { videos, "Data Length": videos.length },
              "There are no videos"
            )
          );
      }
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { videos, "Data Length": videos.length },
            "Videos fetched successfully"
          )
        );
    } else {
      const videos = await Video.find()
        .populate("owner", "fullname avatar")
        .sort(sortBy)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      if (videos.length === 0) {
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              { videos, "Data Length": videos.length },
              "There are no videos"
            )
          );
      }
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { videos, "Data Length": videos.length },
            "Videos fetched successfully"
          )
        );
    }
  } catch (error) {
    throw new ApiError(400, "Error fetching videos");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoLocalPath = req.file?.path;

  if (!title || !description) {
    throw new ApiError(400, "Title and Description are required");
  }
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  let videoFile;
  try {
    videoFile = await uploadToCloudinary(videoLocalPath);
    console.log("Video uploaded to cloudinary");
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error uploading video...");
  }

  try {
    const newVideo = await Video.create({
      title,
      description,
      videoFile: videoFile?.url,
      thumbnail: videoFile?.url,
      duration: Math.round(videoFile?.duration),
      owner: req.user._id,
    });

    const createdVideo = await Video.findById(newVideo._id).populate(
      "owner",
      "fullname username email avatar"
    );
    return res
      .status(200)
      .json(new ApiResponse(201, createdVideo, "Video created successfully"));
  } catch (error) {
    console.log("Video creation failed", error);
    if (videoFile) {
      await deleteFromCloudinary(videoFile.public_id);
    }
    throw new ApiError(500, "Error creating video and video deleted!");
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // const userIpAddress = requestIp.getClientIp(req);

  const userId = req.user?._id;

  const user = await User.findById(userId);

  let video = await Video.findById(videoId).populate(
    "owner",
    "firstname lastname email"
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!req.cookies[`viewed_${videoId}`]) {
    video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("owner", "firstname lastname email");
  }

  if (user) {
    user.watchHistory.push(video);
    await user.save();
  }

  return res
    .cookie(`viewed_${videoId}`, true, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    })
    .json(
      new ApiResponse(200, video, "Video fecthed successfully & views counted")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath)
    throw new ApiError(400, "Thumbnail local path is required");

  if (!title || !description || !thumbnailLocalPath) {
    throw new ApiError(400, "Title, Description and Thumbnail are required");
  }

  let thumbnail;
  try {
    thumbnail = await uploadToCloudinary(thumbnailLocalPath);
    console.log("Video successfully uploaded to cloudinary");
  } catch (error) {
    throw new ApiError(500, "Error uploading video...");
  }

  try {
    const updatedVideo = await Video.findOneAndUpdate(
      { _id: videoId },
      { title: title, description: description, thumbnail: thumbnail?.url },
      { new: true }
    ).populate("owner", "username email fullname");
    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video successfully updated"));
  } catch (error) {
    console.log("Video update failed");
    if (thumbnail) {
      await deleteFromCloudinary(thumbnail);
    }
    throw new ApiError(
      400,
      "Video update failed and video deleted from cloudinary"
    );
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  const loggedInUser = req.user._id;
  const videoOwner = video.owner;

  console.log(video);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (loggedInUser.toString() !== videoOwner.toString()) {
    throw new ApiError(400, "Unauthorized to delete this video");
  }

  function extractPublicId(videoUrl) {
    const urlArr = videoUrl.split("/");
    const fileName = urlArr.pop();
    return fileName.split(".");
  }

  try {
    console.log("Video deleted from cloudinary");
    await deleteFromCloudinary(extractPublicId(video.videoFile));
    await Video.findOneAndDelete(videoId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video deleted successfully"));
  } catch (error) {
    console.log(error.message);
    throw new ApiError(400, "Unable to delete video");
  }
});

// const getUserWatchHistory = asyncHandler(async (req, res) => {
//   const userId = req.user?._id;

//   const userWatchHistory = await User.findById(userId).watchHistory;

//   console.log(userWatchHistory);
// });

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
};

/*
TODOS
1. Perform an aggregation to return the number of likes on a video and add the field to the videos
*/
