import React from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

export default function CardQR() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const localIP = "192.168.0.250"; 
    const qrUrl = `http://${localIP}:3000/public-card/${id}`;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>
                 <h2>QR Kodu</h2>
                 <QRCodeCanvas value={qrUrl} size={256} />
                 <p style={{ marginTop: '20px'}}>ID: {id}</p>
                 <p style={{ fontSize: '12px', color: '#666' }}>URL: {qrUrl}</p>
                 <button style={{
                    padding: '10px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: 'rgb(11, 14, 174)',
                    color: 'white',
                    flexShrink: '0',
                }} onClick={() => navigate("/cards")}>Cards</button>
            </div>
        </div>
    )
}