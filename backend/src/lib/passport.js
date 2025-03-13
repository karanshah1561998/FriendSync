import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import { Strategy as GitHubStrategy } from "passport-github2";
const { Strategy: FacebookStrategy } = await import("passport-facebook");
import { CONFIG } from "../lib/config.js";

dotenv.config();

const createOrUpdateUser = async (profile, provider, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(null, false, { message: "Email is required for OAuth login." });
        }

        let user = await User.findOne({ email });
        if (user && user.authProvider === "local") {
            return done(null, false, { message: "Account exists with email/password. Use that method." });
        }

        if (!user) {
            user = new User({
                fullName: profile.displayName,
                email,
                authProvider: provider,
                authProviderId: profile.id,
                profilePic: profile.photos?.[0]?.value || "",
                password: null, // OAuth users do not have passwords
            });
            await user.save();
        }

        return done(null, user);
    } catch (error) {
        console.error(`OAuth (${provider}) Login Error:`, error);
        return done(error, null);
    }
};

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${CONFIG.SERVER_URL}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => createOrUpdateUser(profile, "google", done)
    )
);

// ✅ Facebook OAuth Strategy
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: `${CONFIG.SERVER_URL}/api/auth/facebook/callback`,
            profileFields: ["id", "displayName", "emails", "picture.type(large)"],
        },
        async (accessToken, refreshToken, profile, done) => createOrUpdateUser(profile, "facebook", done)
    )
);

// GitHub OAuth Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${CONFIG.SERVER_URL}/api/auth/github/callback`,
            scope: ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => createOrUpdateUser(profile, "github", done)
    )
);

// Serialize User (Store user ID)
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize User (Retrieve user by ID)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.error("Error in deserializeUser:", error);
        done(error, null);
    }
});