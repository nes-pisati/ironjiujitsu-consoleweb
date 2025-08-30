import React, { useEffect } from "react";
import { useAthleteContext } from "../context/AthleteContext";
import DashResumeCard from "../components/ui-components/dashboard/DashResumeCard";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {

    const { athletes } = useAthleteContext();

    useEffect(() => {
        console.log("athletes ->", athletes);
    })

    return (
        <>
            <div className="pe-12">
                <h1 className="text-6xl py-7 font-bold">Dashboard</h1>
                <p className="text-3xl text-gray-500">Panoramica generale</p>
                <div className="py-7 grid grid-cols-4 gap-5">
                    <DashResumeCard title="Atleti" icon={faUser} subtitle="Numero totale di atleti iscritti" count={athletes.length}/>
                </div>
                <div>
                    <div></div>
                    <div></div>
                </div>
                <div></div>
            </div>
        </>
    )
}