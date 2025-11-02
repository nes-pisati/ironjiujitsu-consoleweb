import { useEffect } from "react";
import { useAthleteContext } from "../context/AthleteContext";
import DashResumeCard from "../components/ui-components/dashboard/DashResumeCard";
import { faCreditCard, faUser } from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../components/ui-components/PageTitle";
import { useSubscriptionContext } from "../context/SubscriptionsContext";

export default function Dashboard() {

    const { athletes } = useAthleteContext();
    const { subscriptions } = useSubscriptionContext();

    useEffect(() => {
        console.log("athletes ->", athletes);
    })

    //GET ABBONAMENTI SCADUTI

    return (
        <>
            <div className="pe-12">
                <PageTitle title="Dashboard" subtitle="Panoramica generale" btnVisible={false}/>
                <div className="py-7 grid grid-cols-4 gap-5">
                    <DashResumeCard title="Atleti" icon={faUser} subtitle="Numero totale di atleti iscritti" count={athletes.length}/>
                    <DashResumeCard title="Abbonamenti" icon={faCreditCard} subtitle="Abbonamenti scaduti da rinnovare" count={subscriptions.length}/>
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