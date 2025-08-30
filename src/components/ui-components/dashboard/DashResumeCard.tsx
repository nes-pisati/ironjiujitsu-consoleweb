import { faCoffee, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export interface DashResumeCardProps {
    title: string,
    subtitle: string,
    icon: IconDefinition,
    count: number
}

export default function DashResumeCard(props: DashResumeCardProps) { 
    return (
        <div className="w-auto rounded-2xl h-60 border border-gray-300 p-10">
            <div className="pb-10">
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold">{props.title}</p>
                    <FontAwesomeIcon icon={props.icon} size="lg"/>
                </div>
                <p className="text-gray-500 text-xl">{props.subtitle}</p>
            </div>
            <div>
                <p className="text-5xl">{props.count}</p>
            </div>
        </div>
    )
}