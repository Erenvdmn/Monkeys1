import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ApiRequest from '../Helpers/ApiManager';


export default function Newcard() {
    const [email, setEmail] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [color, setColor] = React.useState("#000000");
    const [importance, setImportance] = React.useState("low");
    const [objects, setObjects] = React.useState([]);
    const navigate = useNavigate();


    // isTokenValid
    const isTokenValid = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert to seconds
            return decodedToken.exp > currentTime; // Check if token is not expired
        } catch (error) {
            console.error("Token decoding error:", error);
            return false; // If decoding fails, consider token invalid
        }
    };

    // Check if token is valid and navigate login page if not
    const handleInvalidToken = () => {
        localStorage.removeItem("token");
        alert("Geçersiz veya süresi dolmuş token. Lütfen tekrar giriş yapın.");
        navigate("/login");
    };

    React.useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Lütfen giriş yapın.");
            return navigate("/login");
        }

        if (!isTokenValid(token)) {
            handleInvalidToken();
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            setEmail(decodedToken.email);
        } catch (err) {
            alert("Geçersiz giriş. Lütfen tekrar giriş yapın.");
            return navigate("/login");
        }

        try {
            const localIP = "192.168.0.250";
            const res = await ApiRequest("objects", "GET");

            if (res.status === 401 || res.status === 403) {
                handleInvalidToken();
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setObjects(data); // ← gelen veriyi state'e kaydet
            } else {
                console.error("Nesneler alınamadı");
            }
        } catch (error) {
            alert("Sunucu hatası");
            console.error(error);
        }
    };

    fetchData();
}, []);


        const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");


        if (!token || !isTokenValid(token)) {
            handleInvalidToken();
            return;
        }
        
        // Handle form submission here
        const formData = {
            title,
            description,
            color,
            importance
        };
        
        console.log('Form submitted:', formData);
        
        try {
            const localIP = "192.168.0.250";
            const res = await fetch(`http://${localIP}:5000/objects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Include token in the request header
                },
                body: JSON.stringify(formData)
            });

            if (res.status === 401 || res.status === 403) {
                handleInvalidToken();
                return;
            }

            const data = await res.json();

            if (res.ok) {
                setObjects(prevObjects => [...prevObjects, data]); // Add new object to the state
                console.log("Object created successfully:", data);
                alert("Object created successfully!");
                // Optionally, reset form fields
                setTitle("");
                setDescription("");
                setColor("#000000");
                setImportance("low");
                navigate('/cards');
            } else {
                console.error("Error creating object:", data.message);
                alert(data.message || "Error creating object");
            }
        }catch (error) {
            console.error("Error:", error);
            alert("sunucu hatası");
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Yeni Card Oluşturun!</h1>
            
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label style={{ fontSize: '18px' }}>Title:</label>
                    <br />
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '300px', padding: '10px', margin: '10px 0' }} 
                    />
                </div>
                
                <div>
                    <label style={{ fontSize: '18px' }}>Description:</label>
                    <br />
                    <input 
                        type="text" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: '300px', padding: '10px', margin: '10px 0' }} 
                    />
                </div>
                
                <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '18px' }}>Color:</label>
                    <div 
                        style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: color,
                            border: '2px solid #ccc',
                            borderRadius: '4px'
                        }}
                    ></div>
                </div>
                <input 
                    type="color" 
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ width: '300px', padding: '10px', margin: '10px 0' }} 
                />
            </div>
                
                <div>
                    <label style={{ fontSize: '18px' }}>Importance:</label>
                    <br />
                    <select 
                        value={importance}
                        onChange={(e) => setImportance(e.target.value)}
                        style={{ width: '300px', padding: '10px', margin: '10px 0' }}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                
                <button 
                    type="submit" 
                    style={{ 
                        padding: '10px 20px', 
                        fontSize: '16px', 
                        backgroundColor: '#28a745', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Oluştur
                </button>
            </form>
        </div>
    );
}