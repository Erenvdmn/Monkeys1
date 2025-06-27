import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiRequest from '../Helpers/ApiManager';
import './Cards.css';

export default function Cards() {
    const [objects, setObjects] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchObjects = async () => {
            const token = localStorage.getItem("token");

            try {
                
                const res = await ApiRequest("objects", "GET");

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
            const res = await ApiRequest(`objects/${id}`, "DELETE");

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
        </div>
    );
}
