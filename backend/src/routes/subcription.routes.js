import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  getSubscribedChannelsList,
  getSubscriptionsList,
  toggleSubscription,
} from "../contollers/subscription.contollers.js";

const router = Router();

router.route("/:channelId").post(verifyJwt, toggleSubscription);
export default router;

router
  .route("/subscription-list/:channelId")
  .get(verifyJwt, getSubscriptionsList);

router
  .route("/subscriber-channel-list/:subscriberId")
  .get(verifyJwt, getSubscribedChannelsList);
