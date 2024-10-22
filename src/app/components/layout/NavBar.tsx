"use client"

import React from "react";
import Menu from "./Menu";

const NavBar: React.FC = () => {

    return (
        <header className={`fixed left-0 top-0 h-full p-8 z-10 user-not-selectable bg-white flex flex-col justify-between`}>
            <nav className="flex flex-col items-start space-y-4 p-8">
                <Menu />
            </nav>
        </header>
    );
}

export default NavBar;