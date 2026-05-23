import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user,    setUser]    = useState(null);
    const [loading, setLoading] = useState(true);

    // getMe returns Firstname/Lastname now — add a computed name
    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        getMe()
            .then((res) => {
                const u = res.data.user;
                setUser({ ...u, name: `${u.Firstname} ${u.Lastname}` });
            })
            .catch(() => {
                localStorage.removeItem("token");
            })
            .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
}, []);

const login = (token, userData) => {
    localStorage.setItem("token", token);
    const userWithName = {
        ...userData,
        name: `${userData.Firstname} ${userData.Lastname}`
    };
    localStorage.setItem("user", JSON.stringify(userWithName));
    setUser(userWithName);
};

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);