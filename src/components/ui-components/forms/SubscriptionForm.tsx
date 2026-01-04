import { useEffect, useState } from "react";
import { type Athlete, type Subscription, type SubscriptionType } from "../../../types";
import { useSubscriptionContext } from "../../../context/SubscriptionsContext";
import { ModularForm, type FieldConfig } from "./GenericForm";
import { faCalendar, faClock, faEuro, faPencil, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAthleteContext } from "../../../context/AthleteContext";
import { calculateAge, formatDate, getTypeFromAge } from "../../../utils";
import SubscriptionResume from "../subscription-resume/SubscriptionResume";
import type { AlertProps } from "../alert/Alert";
import Alert from "../alert/Alert";
import { useLocation } from "react-router-dom";

interface SubscriptionFormProps {
    subscriptionId?: string;
    mode?: 'create' | 'edit'
}

interface AlertHandler {
    infos: AlertProps,
    showAlert: boolean
}

type LocationState = { //serve a recuperare l'id dell'atleta in caso di aggiunta abbonamento direttamente dal profilo dell'atleta
    athleteId?: string;
};

export default function SubscriptionForm({ subscriptionId, mode = 'create' }: SubscriptionFormProps) {

    const { addSubscription, getSubscriptionById, updateSubscription } = useSubscriptionContext();
    const { athletes, getAthlete } = useAthleteContext();

    const [subscriptionData, setSubscriptionData] = useState<Partial<Subscription> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [monthAmount, setMonthAmount] = useState<number>();
    const [quaterlyAmount, setQuaterlyAmount] = useState<number>();
    const [discount, setDiscount] = useState<number>(0);

    const [alert, setAlert] = useState<AlertHandler>({
        infos: {} as AlertProps,
        showAlert: false
    })

    const location = useLocation();
    const { athleteId } = (location.state as LocationState) || {};

    const isEditMode = mode === 'edit' && subscriptionId;

    const subscriptionTypeOptions = [
        { value: 'month', label: `Mensile - ${monthAmount} €` },
        { value: 'quarterly', label: `Trimestrale - ${quaterlyAmount} €` },
    ]

    const paymentTypeOptions = [
        { value: 'cash', label: 'Contanti' },
        { value: 'banktransfer', label: 'Bonifico Bancario' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'other', label: 'Altro' }
    ]


    useEffect(() => {
        const initForm = async () => {
            if (isEditMode && subscriptionId) {
                try {
                    const subscription = await getSubscriptionById(subscriptionId);

                    if (subscription) {
                        setSubscriptionData({ athleteId: subscription.athleteId });
                        getSubscriptionAmounts(subscription.athleteId);
                    } else {
                        setSubscriptionData({});
                    }
                } catch (err) {
                    console.error("Errore caricamento subscription", err);
                    setSubscriptionData({});
                }
                return;
            }

            if (athleteId) {
                setSubscriptionData({ athleteId });
                getSubscriptionAmounts(athleteId);
                return;
            }

            setSubscriptionData({});
        };

        initForm();
    }, [isEditMode, subscriptionId, athleteId]);



    const getSubscriptionExpFromStartDate = (startDate: Date, subscriptionType: SubscriptionType): Date => {
        const start = new Date(startDate);
        const end = new Date(start);

        end.setDate(15);

        switch (subscriptionType) {
            case 'month':
                end.setMonth(end.getMonth() + 1);
                break;
            case 'quarterly':
                end.setMonth(end.getMonth() + 3);
                break;
        }

        return end;
    };

    const getSubscriptionAmounts = async (athleteId: string) => {
        const athlete = await getAthlete(athleteId);
        if (athlete) {
            const age = calculateAge(athlete.birthDate);
            const athleteType = getTypeFromAge(age);

            if (athleteType === 'adult') {
                setMonthAmount(80);
                setQuaterlyAmount(210);
            } else {
                setMonthAmount(60);
                setQuaterlyAmount(150);
            }
        }
    }

    const mapAthletesToOptions = (athletes: Athlete[]) => {
        return athletes.map((athlete) => ({
            value: athlete._id,
            label: `${athlete.name} ${athlete.surname}`,
        }));
    };

    const calculateDiscount = (amount: number, discount: number) => {
        if (isNaN(amount)) {
            return '0';
        }
        return amount - (amount * discount / 100);
    };


    const handleSubmit = async (values: Subscription) => {
        try {
            let saved;
            let discountedAmount;

            if (discount > 0) {
                discountedAmount = calculateDiscount(values.amount, discount)
            } else {
                discountedAmount = values.amount
            }

            if(isEditMode) {
                    saved = await updateSubscription( subscriptionId, { ...values, amount: Number(discountedAmount) })
                    setAlert({
                        infos: {
                            title: "Abbonamento aggiornato con successo",
                            subtitle: "L'abbonamento è stato inserito correttamente.",
                            isError: false,
                            path: 'subscriptions'
                        },
                        showAlert: true
                    })
            } else {
                saved = await addSubscription(values.athleteId, { ...values, amount: Number(discountedAmount) })
                setAlert({
                    infos: {
                        title: "Abbonamento aggiunto con successo",
                        subtitle: "L'abbonamento è stato inserito correttamente.",
                        isError: false,
                        path: 'subscriptions'
                    },
                    showAlert: true
                })
            }
        } catch (error) {
            console.error('Errore durante il salvataggio:', error);
            setAlert({
                infos: {
                    title: "Errore nell'inserimento dell'Abbonamento",
                    subtitle: "Errore:" + error,
                    isError: true,
                    path: 'subscriptions'
                },
                showAlert: true
            })
        }
    }

    const getAthletNameAndSurname = (id: string): string => {
        if (!athletes || athletes.length === 0) return "Nessun atleta trovato";
        const athlete = athletes.find((ath: Athlete) => ath._id === id);
        return athlete ? `${athlete.name} ${athlete.surname}` : "Nessun atleta trovato";
    };

    const getPaymentTypeLabel = (type: string) => {
        switch (type) {
            case 'cash':
                return 'Contanti'
                break;
            case 'banktransfer':
                return 'Bonifico Bancario'
                break;
            case 'paypal':
                return 'PayPal'
                break;
            case 'other':
                return 'Altro'
                break;
            default:
                return 'Nessuna tipologia di pagamento trovata'
                break;
        }
    }

    const TwoColumnLayout = ({ fields, values, errors, updateValue, Field }: any) => {

        useEffect(() => {
            console.log("Values ->", values);
        }, [values])

        const handleFieldChange = (name: keyof Subscription, value: any) => {
            updateValue(name, value);

            if (name === 'athleteId' && value) {
                getSubscriptionAmounts(value);
                updateValue('type', '');
                updateValue('amount', '');
            }

            if (name === 'type' && value) {
                if (value === 'month') {
                    updateValue('amount', monthAmount);
                } else if (value === 'quarterly') {
                    updateValue('amount', quaterlyAmount);
                }
            }

            // if (name === 'amount') {
            //     if (discount > 0) {
            //         const discountedAmount = calculateDiscount(value, discount);
            //         updateValue('amount', discountedAmount);
            //     } else {
            //         updateValue('amount', value);
            //     }
            // }
        }

        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4 pt-8">
                    <div className="border p-8 border-gray-300 rounded-2xl">
                        <div className="pb-6">
                            <div className="flex items-center gap-8 pb-2">
                                <FontAwesomeIcon icon={faUser} size="sm" />
                                <p className="text-xl font-semibold text-gray-800">Atleta</p>
                            </div>
                            <p className="text-md text-gray-400">Seleziona l'atleta per il nuovo abbonamento</p>
                        </div>
                        <Field
                            config={fields.find((f: any) => f.name === 'athleteId')}
                            value={values.athleteId}
                            error={errors.athleteId}
                            onChange={handleFieldChange}

                        />
                    </div>
                    <div className="border p-8 border-gray-300 rounded-2xl">
                        <div className="pb-6">
                            <div className="flex items-center gap-8 pb-2">
                                <FontAwesomeIcon icon={faClock} size="sm" />
                                <p className="text-xl font-semibold text-gray-800">Tipologia di Abbonamento</p>
                            </div>
                            <p className="text-md text-gray-400">Configura il tipo e la durata dell'abbonamento</p>
                        </div>
                        {!values.athleteId && (
                            <div className="mb-4">
                                <label className="block text-base font-medium text-gray-700 mb-2">
                                    Tipologia di Abbonamento
                                    <span className="text-black ml-1">*</span>
                                </label>
                                <div className="w-full text-sm p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-500">
                                    Seleziona prima l'Atleta
                                </div>
                            </div>
                        )}
                        {values.athleteId &&
                            <Field
                                config={fields.find((f: any) => f.name === 'type')}
                                value={values.type}
                                error={errors.type}
                                onChange={handleFieldChange}
                            />
                        }
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-8 pb-4">
                    <div className="border p-8 border-gray-300 rounded-2xl">
                        <div className="pb-6">
                            <div className="flex items-center gap-8 pb-2">
                                <FontAwesomeIcon icon={faCalendar} size="sm" />
                                <p className="text-xl font-semibold text-gray-800">Periodo e Prezzo</p>
                            </div>
                            <p className="text-md text-gray-400">Definisci le date e il prezzo dell'abbonamento</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <Field
                                config={fields.find((f: any) => f.name === 'date')}
                                value={values.date}
                                error={errors.date}
                                onChange={handleFieldChange}
                            />
                            <div>
                                <p className="block text-base pb-1 font-medium text-gray-700 mb-1">Data Scadenza</p>
                                <div className="w-full p-3 border rounded-xl text-sm text-gray-500 border-gray-300 bg-gray-50">
                                    <p>{values.date && values.type ? formatDate(getSubscriptionExpFromStartDate(values.date, values.type)) : '...'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <p className="block text-base pb-1 font-medium text-gray-700 mb-1">Prezzo Base</p>
                                <div className="w-full p-3 border rounded-xl text-sm text-gray-500 border-gray-300 bg-gray-50">
                                    <p>{values.amount ? `${values.amount} €` : '0 €'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="block text-base pb-1 font-medium text-gray-700 mb-1">Sconto (%)</p>
                                <input
                                    type="number"
                                    className="w-full p-3 border rounded-xl text-sm text-gray-500 border-gray-300"
                                    value={discount}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!isNaN(Number(value))) {
                                            console.log("discount value ->", Number(value));

                                            setDiscount(Number(value));
                                        }
                                    }}
                                />
                            </div>
                            <Field
                                config={fields.find((f: any) => f.name === 'amount')}
                                value={
                                    calculateDiscount(values.amount, discount) + " €"
                                }
                                error={errors.amount}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-8 pb-4">
                    <div className="border p-8 border-gray-300 rounded-2xl">
                        <div className="pb-6">
                            <div className="flex items-center gap-8 pb-2">
                                <FontAwesomeIcon icon={faEuro} size="sm" />
                                <p className="text-xl font-semibold text-gray-800">Pagamento</p>
                            </div>
                            <p className="text-md text-gray-400">Informazioni sul pagamento dell'abbonamento</p>
                        </div>
                        <Field
                            config={fields.find((f: any) => f.name === 'paymentType')}
                            value={values.paymentType}
                            error={errors.paymentType}
                            onChange={handleFieldChange}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-8 pb-4">
                    <div className="border p-8 border-gray-300 rounded-2xl">
                        <div className="pb-6">
                            <div className="flex items-center gap-8 pb-2">
                                <FontAwesomeIcon icon={faPencil} size="sm" />
                                <p className="text-xl font-semibold text-gray-800">Note aggiuntive</p>
                            </div>
                            <p className="text-md text-gray-400">Aggiungi informazioni su questo abbonamento (opzionale)</p>
                        </div>
                        <Field
                            config={fields.find((f: any) => f.name === 'notes')}
                            value={values.notes}
                            error={errors.notes}
                            onChange={handleFieldChange}
                        />
                    </div>
                </div>
                {
                    values &&
                    <SubscriptionResume
                        athleteName={values.athleteId ? getAthletNameAndSurname(values!.athleteId!) : ""}
                        amount={values.amount ? calculateDiscount(values.amount, discount) + " €" : ""}
                        dates={values.date ? "dal " + formatDate(values.date) + " al " + formatDate(getSubscriptionExpFromStartDate(values.date, values.type)) : ""}
                        paymentMethod={values.paymentType ? getPaymentTypeLabel(values.paymentType) : ""}
                        type={values.type ? values.type === 'month' ? 'Mensile' : 'Trimestrale' : ""}
                    />
                }
                {
                    alert.showAlert && <Alert title={alert.infos.title} subtitle={alert.infos.subtitle} isError={alert.infos.isError} path={alert.infos.path} />
                }
            </>
        )

    }

    const subscriptionFields: FieldConfig<Subscription>[] = [
        {
            name: 'athleteId',
            type: 'select',
            label: 'Atleta',
            required: true,
            options: mapAthletesToOptions(athletes)
        },
        {
            name: 'date',
            type: 'date',
            label: 'Data di inizio',
            required: true,
            validation: (value: string) => {
                const today = new Date();
                const valueDate = new Date(value);

                if (valueDate >= today) return "Data inserita non valida"
            }
        },
        {
            name: 'type',
            type: 'select',
            label: 'Tipologia di Abbonamento',
            required: true,
            options: subscriptionTypeOptions
        },
        {
            name: 'amount',
            type: 'text', //TODO al submit convertire in number
            label: 'Importo Finale',
        },
        {
            name: 'paymentType',
            type: 'select',
            label: 'Metodo di pagamento',
            options: paymentTypeOptions,
            required: true,
        },
        {
            name: 'notes',
            type: 'textarea',
            label: ''
        }
    ]

    return (
        <div className="">
            <div className="space-y-8">
                <div>
                    {subscriptionData !== null && (
                        <ModularForm
                            fields={subscriptionFields}
                            initialValues={subscriptionData}
                            onSubmit={handleSubmit}
                            submitLabel={
                                isEditMode ? "Aggiorna Abbonamento" : "Aggiungi Abbonamento"
                            }
                            layout={<TwoColumnLayout />}
                        />
                    )}
                </div>
            </div>
        </div>
    );

}