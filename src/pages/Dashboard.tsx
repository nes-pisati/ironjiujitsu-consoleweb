import { useEffect, useState } from "react";
import { useAthleteContext } from "../context/AthleteContext";
import DashResumeCard from "../components/ui-components/dashboard/DashResumeCard";
import { faCreditCard, faStethoscope, faTriangleExclamation, faUser } from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../components/ui-components/PageTitle";
import { useSubscriptionContext } from "../context/SubscriptionsContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DashAlertCard from "../components/ui-components/dashboard/DashAlertCard";

const MedicalCertificateStatus = {
    EXPIRED: 'SCADUTO',
    ABSENT: 'ASSENTE'
} as const;

type MedicalCertificateStatusType = typeof MedicalCertificateStatus[keyof typeof MedicalCertificateStatus];

export default function Dashboard() {

    const { athletes, noMedicalCertificateAthleteList, expiredMedicalCertificateAthleteList } = useAthleteContext();
    const { subscriptions, expiredSubscriptionsList } = useSubscriptionContext();
    const navigate = useNavigate();

    const token = localStorage.getItem('creatorLogin')

    const [medicalCertificateStatus, setMedicalCertificateStatus] = useState<MedicalCertificateStatusType | undefined>(undefined);

    useEffect(() => {
        // console.log("athletes ->", athletes);

        if (!token) {
            navigate('/login');
        }

    }, [])

    useEffect(() => {
    }, [medicalCertificateStatus])


    return (
        <>
            <div className="pe-12">
                <PageTitle title="Dashboard" subtitle="Panoramica generale" btnVisible={false} />
                <div className="py-7 grid grid-cols-4 gap-5">
                    <DashResumeCard title="Atleti" icon={faUser} subtitle="Numero totale di atleti iscritti" count={athletes.length} />
                    <DashResumeCard title="Abbonamenti" icon={faCreditCard} subtitle="Abbonamenti attivi" count={subscriptions.length} />
                    <div className="w-auto rounded-2xl h-60 border border-gray-300 p-7 flex flex-col justify-between col-span-2">
                        <div className="pb-10">
                            <div className="flex flex-col justify-between">
                                <p className="text-l font-semibold">Azioni rapide</p>
                                <p className="text-gray-500 text-base pt-2">Gestisci velocemente le operazioni più comuni</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button className="gap-3 flex items-center border-gray-400 border-1 text-black text-sm font-semibold py-3 px-6 rounded-lg hover:bg-black hover:text-white transition-all duration-500 ease-in-out" onClick={() => navigate('/athlete/add')}>
                                <FontAwesomeIcon icon={faUser} size="sm" />
                                Aggiungi nuovo atleta
                            </button>
                            <button className="gap-3 flex items-center border-gray-400 border-1 text-black text-sm font-semibold py-3 px-6 rounded-lg hover:bg-black hover:text-white transition-all duration-500 ease-in-out" onClick={() => navigate('/subscription/add')}>
                                <FontAwesomeIcon icon={faCreditCard} size="sm" />
                                Aggiungi nuovo abbonamento
                            </button>
                        </div>
                    </div>
                </div>
                <div className=" grid grid-cols-4 gap-5">
                    <div className="w-auto rounded-2xl h-60 min-h-100 border border-gray-300 p-7 flex flex-col justify-between col-span-2 overflow-y-hidden">
                        <div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faTriangleExclamation} size="lg" color="red" />
                                <p className="text-2xl font-semibold">Allerte prioritarie abbonamenti</p>
                            </div>
                            <p className="text-gray-500 text-base pt-2 mb-3">Alcuni abbonamenti sono in scadenza</p>
                            <div className="overflow-y-scroll h-80">
                                {expiredSubscriptionsList.map((subscription) => (
                                    <DashAlertCard key={subscription.athleteName} title="Abbonamento scaduto" athleteName={subscription.athleteName} isError={true} labelText={`${subscription.daysExpired} giorni fa`} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-auto rounded-2xl h-60 min-h-100 border border-gray-300 p-7 flex flex-col justify-between col-span-2 overflow-y-hidden">
                        <div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faStethoscope} size="lg" color="black" />
                                <p className="text-2xl font-semibold">Panoramica Certificati Medici</p>
                            </div>
                            <p className="text-gray-500 text-base pt-2 mb-3">Lista atleti senza certificato o con certificato medico scaduto</p>
                            <div className="grid grid-cols-2 gap-2 pt-3">
                                <button className="border-gray-400 border-1 text-black text-sm font-semibold py-1 px-6 rounded-lg hover:bg-black hover:text-white transition-all duration-500 ease-in-out" onClick={() => setMedicalCertificateStatus(MedicalCertificateStatus.EXPIRED)}>Scaduti</button>
                                <button className="border-gray-400 border-1 text-black text-sm font-semibold py-1 px-6 rounded-lg hover:bg-black hover:text-white transition-all duration-500 ease-in-out" onClick={() => setMedicalCertificateStatus(MedicalCertificateStatus.ABSENT)}>Assenti</button>
                            </div>
                            <div className="overflow-y-scroll h-80">
                                {medicalCertificateStatus === MedicalCertificateStatus.EXPIRED && expiredMedicalCertificateAthleteList.map((athlete) => (
                                    <DashAlertCard key={athlete._id} title="Certificato medico scaduto" athleteName={`${athlete.name} ${athlete.surname}`} isError={true} />
                                ))}
                                {medicalCertificateStatus === MedicalCertificateStatus.ABSENT && noMedicalCertificateAthleteList.map((athlete) => (
                                    <DashAlertCard key={athlete._id} title="Certificato medico assente" athleteName={`${athlete.name} ${athlete.surname}`} isError={false} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        </>
    )
}