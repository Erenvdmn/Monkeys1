import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiRequest from '../Helpers/ApiManager';

export default function Log() {
    const [entries, setEntries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const localIP = "192.168.0.250";
                const res = await ApiRequest("objects", "GET");

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

        fetchData();
    });

    
}