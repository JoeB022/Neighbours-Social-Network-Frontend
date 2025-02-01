import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage when app starts
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

const fetchUserProfile = async (token) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/protected", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched User Data:", data); // Debugging

      setUser({
        id: data.user_id, // Ensure ID matches backend response
        name: data.name, // Ensure name is correctly stored
        access_token: token, // Store the correct access token
      });
    } else {
      console.error("Invalid Token");
      logout();
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    logout();
  }
};


  // Register user (keeps localStorage for now)
  const register = async (name, email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return { success: false, message: "User already exists!" };
    }

    // Hash password
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { name, email, password: hashedPassword };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true, message: "Registration successful!" };
  };

  // Login user (fetches from Flask backend)
  const login = async (email, password) => {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("access_token", data.access_token);
      fetchUserProfile(data.access_token);
      return { success: true, message: "Login successful!" };
    } else {
      return { success: false, message: data.message };
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
