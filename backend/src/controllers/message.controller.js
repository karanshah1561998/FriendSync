import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error In GetUsersForSideBar Controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error "});
    }
};

export const getMessages = async (req, res) => {
    try {
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        const messages = await MessageChannel.find({
            $or:[
                {senderId: senderId, receiverId: receiverId},
                {senderId: receiverId, receiverId: senderId}
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error In GetMessages Controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error "});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadresponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadresponse.secure_url;
        }

        const newMessage = new MessageChannel({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error In SendMessages Controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error "});
    }
}