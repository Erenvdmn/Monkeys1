import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import loadingImg from '../Components/loading.svg';


export default function Home() {
    const [email, setEmail] = React.useState("");
    const [dolar, setDolar] = React.useState("");
    const [showImg, setShowImg ] = React.useState(true);
    const [text, setText] = React.useState('');
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

            if(!token) {
                handleInvalidToken();
                alert("lütfen giriş yapın");
                return navigate("/login");
            }
            if(!isTokenValid(token)) {
                handleInvalidToken();
                alert("oturum süreniz doldu, tekrar giriş yapın");
                return navigate("/login");
            }

            try {
                const decodedToken = jwtDecode(token);
                setEmail(decodedToken.email);
            } catch (error) {
                alert("Geçersiz giriş. Lütfen tekrar giriş yapın.");
                return navigate("/login");
            }

            try {
    const res = await fetch("http://localhost:5000/dolar");
    const data = await res.json();
    setDolar(data.kur); // Ekranda da göstermek istersen

    setTimeout(() => {
        setShowImg(false);
        setText(`Güncel Dolar Kuru: ${data.kur}`); // Burada dolar yerine doğrudan data.kur kullanıyoruz
    });
} catch (error) {
    console.error("Dolar verisi çekilemedi", error);
}



        }

        

        fetchData();
    }, []);

    


    return (
        <div style={{ textAlign: 'center', marginTop: '50px'}}>
            <h1>Hoş Geldiniz!</h1>
            {email && <p style={{fontsize: '18px'}}>Email: {email}</p>}
            <div>
                {
                    showImg ? (
                        <img src={loadingImg} style={{ width: 50}} alt="Yükleniyor..." />
                    ) : (
                        <h3>{text}</h3>
                    )
                }
            </div>
        </div>

    )
}