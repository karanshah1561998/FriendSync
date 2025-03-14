import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import googleIcon from "../assets/google-icon.png"; // Ensure you have icons
import facebookIcon from "../assets/facebook-icon.png";
import githubIcon from "../assets/github-icon.png";

const LoginPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { login, isLoggingIn, handleOAuthRedirect } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password.trim()) {
            return toast.error("Email and Password are required");;
        }

        login(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-2">
                            <MessageSquare className="size-7 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                        <p className="text-base-content/60">Sign in to your account</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">
                                Email <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-base-content/40" />
                            </div>
                            <input
                                type="email"
                                className={`input input-bordered w-full pl-10`}
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">
                                Password <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-base-content/40" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`input input-bordered w-full pl-10`}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-base-content/40" />
                                ) : (
                                    <Eye className="h-5 w-5 text-base-content/40" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                        {isLoggingIn ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                {/* Divider with OR */}
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-4 text-gray-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* OAuth Buttons as Icons */}
                <div className="flex justify-center gap-16 mb-6">
                    <button
                        onClick={() => handleOAuthRedirect("google")}
                        className="p-3 bg-white shadow-md rounded hover:scale-110 transition"
                    >
                        <img src={googleIcon} alt="Google" className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => handleOAuthRedirect("facebook")}
                        className="p-3 bg-white shadow-md rounded hover:scale-110 transition"
                    >
                        <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => handleOAuthRedirect("github")}
                        className="p-3 bg-white shadow-md rounded hover:scale-110 transition"
                    >
                        <img src={githubIcon} alt="GitHub" className="w-6 h-6" />
                    </button>
                </div>

                {/* Don't have an account? Create account */}
                <div className="text-center mt-5">
                    <p className="text-base-content/60">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="link link-primary">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;