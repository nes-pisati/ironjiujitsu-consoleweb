import React from "react";
import AthleteForm from "../components/ui-components/forms/AthleteForm";
import PageTitle from "../components/ui-components/PageTitle";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";

export default function AddAthlete() {
    const navigate = useNavigate();
    const { id } = useParams();

    console.log('AddAthlete - ID dall\'URL:', id); // ← Debug


    const pageTitle = id ? "Modifica Atleta" : "Nuovo Atleta"
    const pageSubtitle = id ? "Modifica il membro della squadra" : "Registra un nuovo membro della squadra"
    const isEditMode = Boolean(id);


    const handleNavigate = () => {
        navigate('/athletes')
    }

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
                <AthleteForm 
                athleteId={id}
                mode={isEditMode ? 'edit' : 'create'}
                />
            </div>
        </>
    )
}