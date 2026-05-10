import { useMemo, useState } from "react";
import PageTitle from "../components/ui-components/PageTitle";
import AthleteCard from "../components/ui-components/athletes/AthleteCard";
import { useAthleteContext } from "../context/AthleteContext";
import { useNavigate } from "react-router-dom";
import type { AthleteType, AdultBelts, KidsBelts } from "../types";
import { adultBeltsOptions, kidsBeltsOptions, typeOptions } from "../components/ui-components/forms/Options";
import AthleteCardThin from "../components/ui-components/athletes/AthleteCardThin";
import { faGrip, faList, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSubscriptionContext } from "../context/SubscriptionsContext";
import * as XLSX from "xlsx";

type DisplayType = 'list' | 'grid'

export default function AthletesList() {

    const { athletes } = useAthleteContext();
    const { subscriptions } = useSubscriptionContext();
    const navigate = useNavigate();
    const [searchAthlete, setSearchAthlete] = useState<string>('');
    const [beltOption, setBeltOption] = useState<AdultBelts | KidsBelts>();
    const [typeOption, setTypeOption] = useState<AthleteType>();
    const [display, setDisplay] = useState<DisplayType>('list');

    const handleNavigate = () => {
        navigate('/athlete/add')
    }

    const mergedBeltOptions = [...kidsBeltsOptions, ...adultBeltsOptions];
    const cleanedBeltOptions = Array.from(
        new Map(mergedBeltOptions.map(option => [option.value, option])).values()
    );

    const filteredAthletes = useMemo(() => {
        const search = searchAthlete.trim().toLowerCase();

        return athletes.filter(a => {
            if (search) {
                const fullName = `${a.name ?? ''} ${a.surname ?? ''}`.toLowerCase();
                if (!fullName.includes(search)) return false;
            }

            if (typeOption) {
                if (a.type !== typeOption) return false;
            }

            if (beltOption) {
                if (a.belt !== beltOption) return false;
            }

            return true;
        });
    }, [athletes, searchAthlete, typeOption, beltOption]);

    const subscriptionTypeLabel: Record<string, string> = {
        month: 'Mensile',
        quarterly: 'Trimestrale',
        sixmonth: 'Semestrale',
        '10entrance': '10 Ingressi',
    };

    const handleExportExcel = () => {
        const rows = filteredAthletes.map(athlete => {
            const sub = subscriptions.find(s => s.athleteId === athlete._id);
            return {
                'Nome': athlete.name,
                'Cognome': athlete.surname,
                'Data di nascita': athlete.birthDate ? new Date(athlete.birthDate).toLocaleDateString('it-IT') : '',
                'Codice fiscale': athlete.fiscalCode,
                'Tipo abbonamento': sub ? (subscriptionTypeLabel[sub.type] ?? sub.type) : '',
                'Scadenza abbonamento': sub?.subscriptionExp ? new Date(sub.subscriptionExp).toLocaleDateString('it-IT') : '',
                'Costo abbonamento (€)': sub?.amount ?? '',
            };
        });

        const ws = XLSX.utils.json_to_sheet(rows);
        ws['!cols'] = [
            { wch: 20 }, // Nome
            { wch: 20 }, // Cognome
            { wch: 18 }, // Data di nascita
            { wch: 20 }, // Codice fiscale
            { wch: 18 }, // Tipo abbonamento
            { wch: 24 }, // Scadenza abbonamento
            { wch: 22 }, // Costo abbonamento
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Atleti');
        XLSX.writeFile(wb, 'atleti.xlsx');
    };

    return (
        <>
            <div className="pe-12">
                <div className="flex items-center justify-between">
                    <PageTitle title="Atleti" subtitle="Gestisci i membri della squadra" btnVisible={false} />
                    <div className="flex items-center gap-3">
                        <button
                            className="flex items-center gap-2 border border-gray-300 text-sm font-bold py-4 px-6 rounded-2xl hover:bg-gray-50 transition-colors"
                            onClick={handleExportExcel}
                        >
                            <FontAwesomeIcon icon={faFileExcel} size="sm" />
                            Esporta Excel
                        </button>
                        <button className="bg-black text-white text-sm font-bold py-4 px-6 rounded-2xl" onClick={() => handleNavigate()}>Aggiungi atleta</button>
                    </div>
                </div>
                {/* FILTRI */}
                <div className="pt-10 grid grid-cols-[1fr_1fr_1fr_2rem] items-center gap-4">
                    <input
                        type="text"
                        placeholder="Inserisci nome atleta..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black-500 outline-none transition-colors text-sm"
                        value={searchAthlete}
                        onChange={(e) => setSearchAthlete(e.target.value)}
                    />
                    <select
                        className="w-full px-4 py-2 border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-black focus:border-black-500 outline-none transition-colors bg-white"
                        value={typeOption}
                        onChange={(e) => setTypeOption(e.target.value as AthleteType)}
                    >
                        <option value="">Seleziona un tipo</option>
                        {typeOptions.map(option =>
                            <option value={option.value}>{option.label}</option>
                        )}
                    </select>
                    <select
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black-500 outline-none transition-colors bg-white"
                        value={beltOption}
                        onChange={(e) => setBeltOption(e.target.value as AdultBelts | KidsBelts)}
                    >
                        <option value="">Seleziona una cintura</option>
                        {typeOption === 'kid' && kidsBeltsOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                        {typeOption === 'adult' && adultBeltsOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                        {!typeOption && cleanedBeltOptions.map(option =>
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        )}
                    </select>
                    <button onClick={() => setDisplay(display === 'list' ? 'grid' : 'list')}>
                        <FontAwesomeIcon icon={display === 'list' ? faList : faGrip} size="sm" />
                    </button>
                </div>
                <div className={display === 'grid' ? "grid grid-cols-3 py-12 gap-6" : "flex flex-col py-12 gap-3"}>
                    {filteredAthletes.map((athlete) => (
                        display === 'grid'
                            ? <AthleteCard key={athlete._id} {...athlete} />
                            : <AthleteCardThin key={athlete._id} {...athlete} />
                    ))}
                </div>
            </div>
        </>
    )
}