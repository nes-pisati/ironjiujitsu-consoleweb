import { faEnvelope, faEye, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AdultBelts, Athlete, KidsBelts } from "../../../types";
import { useNavigate } from "react-router-dom";
import StateLabel from "../label/StateLabel";
import { useSubscriptionContext } from "../../../context/SubscriptionsContext";
import { useState, useEffect } from "react";



export default function AthleteCard(props: Athlete) {

    const navigate = useNavigate();

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

    const getBeltColour = (belt: AllBelts): string => {
        const baseClasses = 'w-3 h-3 rounded-4xl';

        const beltColors: Record<AllBelts, string> = {
            white: 'bg-white',
            blue: 'bg-blue-600',
            purple: 'bg-purple-600',
            brown: 'bg-amber-900',
            black: 'bg-black',

            greywhite: 'bg-gray-100',
            grey: 'bg-gray-400',
            greyblack: 'bg-gray-700',

            yellowwhite: 'bg-yellow-100',
            yellow: 'bg-yellow-400',
            yellowblack: 'bg-yellow-700',

            orangewhite: 'bg-orange-200',
            orange: 'bg-orange-500',
            orangeblack: 'bg-orange-800',

            greenwhite: 'bg-green-200',
            green: 'bg-green-500',
            greenblack: 'bg-green-800',
        };

        const bgClass = beltColors[belt]

        const borderClass = belt === 'white' ? 'border border-black' : '';

        return `${bgClass} ${baseClasses} ${borderClass}`.trim();
    };

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
        <div className="w-auto h-auto rounded-2xl border border-gray-300 p-10">
            <div className="border-b border-gray-300">
                <div className="flex items-start justify-between">
                    <div className="pb-5">
                        <p className="text-xl font-semibold pb-3">{props.name + ' ' + props.surname}</p>
                        <div className="flex items-center gap-5">
                            <p className="text-base text-gray-500">{getAthleteAge(props.birthDate) + ' anni'}</p>
                            <div className="flex items-center gap-2">
                                <div className={getBeltColour(props.belt)}></div>
                                <p className="text-base text-gray-500">{getBeltTranslation(props.belt)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-gray-400 rounded-xl py-2 px-3 transition-all duration-100 ease-in hover:bg-black hover:text-white hover:cursor-pointer">
                        <button onClick={() => handleNavigate(props._id)}>
                            <FontAwesomeIcon icon={faEye} size="sm" />
                        </button>
                    </div>
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