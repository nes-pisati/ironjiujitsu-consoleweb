import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export interface SidebarProps {
    icon: IconDefinition;
    label: string;
    //navigateTo: string;
}

export default function SidebarCard(props: SidebarProps) {
    return (
        <div className="w-80 h-15 ps-8 flex items-center rounded-2xl gap-8 transition-all duration-100 ease-in hover:bg-gray-200">
            <FontAwesomeIcon icon={props.icon} size="xl" />
            <p className="text-xl font-semibold">{props.label}</p>
        </div>
    )
}