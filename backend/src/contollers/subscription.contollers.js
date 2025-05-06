import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  if (!userId) throw new ApiError(400, "Unauthorised to access this resource");

  const user = await User.findById(userId);

  const channel = await User.findById(channelId);
  if (!channel) throw new ApiError(404, "Channel not found.");

  try {
    if (
      user.subscribedChannels.some(
        (id) => id._id.toString() === channelId.toString()
      )
    ) {
      user.subscribedChannels = user.subscribedChannels.filter(
        (id) => id._id.toString() !== channelId.toString()
      );
      await user.save();
      return res
        .status(200)
        .json(
          new ApiResponse(200, user, `Unsubscribed from ${channel.firstname}.`)
        );
    } else {
      user.subscribedChannels.push(channelId);
      await user.save();

      return res
        .status(200)
        .json(new ApiResponse(200, user, `Subscribe to ${channel.firstname}.`));
    }
  } catch (error) {
    throw new ApiError(500, "Something went wrong.");
  }
});

const getSubscriptionsList = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  try {
    const channelSubscriptionList = await User.find({
      subscribedChannels: channelId,
    }).select("firstname lastname email avatar");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelSubscriptionList,
          "Subscriptions Fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong.");
  }
});

const getSubscribedChannelsList = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  try {
    const channels = await User.findById(subscriberId).populate(
      "subscribedChannels",
      "firstname lastname email avatar"
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channels.subscribedChannels,
          "Subscribed Channels Fetched Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

export { toggleSubscription, getSubscriptionsList, getSubscribedChannelsList };
