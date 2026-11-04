import { faStethoscope, faCreditCard, faFileMedical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AdultBelts, Athlete, KidsBelts } from "../../../types";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSubscriptionContext } from "../../../context/SubscriptionsContext";
import { useAthleteContext } from "../../../context/AthleteContext";
import { formatDate, getBeltColour, getBeltTextColour } from "../../../utils";


export default function AthleteCardThin(props: Athlete & { showRestore?: boolean }) {

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
    const { getLastSubscriptionByAthlete } = useSubscriptionContext();
    const [subExpDate, setSubExpDate] = useState<Date | null | undefined>(undefined);

    useEffect(() => {
        const fetchSub = async () => {
            const sub = await getLastSubscriptionByAthlete(props._id);
            setSubExpDate(sub ? new Date(sub.subscriptionExp) : null);
        };
        fetchSub();
    }, [props._id]);

    const now = new Date();

    const getMedicalStatus = (): 'ok' | 'absent' | 'expired' => {
        if (!props.medicalCertificate || !props.medicalCertificateExp) return 'absent';
        return new Date(props.medicalCertificateExp) < now ? 'expired' : 'ok';
    };

    const getEnsuranceStatus = (): 'ok' | 'absent' | 'expired' => {
        if (!props.ensurance || !props.ensuranceExp) return 'absent';
        return new Date(props.ensuranceExp) < now ? 'expired' : 'ok';
    };

    const getSubscriptionStatus = (): 'ok' | 'absent' | 'expired' => {
        if (subExpDate === undefined || subExpDate === null) return 'absent';
        return subExpDate < now ? 'expired' : 'ok';
    };

    const getCircleBg = (status: 'ok' | 'absent' | 'expired'): string => {
        if (status === 'absent') return 'bg-yellow-500';
        if (status === 'expired') return 'bg-red-500';
        return '';
    };

    const handleNavigate = (uid: string) => {
        navigate(`/athlete/${uid}`)
    }

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

    return (
        <div
            role="link"
            tabIndex={0}
            className="w-auto rounded-2xl border border-gray-300 py-4 px-6 cursor-pointer transition-all duration-100 ease-in hover:ring-1 hover:ring-gray-300 hover:bg-gray-50"
            onClick={() => handleNavigate(props._id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target === e.currentTarget) handleNavigate(props._id);
            }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-4 pb-1">
                        <p className="text-lg font-semibold">{props.name + ' ' + props.surname}</p>
                        {props.uijjAffiliated && (
                            <p className={`${getBeltColour(props.belt, "w-fit", "")} ${getBeltTextColour(props.belt)} shrink-0 px-3 py-1 text-xs font-medium whitespace-nowrap`}>
                                UIJJ
                            </p>
                        )}
                    </div>
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
                    {restoreError && <p className="pt-1 text-sm text-red-700">{restoreError}</p>}
                </div>
                <div className="flex items-center gap-2">
                    {(getMedicalStatus() !== 'ok') && (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getCircleBg(getMedicalStatus())}`}>
                            <FontAwesomeIcon icon={faStethoscope} size="xs" color="white" />
                        </div>
                    )}
                    {(getEnsuranceStatus() !== 'ok') && (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getCircleBg(getEnsuranceStatus())}`}>
                            <FontAwesomeIcon icon={faFileMedical} size="xs" color="white" />
                        </div>
                    )}
                    {(subExpDate !== undefined && getSubscriptionStatus() !== 'ok') && (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getCircleBg(getSubscriptionStatus())}`}>
                            <FontAwesomeIcon icon={faCreditCard} size="xs" color="white" />
                        </div>
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
        </div>
    )
}