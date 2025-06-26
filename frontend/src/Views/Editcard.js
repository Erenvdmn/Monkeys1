import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


export default function Editcard() {
    const [title, setTitle ] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [color, setColor] = React.useState("#000000");
    const [importance, setImportance] = React.useState("low");
    //const [objects, setObjects] = React.useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const isTokenValid = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() /1000;
            return decodedToken.exp > currentTime;
        } catch (error) {
            console.error("Token decoding error: ", error);
            return false;
        }
    };

    const handleInvalidToken = () => {
        localStorage.removeItem("token");
        alert("Geçersiz veya süresi dolmuş token. Lütfen tekrar giriş yapın.")
        navigate("/login");
    }

    React.useEffect(() => {
        const fetchCard = async () => {
            const token = localStorage.getItem("token");
            if (!token || !isTokenValid(token)) return handleInvalidToken();

            try {
                const localIP = "192.168.0.250";
                const res = await fetch(`http://${localIP}:5000/public/objects/${id}`);
                const data = await res.json();
                setTitle(data.title);
                setDescription(data.description);
                setColor(data.color);
                setImportance(data.importance)
            }catch(error) {
                console.error("Card couldn't bring", error)
            }
        };

        fetchCard();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(!token || !isTokenValid(token)) return handleInvalidToken();

        const formData = {
            title,
            description,
            color,
            importance
        };

        try {
            const localIP = "192.168.0.250";
            const res = await fetch(`http://${localIP}:5000/objects/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                alert("Card updated");
                navigate("/cards")
            } else {
                alert(data.message || "There is an error while updating")
            }
        } catch (error) {
            console.error("Sunucu hatası: ", error);
            alert("Sunucu hatası")
        }
    }

        return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Card Düzenleme</h1>
            
            
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
                    Düzenle
                </button>
            </form>
        </div>
    );
}