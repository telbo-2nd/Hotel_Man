import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Hotel } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { login as loginApi, getMe } from "../../api/auth.api";
import toast from "react-hot-toast";

export default function Login() {
    const { login }    = useAuth();
    const navigate     = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [loading,  setLoading]  = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res   = await loginApi(data);
            const token = res.data.token;

            localStorage.setItem("token", token);
            const meRes = await getMe();
            const u     = meRes.data.user;

            const user = { ...u, name: `${u.Firstname} ${u.Lastname}` };

            login(token, user);
            toast.success(`Welcome back, ${user.name}!`);

            if (user.role === "admin") {
                navigate("/dashboard/admin");
            } else {
                navigate("/dashboard/receptionist");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* left — hotel image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop"
                    alt="Hotel lobby"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-[#1a3a6e]/40 to-transparent" />
                {/* text on image */}
                <div className="absolute bottom-12 left-10 text-white">
                    <h1 className="text-4xl font-bold">GrandStay Pro</h1>
                    <p className="text-blue-200 mt-2 text-lg">
                        Precision management for world-class hospitality.
                    </p>
                </div>
            </div>

            {/* right — login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">

                    {/* logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-[#1a3a6e] p-2.5 rounded-xl">
                            <Hotel className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#1a3a6e]">GrandStay Pro</h2>
                            <p className="text-xs text-gray-400">Enterprise Management Suite</p>
                        </div>
                    </div>

                    {/* title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Sign in to your account to continue
                    </p>

                    {/* form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Work Email
                            </label>
                            <input
                                type="email"
                                placeholder="name@hotel.com"
                                className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-all
                                    ${errors.email
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                        : "border-gray-300 focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                                    }`}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email address",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-2.5 pr-11 text-sm border rounded-lg outline-none transition-all
                                        ${errors.password
                                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-gray-300 focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                                        }`}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPass
                                        ? <EyeOff className="w-4 h-4" />
                                        : <Eye className="w-4 h-4" />
                                    }
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-[#1a3a6e] text-white text-sm font-semibold rounded-lg hover:bg-[#162f58] active:bg-[#112444] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    {/* footer */}
                    <p className="text-center text-xs text-gray-400 mt-8">
                        🔒 AES-256 Enterprise Encrypted
                    </p>
                </div>
            </div>
        </div>
    );
}