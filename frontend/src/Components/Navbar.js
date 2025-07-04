import React from "react";
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom';
import * as AiIcons from "react-icons/ai";
import './Navbar.css';
import { SidebarData } from "./SidebarData";

function Navbar() {
    const [sidebar, setSidebar] = React.useState(false);

    const showSidebar = () => setSidebar(!sidebar);

    return (
        <>
            <div className="navbar">
                <Link to="#" className='menu-bars' >
                    <FaIcons.FaBars onClick={showSidebar}/>          
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items'>
                    <li className="navbar-toggle">
                        <Link to="#" className='menu-bars'>
                            <AiIcons.AiOutlineClose onClick={showSidebar}/>
                        </Link>
                    </li>
                    {SidebarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path} onClick={(e) => {
                                    
                                    if(item.action === "logout") {
                                        e.preventDefault();
                                        const confirmLogout = window.confirm("Are you sure you wanna Log Out?");
                                        if(confirmLogout) {
                                            localStorage.removeItem("token");
                                            window.location.href = "/";
                                        }else {
                                            showSidebar();
                                        }
                                    }
                                }}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </>
    );
}

export default Navbar;