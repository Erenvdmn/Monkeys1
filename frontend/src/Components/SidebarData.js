import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
    {
        title: "Home",
        path: "/home",
        icon: <FaIcons.FaHome />,
        cName: "nav-text"
    },
    {
        title: "Cards",
        path: "/cards",
        icon: <IoIcons.IoIosPaper />,
        cName: "nav-text"
    },
    {
        title: "New Card",
        path: "/newcard",
        icon: <IoIcons.IoIosPaper />,
        cName: "nav-text"
    },
    {
        title: "Log Out",
        path: "/",
        icon: <IoIcons.IoMdLogOut />,
        cName: "nav-text",
        action: "logout"
    }
]
