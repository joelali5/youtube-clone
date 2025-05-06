import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ApiError } from "./ApiError.js";

export const sendMail = async ({ email, emailType, userId }) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "aeef2c364d0fa7",
        pass: "9ed33a7faded51",
      },
    });

    const mailOptions = {
      from: "jimmyaliyu1@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p><a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">Click here</a> to ${
        emailType === "VERIFY" ? "Verify your email" : "Reset your password"
      }</p>. <p>Copy and paste this link in your browser:
        <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
    };

    const response = await transporter.sendMail(mailOptions);
    return response;
  } catch (error) {
    throw new ApiError("Something went wrong sending email");
  }
};
