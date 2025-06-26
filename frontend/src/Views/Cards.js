import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cards() {
    const [objects, setObjects] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchObjects = async () => {
            const token = localStorage.getItem("token");

            try {
                const localIP = "192.168.0.250";
                const res = await fetch(`http://${localIP}:5000/objects`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setObjects(data);
                } else {
                    alert("Nesneleri alırken hata oluştu.");
                    navigate("/login")
                }
            } catch (error) {
                console.error("Fetch error:", error);
                alert("Sunucu hatası");
            }
        };

        fetchObjects();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");

        try {
            const localIP = "192.168.0.250";
            const res = await fetch(`http://${localIP}:5000/objects/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                setObjects(prev => prev.filter(obj => obj._id !== id));
            } else {
                alert("Silme başarısız");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    

    return (
        <div className="cards-container">
            {
                objects.map((object) => (
                    <div key={object._id} className='card' style={{ backgroundColor: object.color }}>
                        <h3 style={{ textAlign: "center" }}>{object.title}</h3>
                        <p>{object.description}</p>
                        <p>Önemi: {object.importance}</p>
                        <div className='button-container'>
                            <button onClick={() => handleDelete(object._id)} className='delete-button'>Sil</button>
                            <button className='edit-button' onClick={() => navigate(`/editcard/${object._id}`)}>Edit Card</button>
                            <button className='showqr-button' onClick={() => navigate(`/card-qr/${object._id}`)}>Show QR</button>
                        </div> 
                    </div>
                ))
            }
            <style>{`
                .cards-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: center;
                    align-items: flex-start;
                    padding: 20px;
                    margin-top: 10px;
                }
                .card {
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    width: 300px;
                    height: auto;
                    min-height: 150px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
                }
                .card h3 {
                    margin: 0;
                    margin-bottom: 15px;
                    flesx-shrink: 0;
                }

                .card p{
                    margin: 10px 0;
                    flex-grow: 1;
                    word-wrap: break-word;
                    line-height: 1.4;                
                }

                .button-container {
                    display: flex;
                    justify-content: space-between;
                    margin-top: auto;
                    gap:10px
                }

                .delete-button {
                    padding: 10px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    background-color: #ff4d4d;
                    color: white;
                    flex-shrink: 0;
                }

                .showqr-button {
                    padding: 10px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    background-color:rgb(11, 14, 174);
                    color: white;
                    flex-shrink: 0;
                }
                
                .edit-button {
                    padding: 10px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    background-color:rgb(11, 14, 174);
                    color: white;
                    flex-shrink: 0;
                }
            `}</style>
        </div>
    );
}
