import React from "react";
import { useNavigate } from "react-router-dom";
import ApiRequest from "../Helpers/ApiManager";

export default function App() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [message, setMessage] = React.useState("");
    const navigate = useNavigate();

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/home");
        }
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await ApiRequest("login", "POST", JSON.stringify({ email, password }), false);

        if (!res.ok) {
            const errorData = await res.json();
            setMessage(errorData.message || "Giriş başarısız");
            return;
        }        

        const data = await res.json();
        console.log("Login response:", data);
        console.log("Login response data:", data.token);
        localStorage.setItem("token", data.token); // Store token in localStorage
        setMessage(data.message);
        navigate("/home"); // Redirect to home page
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: "90%", padding: "10px", marginBottom: "10px" }}
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: "90%", padding: "10px", marginBottom: "10px" }}
                />
                <button type="submit" style={{ width: "96%", padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px" }}>
                    Giriş Yap   
                </button>
            </form>
            {message && <p style={{ marginTop: "10px", color: "#d9534f" }}>{message}</p>}
        </div>
    );
}