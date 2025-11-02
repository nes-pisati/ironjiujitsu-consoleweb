import { useEffect, useState } from "react";
import PageTitle from "../components/ui-components/PageTitle";
import { useSubscriptionContext } from "../context/SubscriptionsContext";
import SubscriptionStatsCard from "../components/ui-components/subscriptions/SubscriptionStatsCard";
import { faCalendar, faMoneyBill, faUsers } from "@fortawesome/free-solid-svg-icons";
import type { Subscription } from "../types";
import { useNavigate } from "react-router-dom";

export default function Subscriptions() {

  const navigate = useNavigate();

  const { monthEarning, expiredSubscriptions, monthlySubscriptionsCount, quarterlySubscriptionsCount } = useSubscriptionContext();


  const handleNavigate = () => {
    navigate('/subscription/add')
  }

  return (
    <>
      <div className="pe-12">
        <div className="flex items-center justify-between">
          <PageTitle title="Abbonamenti" subtitle="Gestisci le tipologie e lo stato degli abbonamenti" btnVisible={false} />
          <button className="bg-black  text-white text-sm font-bold py-4 px-6 rounded-2xl" onClick={() => handleNavigate()}>Nuovo Abbonamento</button>
        </div>
        <div className="py-10 grid grid-cols-4 gap-5">
          <SubscriptionStatsCard title="Abbonamenti Mensili Attivi" icon={faUsers} count={monthlySubscriptionsCount} subtitle="Mensili di questo mese" />
          <SubscriptionStatsCard title="Abbonamenti Trimestrali Attivi" icon={faUsers} count={quarterlySubscriptionsCount} subtitle="Trimestrali di questo mese" />
          <SubscriptionStatsCard title="Abbonamenti Scaduti" icon={faCalendar} count={expiredSubscriptions} subtitle="Da rinnovare" textColor="text-red-600" />
          <SubscriptionStatsCard title="Incasso mensile" icon={faMoneyBill} count={monthEarning + ' €'} subtitle="Entrate mensili totali" />
        </div>
      </div>
    </>
  )
}