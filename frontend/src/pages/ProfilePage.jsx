import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Trash2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {

    const { authUser, isUpdatingProfile, updateProfile, deleteProfile } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateProfile({ profilePic: base64Image });
        };
    };

    const handleDeleteProfile = async () => {
        if (deleteInput !== "delete") {
            toast.error("You must type 'delete' to confirm account deletion.");
            return;
        }
        setIsDeleting(true);
        await deleteProfile();
        setIsDeleting(false);
    };

    return (
        <div className="h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-xl shadow-md rounded-xl p-6 space-y-8 mt-10">
                <div className="bg-base-300 h-5/6 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold ">Profile</h1>
                        <p className="mt-2">Your profile information</p>
                    </div>

                    {/* avatar upload section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img
                                src={
                                    selectedImg ||
                                    (authUser?.profilePic?.startsWith("http") ? authUser.profilePic : "/avatar.png")
                                }
                                alt="Profile"
                                className="size-32 rounded-full object-cover border-4"
                            />

                            <label
                                htmlFor="avatar-upload"
                                className={`
                                    absolute bottom-0 right-0
                                    bg-base-content hover:scale-105
                                    p-2 rounded-full cursor-pointer
                                    transition-all duration-200
                                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                                `}
                            >
                                <Camera className="w-5 h-5 text-base-200" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-400">
                            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                        </p>
                    </div>

                    {/* User details */}
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                        </div>
                    </div>

                    {/* Account details */}
                    <div className="mt-6 bg-base-300 rounded-xl p-6">
                        <h2 className="text-lg font-medium  mb-4">Account Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                                <span>Member Since</span>
                                <span>{authUser?.createdAt ? new Date(authUser.createdAt).getFullYear() : "Unknown"}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span>Account Status</span>
                                <span className="text-green-500">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* DELETE PROFILE BUTTON */}
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full p-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-5 h-5" />
                        Delete Profile
                    </button>

                </div>
            </div>

            {/* DELETE PROFILE MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold text-center text-red-600">Confirm Profile Deletion</h2>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            Type <strong>delete</strong> to confirm account deletion.
                        </p>
                        <input
                            type="text"
                            className="w-full p-2 border rounded mt-3"
                            placeholder="Type 'delete' here..."
                            value={deleteInput}
                            onChange={(e) => setDeleteInput(e.target.value)}
                        />
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition flex items-center gap-1"
                            >
                                <XCircle className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProfile}
                                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1 ${
                                    deleteInput !== "delete" ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                disabled={deleteInput !== "delete"}
                            >
                                <Trash2 className="w-4 h-4" />
                                {isDeleting ? "Deleting..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;