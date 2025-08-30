import React from "react";
import SidebarCard, { type SidebarProps } from "./SidebarCard";
import { faUsers, faCreditCard } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {

    const sidebarEl: SidebarProps[] = [
        {icon: faUsers, label: 'Atleti'},
        {icon: faCreditCard, label: 'Abbonamenti'}
    ]

    return (
        <>
        <div className="min-h-screen py-25 flex flex-col items-center gap-4 w-100 ">
            {sidebarEl.map(el => 
                <SidebarCard icon={el.icon} label={el.label}/>
            )}
            
        </div>
        </>
    )
}