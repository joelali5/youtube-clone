import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import { User } from "../models/user.model.js";

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:7000/api/v1/auth-1/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user = await User.findOne({ email });

        if (!user) {
          await User.create({
            firstname: profile.displayName.split(" ")[0],
            lastname: profile.displayName.split(" ")[1],
            avatar: profile.photos[0].value,
            provider: "github",
            providerId: profile.id,
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
