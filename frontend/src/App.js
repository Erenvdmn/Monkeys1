import Register from './Views/Register';
import Login from './Views/Login';
import Cards from './Views/Cards';
import Home from './Views/Home';
import PublicCardView from './Views/Publiccardview';
import CardQR from './Views/CardQR';
import Editcard from './Views/Editcard';
import Navbar from './Components/Navbar';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Newcard from './Views/Newcard';


export default function App() {
    

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h1>Welcome to the App</h1>
                    <Link to={'/register'} style={{ display: 'block', marginTop: '20px', fontSize: '18px' }}>
                    Kayıt Ol
                    </Link>
                    <p>Veya</p>
                    <Link to={'/login'} style={{ display: 'block', marginTop: '20px', fontSize: '18px' }}>
                    Giriş Yap
                    </Link>
                </div>} />  
                <Route path="/login" element={<Login /> } />
                <Route path="/register" element={<Register />} />
                <Route path="/newcard" element={
                    <>
                        <Navbar/>
                        <Newcard />

                    </>
                } />
                <Route path="/cards" element={
                    <>
                        <Navbar />
                        <Cards />
                    </>
                } />
                <Route path="/home" element={
                    <>
                        <Navbar />
                        <Home />
                    </>
                } />
                <Route path="/card-qr/:id" element={<CardQR/>} />
                <Route path="/public-card/:id" element={<PublicCardView />} />
                <Route path="/editcard/:id" element={<Editcard />} />
            </Routes>
        </BrowserRouter>
    )
}