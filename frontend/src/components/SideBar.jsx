import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    // Local search: Only names that START with the search query
    const searchedUsers = users.filter(user =>
        user.fullName.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    // Sort users: Online users first, then offline users
    const sortedUsers = [...users].sort((a, b) => {
        const aOnline = onlineUsers.includes(a._id);
        const bOnline = onlineUsers.includes(b._id);
        return bOnline - aOnline; // Online users come first
    });

    // Apply filter for "Show Online Only"
    const filteredUsers = showOnlineOnly
        ? sortedUsers.filter((user) => onlineUsers.includes(user._id))
        : sortedUsers;

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>

                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mt-3 w-full px-2 py-1 border rounded-lg"
                />

                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">
                        ({Math.max(onlineUsers.length - 1, 0)} online)
                    </span>
                </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
                {/* Show Search Results if Searching */}
                {searchQuery.length >= 1 ? (
                    searchedUsers.length > 0 ? (
                        searchedUsers.map((user) => (
                            <button
                                key={user._id}
                                onClick={() => setSelectedUser(user)}
                                className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                                    selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
                                }`}
                            >
                                <div className="relative mx-auto lg:mx-0">
                                    <img
                                        src={user.profilePic || "/avatar.png"}
                                        alt={user.fullName}
                                        className="size-12 object-cover rounded-full"
                                    />
                                </div>

                                <div className="hidden lg:block text-left min-w-0">
                                    <div className="font-medium truncate">{user.fullName}</div>
                                    <div className="text-sm text-zinc-400">
                                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center text-zinc-500 py-4">No users found</div>
                    )
                ) : (
                    // Show Friends List when not searching
                    filteredUsers.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`w-full p-1 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                                selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
                            }`}
                        >
                            <div className="relative mx-auto lg:mx-0">
                                <img
                                    src={user.profilePic || "/avatar.png"}
                                    alt={user.fullName}
                                    className="size-12 object-cover rounded-full"
                                />
                                {onlineUsers.includes(user._id) && (
                                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                                )}
                            </div>

                            <div className="hidden lg:block text-left min-w-0">
                                <div className="font-medium truncate">{user.fullName}</div>
                                <div className="text-sm text-zinc-400">
                                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </aside>
    );
};

export default Sidebar;