import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiRequest from '../Helpers/ApiManager';
import './Log.css';

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
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>E-mail</th>
                            <th>Successful</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((entry) => (
                            <tr key={entry.id || entry.email + entry.createdAt}>
                                <td>{entry.email}</td>
                                <td>{entry.isCorrect ? (
                                    <span className='success-icon'>✅</span>
                                ) : (
                                    <span className='failure-icon'>❌</span>
                                
                                )}</td>
                                <td>{new Date(entry.createdAt).toLocaleString()}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
        </div>
    )
    
}