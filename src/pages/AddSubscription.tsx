import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../components/ui-components/PageTitle";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SubscriptionForm from "../components/ui-components/forms/SubscriptionForm";

export default function AddSubscription() {
    const navigate = useNavigate();
    const { id } = useParams();

    console.log('AddAthlete - ID dall\'URL:', id);

    const handleNavigate = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/subscriptions");
        }
    };


    const pageTitle = id ? "Modifica Abbonamento" : "Aggiungi Abbonamento"
    const pageSubtitle = id ? "Modifica l'abbonamento" : "Aggiungi un nuovo abbonamento"
    const isEditMode = Boolean(id);

    return (
        <>
            <div className="pe-12">
                <PageTitle
                    btnVisible={true}
                    title={pageTitle}
                    subtitle={pageSubtitle}
                    btnIcon={faArrowLeft}
                    btnText="Indietro"
                    onBtnClick={() => handleNavigate()}
                />
                <SubscriptionForm
                    subscriptionId={id}
                    mode={isEditMode ? 'edit' : 'create'}
                />
            </div>
        </>
    )
}