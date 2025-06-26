import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiRequest from '../Helpers/ApiManager';

export default function Log() {
    const [entries, setEntries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const res = await ApiRequest("entries", "GET");

                if (res.ok) {
                    const data = await res.json();
                    setEntries(data);
                } else {
                    alert("Nesneleri alırken hata oluştu.");
                    navigate("/login")
                }
            } catch (error) {
                console.error("Fetch error:", error);
                alert("Sunucu hatası");
            }
        };

        fetchEntries();
    },[]);

    return (
        <div className='logs-list'>
            {
                entries.map((entry) => (
                <div key={entry._id} className='log-row'>
                    <p>E-mail: {entry.email} -- True/False: {entry.isCorrect.toString()} -- Date: {new Date(entry.createdAt).toLocaleString()}</p>
                </div>
            ))

            }

        <style>{
            `.logs-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            }

            .log-row {
            background-color: #f5f5f5;
            border-left: 5px solid #4caf50;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            font-family: 'Segoe UI', sans-serif;
            transition: transform 0.2s ease;
            }

            .log-row:hover {
            transform: translateY(-2px);
            }

            .log-row p {
            margin: 5px 0;
            color: #333;
            font-size: 16px;
            line-height: 1.5;
            }
            `
            }</style>
        </div>
        
    )
    
}