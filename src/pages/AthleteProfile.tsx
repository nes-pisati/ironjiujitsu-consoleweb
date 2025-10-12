import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAthleteContext } from "../context/AthleteContext";
import type { Athlete } from "../types";
import PageTitle from "../components/ui-components/PageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBirthdayCake, faEnvelope, faFileMedical, faIdBadge, faPencil, faPhone, faStethoscope, faUser } from "@fortawesome/free-solid-svg-icons";
import AthleteProfileCard from "../components/ui-components/athletes/AthleteProfileCard";
import { getAthleteAge, getBeltColour, getBeltTranslation } from "../utils";

export default function AthleteProfile() {

  const { id } = useParams();
  const { getAthlete } = useAthleteContext();
  const [athlete, setAthlete] = useState<Athlete | undefined>(undefined);

  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate('/' + path)
  }

  useEffect(() => {
    if (id) {
      const fetchAthlete = async () => {
        const athleteData = await getAthlete(id);
        if (athleteData) {
          console.log("athlete ->", athleteData);

          setAthlete(athleteData);
        }
      };

      fetchAthlete();
    }
  }, [id]);

  const formatBirthday = (birthDate: Date): string => {
    if (!birthDate) return '';

    const date = new Date(birthDate);
    return date.toLocaleDateString("it-IT")
  }

  return (
    <>
      <div className="pe-12">
        <PageTitle title={athlete ? athlete.name + ' ' + athlete.surname : ''} subtitle="Dettagli atleta" btnVisible={true} btnIcon={faArrowLeft} btnText="Indietro" onBtnClick={() => handleNavigate('athletes')} />
        <div className="pt-10 grid grid-cols-3 gap-6">
          {athlete &&
            <>
              <AthleteProfileCard title="Informazioni Personali" icon={faUser} buttonText="Modifica Informazioni Atleta" buttonIcon={faPencil} onButtonClick={() => handleNavigate(`athlete/edit/${athlete._id}`)}>
                <div className="py-4 border-b border-gray-300 flex items-center gap-10">
                  <div className={getBeltColour(athlete.belt, 'w-3', 'h-3')}></div>
                  <div>
                    <p className="text-base font-medium">{"Cintura " + getBeltTranslation(athlete.belt)}</p>
                    <p className="text-base text-gray-500">{getAthleteAge(athlete.birthDate) + " anni"}</p>
                  </div>
                </div>
                <div className="py-12">
                  <div className="flex gap-4 items-center pb-3">
                    <FontAwesomeIcon icon={faIdBadge} size="sm" />
                    <p className="text-base">{athlete.fiscalCode}</p>
                  </div>
                  <div className="flex gap-4 items-center pb-3">
                    <FontAwesomeIcon icon={faBirthdayCake} size="sm" />
                    <p className="text-base">{formatBirthday(athlete.birthDate)}</p>
                  </div>
                  <div className="flex gap-4 items-center pb-3">
                    <FontAwesomeIcon icon={faPhone} size="sm" />
                    <p className="text-base">{athlete.phoneNumber}</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <FontAwesomeIcon icon={faEnvelope} size="sm" />
                    <p className="text-base">{athlete.email}</p>
                  </div>
                </div>
                {/* <div className="pt-10">
                  <button className="border border-gray-40 w-full font-bold text-base py-3 px-6 rounded-xl flex items-center gap-5 bg-black text-white flex justify-center hover:cursor-pointer" onClick={() => handleNavigate(`athlete/edit/${athlete._id}`)}>
                    <FontAwesomeIcon icon={faPencil} size="sm" color="white" />
                    Modifica
                  </button>
                </div> */}
              </AthleteProfileCard>
              <AthleteProfileCard title="Abbonamento" icon={faFileMedical} buttonText="Modifica Abbonamento" buttonIcon={faPencil} onButtonClick={() => handleNavigate(`athlete/edit/${athlete._id}`)}>
                <div className="py-12">
                  {/* <div className="flex gap-4 items-center pb-5">
                    <p className="text-base">{athlete.fiscalCode}</p>
                  </div> */}
                  <div className="flex gap-4 items-center pb-5">
                    <FontAwesomeIcon icon={faBirthdayCake} size="sm" />
                    <p className="text-base">{formatBirthday(athlete.birthDate)}</p>
                  </div>
                </div>
              </AthleteProfileCard>
              <AthleteProfileCard title="Salute" icon={faStethoscope} buttonText="Aggiorna" buttonIcon={faPencil} onButtonClick={() => handleNavigate(`athlete/edit/${athlete._id}`)}>
                <div></div>
              </AthleteProfileCard>
            </>
          }
        </div>
      </div>
    </>
  )
}