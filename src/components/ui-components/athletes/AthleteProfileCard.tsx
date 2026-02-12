import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export interface AthleteProfileProps {
    icon: IconDefinition;
    title: string;
    children: React.ReactNode;
    buttonText: string;
    onButtonClick: () => void;
    buttonIcon: IconDefinition
}

export default function AthleteProfileCard(props: AthleteProfileProps) {

    return (
        <div className="border border-gray-300 p-8 rounded-xl h-auto flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-10">
                    <FontAwesomeIcon icon={props.icon} size="lg" />
                    <p className="text-xl font-semibold">{props.title}</p>
                </div>
                <div>
                    {props.children}
                </div>
            </div>
            <div className="pt-10">
                <button className="border border-gray-40 w-full font-bold text-sm py-3 px-6 rounded-xl items-center gap-5 bg-black text-white flex justify-center hover:cursor-pointer" onClick={props.onButtonClick}>
                    <FontAwesomeIcon icon={props.buttonIcon} size="sm" color="white" />
                    {props.buttonText}
                </button>
            </div>
        </div>
    )
}