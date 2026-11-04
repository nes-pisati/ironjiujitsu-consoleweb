import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AdultBelts, Athlete, KidsBelts } from "../../../types";
import { useNavigate } from "react-router-dom";
import StateLabel from "../label/StateLabel";
import { useSubscriptionContext } from "../../../context/SubscriptionsContext";
import { useState, useEffect } from "react";
import { useAthleteContext } from "../../../context/AthleteContext";
import { formatDate, getBeltColour, getBeltTextColour } from "../../../utils";



export default function AthleteCard(props: Athlete & { showRestore?: boolean }) {

    const navigate = useNavigate();

    const { setAthleteArchived } = useAthleteContext();
    const [restoreError, setRestoreError] = useState<string | null>(null);

    const handleRestore = async () => {
        setRestoreError(null);
        try {
            await setAthleteArchived(props._id, false);
        } catch (error) {
            console.error("Errore nel ripristino dell'atleta", error);
            setRestoreError("Errore nel ripristino dell'atleta, riprova");
        }
    }

    const handleNavigate = (uid: string) => {
        navigate(`/athlete/${uid}`)
    }

    const { getLastSubscriptionByAthlete } = useSubscriptionContext();

    const [expDate, setExpDate] = useState<Date | null>(null);

    useEffect(() => {
        const fetchDate = async () => {
            const date = await getSubscriptionExpDate(props._id);
            setExpDate(date);
        };
        fetchDate();
    }, [props._id]);

    type AllBelts = AdultBelts | KidsBelts;

    const getBeltTranslation = (belt: AllBelts) => {
        const beltColors: Record<AllBelts, string> = {
            white: 'Bianca',
            blue: 'Blu',
            purple: 'Viola',
            brown: 'Marrone',
            black: 'Nera',

            greywhite: 'Grigio Bianca',
            grey: 'Grigia',
            greyblack: 'Grigio Nera',

            yellowwhite: 'Gialla Bianca',
            yellow: 'Gialla',
            yellowblack: 'Gialla Nera',

            orangewhite: 'Arancio Bianca',
            orange: 'Arancio',
            orangeblack: 'Arancio Nera',

            greenwhite: 'Verde Bianca',
            green: 'Verde',
            greenblack: 'Verde Nera',
        };

        const bgTranslation = beltColors[belt]

        return bgTranslation
    }

    const getAthleteAge = (birthDate: Date | string): string | undefined => {
        if (!birthDate) return;

        const formatDate = new Date(birthDate);
        const birthYear = formatDate.getUTCFullYear();
        const thisYear = new Date().getFullYear();
        const age = thisYear - birthYear
        return age.toString()
    }

    const getSubscriptionExpDate = async (athleteId: string) => {
        const subscription = await getLastSubscriptionByAthlete(athleteId);
        if (subscription) {
            return new Date(subscription.subscriptionExp)
        }

        return null
    }

    return (
        <div
            role="link"
            tabIndex={0}
            className="w-auto h-auto rounded-2xl border border-gray-300 p-10 cursor-pointer transition-all duration-100 ease-in hover:ring-1 hover:ring-gray-300 hover:bg-gray-50"
            onClick={() => handleNavigate(props._id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target === e.currentTarget) handleNavigate(props._id);
            }}
        >
            <div className="border-b border-gray-300">
                <div className="flex items-center justify-between gap-3 pb-3">
                    <p className="text-lg font-semibold">{props.name + ' ' + props.surname}</p>
                    <div className="flex items-center gap-2">
                        {props.uijjAffiliated && (
                            <p className={`${getBeltColour(props.belt, "w-fit", "")} ${getBeltTextColour(props.belt)} shrink-0 px-3 py-1 text-xs font-medium whitespace-nowrap`}>
                                UIJJ
                            </p>
                        )}
                        {props.showRestore &&
                            <button
                                className="border border-gray-400 rounded-xl py-1.5 px-3 text-sm font-semibold transition-all duration-100 ease-in hover:bg-black hover:text-white hover:cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestore();
                                }}
                            >
                                Ripristina
                            </button>
                        }
                    </div>
                </div>
                <div className="pb-5">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <p className="text-base text-gray-500">{getAthleteAge(props.birthDate) + ' anni'}</p>
                        <div className="flex items-center gap-2">
                            <div className={`${getBeltColour(props.belt, "w-3", "h-3")} shrink-0`}></div>
                            <p className="text-base text-gray-500">
                                {getBeltTranslation(props.belt)}
                                {props.beltDate && ` dal ${formatDate(new Date(props.beltDate))}`}
                            </p>
                        </div>
                    </div>
                    {restoreError && <p className="pt-2 text-sm text-red-700">{restoreError}</p>}
                </div>
                <div>
                    <div className="flex gap-4 items-center py-2">
                        <FontAwesomeIcon icon={faPhone} size="sm" />
                        <p className="text-base">{props.phoneNumber}</p>
                    </div>
                    <div className="flex gap-4 items-center pt-2 pb-8">
                        <FontAwesomeIcon icon={faEnvelope} size="sm" />
                        <p className="text-base">{props.email}</p>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between py-5">
                    <p className="text-base text-gray-500">Abbonamento</p>
                    <StateLabel date={expDate} />
                </div>
                <div className="flex items-center justify-between pb-5">
                    <p className="text-base text-gray-500">Certificato medico</p>
                    {/* <div className="flex items-center gap-2 bg-yellow-500 px-2 py-1 rounded-xl">
                        <FontAwesomeIcon icon={faXmarkCircle} size="xs" color="white" />
                        <p className="text-xs text-white">assente</p>
                    </div> */}
                    <StateLabel date={props.medicalCertificateExp} />
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-base text-gray-500">Assicurazione</p>
                    {/* <div className="flex items-center gap-2 bg-red-500 px-2 py-1 rounded-xl">
                        <FontAwesomeIcon icon={faXmarkCircle} size="xs" color="white" />
                        <p className="text-xs text-white">scaduta</p>
                    </div> */}
                    <StateLabel date={props.ensuranceExp} feminine={true} />
                </div>
            </div>
        </div>
    )
}