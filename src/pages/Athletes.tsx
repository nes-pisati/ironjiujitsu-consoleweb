import { useMemo, useState } from "react";
import PageTitle from "../components/ui-components/PageTitle";
import AthleteCard from "../components/ui-components/athletes/AthleteCard";
import { useAthleteContext } from "../context/AthleteContext";
import { useNavigate } from "react-router-dom";
import type { AthleteType, AdultBelts, KidsBelts } from "../types";
import { adultBeltsOptions, kidsBeltsOptions, typeOptions } from "../components/ui-components/forms/Options";

export default function AthletesList() {

    const { athletes } = useAthleteContext();
    const navigate = useNavigate();
    const [searchAthlete, setSearchAthlete] = useState<string>('');
    const [beltOption, setBeltOption] = useState<AdultBelts | KidsBelts>();
    const [typeOption, setTypeOption] = useState<AthleteType>();

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

    return (
        <>
            <div className="pe-12">
                <div className="flex items-center justify-between">
                    <PageTitle title="Atleti" subtitle="Gestisci i membri della squadra" btnVisible={false} />
                    <button className="bg-black  text-white text-sm font-bold py-4 px-6 rounded-2xl" onClick={() => handleNavigate()}>Aggiungi atleta</button>
                </div>
                {/* FILTRI */}
                <div className="pt-10 grid grid-cols-3 gap-4">
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
                </div>
                <div className="grid grid-cols-3 py-12 gap-6">
                    {filteredAthletes.map((athlete) => (
                        <AthleteCard key={athlete._id} {...athlete} />
                    ))}
                </div>
            </div>
        </>
    )
}