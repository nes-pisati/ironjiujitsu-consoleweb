import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAthleteContext } from "../context/AthleteContext";
import { useSubscriptionContext } from "../context/SubscriptionsContext";
import { type Subscription, type Athlete } from "../types";
import PageTitle from "../components/ui-components/PageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBoxArchive, faBirthdayCake, faCreditCard, faEnvelope, faIdBadge, faPencil, faPhone, faStethoscope, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import AthleteProfileCard from "../components/ui-components/athletes/AthleteProfileCard";
import StateLabel from "../components/ui-components/label/StateLabel";
import AlertDialog from "../components/ui-components/dialog-alert/DialogAlert";
import { formatDate, getAthleteAge, getBeltColour, getBeltTranslation, t } from "../utils";

type AlertDialogProps = {
  title: string;
  subtitle: string;
  isDeleted: boolean;
};

type SubscriptionNavigateState = {
  athleteId?: string;
};

export default function AthleteProfile() {
  const { id } = useParams();
  const { getAthlete, deleteAthlete, setAthleteArchived } = useAthleteContext();
  const { getLastSubscriptionByAthlete } = useSubscriptionContext();

  const [athlete, setAthlete] = useState<Athlete | undefined>(undefined);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [alertProps, setAlertProps] = useState<AlertDialogProps>({
    title: "Sei sicuro di voler eliminare l'atleta?",
    subtitle: "Premi conferma per continuare",
    isDeleted: false,
  });

  const navigate = useNavigate();

  const handleNavigate = (path: string, state?: SubscriptionNavigateState) => {
    navigate("/" + path, {state});
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const athleteData = await getAthlete(id);
        if (athleteData) setAthlete(athleteData);

        const subscriptionData = await getLastSubscriptionByAthlete(id);
        setSubscription(subscriptionData); 
      } catch (err) {
        console.error("Errore nel recupero dati atleta/abbonamento", err);
      }
    };

    fetchData();
  }, [id]);

  const isSubscriptionValid = (sub: Subscription | null) => {
    if (!sub?.subscriptionExp) return false;
    return new Date(sub.subscriptionExp) > new Date();
  };

  const handleDelete = async (athleteId: string) => {
    try {
      await deleteAthlete(athleteId);
      setAlertProps({
        title: "Atleta eliminato correttamente",
        subtitle: "",
        isDeleted: true,
      });
    } catch (error: any) {
      setAlertProps({
        title: "Errore nell'eliminazione dell'atleta",
        subtitle: "Errore: " + error.message,
        isDeleted: false,
      });
    }
  };

  const handleArchive = async () => {
    if (!athlete) return;
    setArchiveError(null);
    try {
      const updatedAthlete = await setAthleteArchived(athlete._id, !athlete.archived);
      setAthlete(updatedAthlete);
    } catch (error: any) {
      setArchiveError(
        (athlete.archived ? "Errore nel ripristino dell'atleta: " : "Errore nell'archiviazione dell'atleta: ") + error.message
      );
    }
  };

  return (
    <>
      <div className="pe-12">
        <PageTitle
          title={athlete ? athlete.name + " " + athlete.surname : ""}
          subtitle={athlete?.archived ? "Dettagli atleta · Archiviato" : "Dettagli atleta"}
          btnVisible
          btnIcon={faArrowLeft}
          btnText="Indietro"
          onBtnClick={() => handleNavigate(athlete?.archived ? "athletes/archive" : "athletes")}
        />

        {athlete?.archived && (
          <div className="mt-6 py-3 px-4 rounded-xl bg-gray-100 border border-gray-300 flex items-center gap-3">
            <FontAwesomeIcon icon={faBoxArchive} size="sm" />
            <p className="text-base">Questo atleta è archiviato e non compare nella lista degli atleti attivi.</p>
          </div>
        )}

        <div className="pt-10 grid grid-cols-3 gap-6">
          {athlete && (
            <>
              {/* INFO PERSONALI */}
              <AthleteProfileCard
                title="Informazioni Personali"
                icon={faUser}
                buttonText="Modifica Informazioni Atleta"
                buttonIcon={faPencil}
                onButtonClick={() => handleNavigate(`athlete/edit/${athlete._id}`)}
              >
                <div className="py-4 border-b border-gray-300 flex items-center gap-10">
                  <div className={getBeltColour(athlete.belt, "w-3", "h-3")}></div>
                  <div>
                    <p className="text-base font-medium">{"Cintura " + getBeltTranslation(athlete.belt)}</p>
                    <p className="text-base text-gray-500">{getAthleteAge(new Date(athlete.birthDate)) + " anni"}</p>
                  </div>
                </div>

                <div className="py-12">
                  <div className="flex gap-4 items-center pb-3">
                    <FontAwesomeIcon icon={faIdBadge} size="sm" />
                    <p className="text-base">{athlete.fiscalCode}</p>
                  </div>
                  <div className="flex gap-4 items-center pb-3">
                    <FontAwesomeIcon icon={faBirthdayCake} size="sm" />
                    <p className="text-base">{formatDate(new Date(athlete.birthDate))}</p>
                  </div>
                  <div className="flex gap-4 items-center pb-3">
                    <FontAwesomeIcon icon={faPhone} size="sm" />
                    <p className="text-base">{athlete.phoneNumber}</p>
                  </div>
                  {athlete.email && (
                    <div className="flex gap-4 items-center">
                      <FontAwesomeIcon icon={faEnvelope} size="sm" />
                      <p className="text-base">{athlete.email}</p>
                    </div>
                  )}
                </div>
              </AthleteProfileCard>

              {/* ABBONAMENTO */}
              <AthleteProfileCard
                title="Abbonamento"
                icon={faCreditCard}
                buttonText={
                  !subscription
                    ? "Aggiungi abbonamento"
                    : isSubscriptionValid(subscription)
                    ? "Modifica abbonamento"
                    : "Aggiorna abbonamento"
                }
                buttonIcon={faPencil}
                onButtonClick={() => {
                  if(!subscription) {
                    handleNavigate("subscription/add", {
                      athleteId: athlete._id,
                    });
                  } else {
                    handleNavigate(`subscription/edit/${subscription._id}`)
                  }
                }}
              >
                {subscription ? (
                  <div className="py-8">
                    <div className="border-b border-gray-300 pb-6">
                      <div className="flex justify-between pb-4 border-bottom">
                        <p className="font-semibold text-lg">Stato</p>
                        <StateLabel date={subscription.subscriptionExp} />
                      </div>
                      <div className="flex justify-between">
                        <p className="text-base">Data scadenza:</p>
                        <p className="text-base">{formatDate(subscription.subscriptionExp)}</p>
                      </div>
                    </div>

                    <div className="pt-6">
                      <div className="flex justify-between">
                        <p className="text-base">Tipologia:</p>
                        <p className="text-base">{t(subscription.type)}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-base">Prezzo:</p>
                        <p className="text-base">{subscription.amount} €</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-base">Pagamento:</p>
                        <p className="text-base">{t(subscription.paymentType)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-30">
                    <p className="text-base">
                      Nessun abbonamento attivo per l'atleta {athlete.name + " " + athlete.surname}
                    </p>
                  </div>
                )}
              </AthleteProfileCard>

              {/* SALUTE */}
              <AthleteProfileCard
                title="Salute"
                icon={faStethoscope}
                buttonText="Aggiorna"
                buttonIcon={faPencil}
                onButtonClick={() => handleNavigate(`athlete/edit/${athlete._id}`)}
              >
                <div className="py-8">
                  {/* Certificato Medico */}
                  <div className="border-b border-gray-300 pb-6">
                    <div className="flex justify-between pb-4 border-bottom">
                      <p className="font-semibold text-lg">Certificato Medico</p>
                      <StateLabel date={athlete.medicalCertificateExp} />
                    </div>
                    {athlete.medicalCertificate && (
                      <div className="flex justify-between">
                        <p className="text-base">Data scadenza:</p>
                        <p className="text-base">{formatDate(athlete.medicalCertificateExp!)}</p>
                      </div>
                    )}
                  </div>

                  {/* Assicurazione */}
                  <div className="pt-6">
                    <div className="flex justify-between pb-4 border-bottom">
                      <p className="font-semibold text-lg">Assicurazione</p>
                      <StateLabel date={athlete.ensuranceExp} feminine />
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base">Tipologia:</p>
                      <p className="text-base">{athlete.ensuranceType}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base">Data scadenza:</p>
                      <p className="text-base">{formatDate(athlete.ensuranceExp!)}</p>
                    </div>
                  </div>
                </div>
              </AthleteProfileCard>
            </>
          )}
        </div>

        {athlete && (
          <div className="pt-10">
            <button
              className="border border-black w-full py-2 px-3 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-100 ease-in hover:bg-black hover:text-white"
              onClick={handleArchive}
            >
              <p>{athlete.archived ? "Ripristina atleta" : "Archivia atleta"}</p>
            </button>
            {archiveError && <p className="pt-2 text-sm text-red-700">{archiveError}</p>}
          </div>
        )}

        {/* Pulsante elimina atleta */}
        <div className="pt-4">
          <button
            className="bg-red-700 w-full py-2 px-3 rounded-xl flex items-center justify-center cursor-pointer hover:bg-red-800"
            onClick={() => setShowAlert(true)}
          >
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faTrash} size="sm" color="white" />
              <p className="text-white">Elimina atleta</p>
            </div>
          </button>
        </div>
      </div>

      <AlertDialog
        title={alertProps.title}
        message={alertProps.subtitle}
        onClose={() => (alertProps.isDeleted ? handleNavigate(athlete?.archived ? "athletes/archive" : "athletes") : setShowAlert(false))}
        onConfirm={() => handleDelete(id!)}
        show={showAlert}
        isDeleted={alertProps.isDeleted}
      />
    </>
  );
}
