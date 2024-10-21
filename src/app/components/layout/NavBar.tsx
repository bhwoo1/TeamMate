"use client"


import Link from "next/link";
import React from "react";



const NavBar:React.FC = () => {
    
    return(
        <header className="fixed left-0 right-0 top-0 py-4 z-50 user-not-selectable bg-white">
            <nav className="container mx-auto flex items-center justify-between">
                <Link href="/">팀메이트</Link>
                
            </nav>
        </header>
    );
}

export default NavBar;