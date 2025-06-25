import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PublicCardView() {
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    
    useEffect(() => {
        const fetchCard = async () => {
            try {
                const token = localStorage.getItem("token");
                const localIP = "192.168.1.102"; // bilgisayarının IP’si
                const res = await fetch(`http://${localIP}:5000/public/objects/${id}`, {

                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setCard(data);
                } else {
                    setError("Kart bulunamadı");
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setError("Sunucu hatası");
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [id]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>Yükleniyor...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ textAlign: 'center', color: '#ff4d4d' }}>
                    <h2>Hata</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            padding: '20px',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                backgroundColor: card.color,
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                maxWidth: '400px',
                width: '100%',
                color: 'white',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
            }}>
                <h1 style={{ 
                    textAlign: 'center', 
                    margin: '0 0 20px 0',
                    fontSize: '24px'
                }}>
                    {card.title}
                </h1>
                <p style={{ 
                    margin: '15px 0',
                    fontSize: '16px',
                    lineHeight: '1.5'
                }}>
                    {card.description}
                </p>
                <p style={{ 
                    margin: '15px 0',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    Önemi: {card.importance}
                </p>
            </div>
        </div>
    );
}