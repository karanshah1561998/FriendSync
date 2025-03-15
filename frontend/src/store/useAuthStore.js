import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5055" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    lastSeenUsers: {},
    socket: null,
    typingUsers: {},

    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in UseAuthStore: ", error.response?.data || error.message);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            console.error("Error logging out:", error);
            toast.error(error.response?.data?.message || "Failed to log out.");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set((state) => ({ authUser: { ...state.authUser, ...res.data } }));
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    deleteProfile: async () => {
        try {
            await axiosInstance.delete("/auth/delete-profile");
            set({ authUser: null });
            toast.success("Profile deleted successfully");
        } catch (error) {
            console.error("Error deleting profile:", error);
            toast.error("Failed to delete profile.");
        }
    },

    handleOAuthRedirect: async (provider) => {
        try {
            const response = await axiosInstance.get(`/auth/${provider}/redirect`);

            if (response.data.redirectUrl) {
                window.location.assign(response.data.redirectUrl);
            } else {
                toast.error(`${provider} login failed`);
            }
        } catch (error) {
            console.error(`${provider} OAuth Error:`, error);
            toast.error(`${provider} login failed`);
        }
    },

    sendTypingEvent: (receiverId, stopTyping = false) => {
        const { authUser, socket } = get();
        if (!authUser || !socket) return;

        socket.emit(stopTyping ? "stopTyping" : "typing", {
            senderId: authUser._id,
            receiverId
        });
    },

    getLastSeen: async (userId) => {
        try {
            if (!userId || get().lastSeenUsers[userId]) return;

            const response = await axiosInstance.get(`/auth/last-seen/${userId}`);
            set((state) => ({
                lastSeenUsers: { ...state.lastSeenUsers, [userId]: response.data.lastSeen }
            }));
        } catch (error) {
            console.log("Error fetching last seen:", error.response?.data || error.message);
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        socket.on("userTyping", ({ senderId }) => {
            set((state) => ({
                typingUsers: { ...state.typingUsers, [senderId]: true },
            }));
        });

        socket.on("userStoppedTyping", ({ senderId }) => {
            set((state) => {
                const updatedTypingUsers = { ...state.typingUsers };
                delete updatedTypingUsers[senderId];
                return { typingUsers: updatedTypingUsers };
            });
        });

        socket.on("userDisconnected", ({ userId, lastSeen }) => {
            set((state) => ({
                lastSeenUsers: { ...state.lastSeenUsers, [userId]: lastSeen },
            }));
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));