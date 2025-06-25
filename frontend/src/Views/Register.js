import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({
        FirstName: '',
        LastName: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        setMessage(data.message);
        navigate('/login'); // Redirect to login page after successful registration
    };

    return (
        <div style={{maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Kayıt Ol</h2>
            <form onSubmit={handleSubmit}> {/* onSubmit -> onSubmit düzeltildi */}
                <input
                    type="text"
                    name="FirstName"
                    placeholder="Ad"
                    value={form.FirstName}
                    onChange={handleChange}
                    required
                    style={{ width: '90%', padding: '10px', marginBottom: '10px' }}
                />
                <input
                    type="text"
                    name="LastName"
                    placeholder="Soyad"
                    value={form.LastName}
                    onChange={handleChange}
                    required
                    style={{ width: '90%', padding: '10px', marginBottom: '10px' }}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ width: '90%', padding: '10px', marginBottom: '10px' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Şifre"
                    value={form.password}  
                    onChange={handleChange}
                    required
                    style={{ width: '90%', padding: '10px', marginBottom: '10px' }}
                />
                <button type="submit" style={{ width: '96%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
                    Kayıt Ol
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}