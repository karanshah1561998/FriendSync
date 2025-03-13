import express from "express";
import { signup, login, checkAuth, updateProfile, logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import passport from "passport";
import { generateToken } from "../lib/utils.js";
import { CONFIG } from "../lib/config.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: `${CONFIG.CLIENT_URL}/login?error=GoogleOAuthFailed`, session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "OAuth Authentication Failed" });
        }

        // Generate JWT token
        const token = generateToken(req.user._id, res);

        // Redirect user to frontend after successful login
        res.redirect(`${CONFIG.CLIENT_URL}/`);
    }
);

// Facebook OAuth Routes
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: `${CONFIG.CLIENT_URL}/login?error=FacebookOAuthFailed`, session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "OAuth Authentication Failed" });
        }

        // Generate JWT token
        const token = generateToken(req.user._id, res);

        // Redirect user to frontend after successful login
        res.redirect(`${CONFIG.CLIENT_URL}/`);
    }
);

// GitHub OAuth Routes
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: `${CONFIG.CLIENT_URL}/login?error=GithubOAuthFailed`, session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "OAuth Authentication Failed" });
        }

        // Generate JWT token
        generateToken(req.user._id, res);

        // Redirect user to frontend after successful login
        res.redirect(`${CONFIG.CLIENT_URL}/`);
    }
);

router.get("/:provider/redirect", (req, res) => {
    const { provider } = req.params;
    const validProviders = ["google", "facebook", "github"];

    if (!validProviders.includes(provider)) {
        return res.status(400).json({ message: "Invalid OAuth provider" });
    }

    const authUrl = `${CONFIG.SERVER_URL}/api/auth/${provider}`;
    res.json({ redirectUrl: authUrl });
});

export default router;