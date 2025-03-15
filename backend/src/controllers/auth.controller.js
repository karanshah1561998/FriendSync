import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

const checkOAuthProvider = (user, provider) => {
    if (user?.authProvider && user.authProvider !== "local") {
        return `Email already registered via ${user.authProvider}. Use ${user.authProvider} Sign-In.`;
    }
    return null;
};

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All Fields Are Required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password Must Be At Least 8 Characters" });
        }

        const existingUser = await User.findOne({ email });

        const oauthMessage = checkOAuthProvider(existingUser);
        if (oauthMessage) {
            return res.status(400).json({ message: oauthMessage });
        }

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            authProvider: "local",
        });
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                authProvider: newUser.authProvider,
                createdAt: newUser.createdAt,
            });
        } else {
            res.status(400).json({ message: "Invalid User Data" });
        }
    } catch (error) {
        console.log("Error In Signup Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User doesn't exist with this email"});
        }

        // Prevent login with password if the user registered via OAuth
        const oauthMessage = checkOAuthProvider(user);
        if (oauthMessage) {
            return res.status(400).json({ message: oauthMessage });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            authProvider: user.authProvider,
            createdAt: user.createdAt,
        })
    } catch (error) {
        console.log("Error In Login Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { profilePic } = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Profile Pic Is Required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            width: 500,
            height: 500,
            crop: "limit",
            quality: "auto:low",
            fetch_format: "auto",
        });
        const updateUser = await User.findByIdAndUpdate(
        userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json({updateUser});
    } catch (error) {
        console.log("Error in UpdateProfile Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user._id;
        await User.findByIdAndDelete(userId);

        res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.log("Error in DeleteProfile Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not Authenticated" });
        }
        res.status(200).json({
            _id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            profilePic: req.user.profilePic,
            authProvider: req.user.authProvider,
            createdAt: req.user.createdAt,
        });
    } catch (error) {
        console.log("Error In CheckAuth Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getLastSeen = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("lastSeen");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ lastSeen: user.lastSeen });
    } catch (error) {
        console.error("Error fetching last seen:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};