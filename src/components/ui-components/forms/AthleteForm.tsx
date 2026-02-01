import { ModularForm, type FieldConfig } from "./GenericForm";
import type { Athlete } from "../../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileMedical, faPhone, faStethoscope, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAthleteContext } from "../../../context/AthleteContext";
import { useEffect, useState } from "react";
import { calculateAge, formatDate, formatFieldsDate, getTypeFromAge } from "../../../utils";
import Alert, { type AlertProps } from "../alert/Alert";


interface AthleteFormProps {
  athleteId?: string;
  mode?: 'create' | 'edit'
}

interface AlertHandler {
  infos: AlertProps,
  showAlert: boolean
}

export default function AthleteForm({ athleteId, mode = 'create' }: AthleteFormProps) {

  const { addAthlete, editAthlete, getAthlete } = useAthleteContext();
  const [athleteData, setAthleteData] = useState<Partial<Athlete>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [alert, setAlert] = useState<AlertHandler>({
    infos: {} as AlertProps,
    showAlert: false
  })

  const isEditMode = mode === 'edit' && athleteId;

  const loadAthleteData = async (id: string): Promise<Athlete | null> => {
    setLoading(true);
    try {
      const athlete = await getAthlete(id);
      if (!athlete) {
        throw new Error(`Atleta con ID ${id} non trovato`);
      }

      return athlete;
    } catch (err) {
      console.error('Errore caricamento atleta:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        const data = await loadAthleteData(athleteId);
        if (data) {
          // const formattedBirthday = formatFieldsDate(data.birthDate)
          // const formattedMedicalCertificateStartDate = formatFieldsDate(data.medicalCertificateReleaseDate);
          // const formattedEnsuranceStartDate = formatFieldsDate(data.ensuranceStartDate)
          // setAthleteData({ ...data, birthDate: formattedBirthday, medicalCertificateReleaseDate: formattedMedicalCertificateStartDate, ensuranceStartDate: formattedEnsuranceStartDate });
          setAthleteData(data)
          setError(null);
        } else {
          setError('Impossibile caricare i dati dell\'atleta');
          setAthleteData({});
        }
      };
      fetchData();
    } else {
      setAthleteData({});
      setError(null);
    }
  }, [athleteId, isEditMode]);

  const typeOptions = [
    { value: 'kids', label: 'Bambino' },
    { value: 'adult', label: 'Adulto' },
  ]

  const genderOptions = [
    { value: 'M', label: 'Maschio' },
    { value: 'F', label: 'Femmina' },
  ]

  const adultBeltsOptions = [
    { value: 'white', label: 'Bianca' },
    { value: 'blue', label: 'Blu' },
    { value: 'purple', label: 'Viola' },
    { value: 'brown', label: 'Marrone' },
    { value: 'black', label: 'Nera' },
  ];

  const kidsBeltsOptions = [
    { value: 'white', label: 'Bianca' },
    { value: 'greywhite', label: 'Grigia-Bianca' },
    { value: 'grey', label: 'Grigia' },
    { value: 'greyblack', label: 'Grigia-Nera' },
    { value: 'yellowwhite', label: 'Gialla-Bianca' },
    { value: 'yellow', label: 'Gialla' },
    { value: 'yellowblack', label: 'Gialla-Nera' },
    { value: 'orangewhite', label: 'Arancione-Bianca' },
    { value: 'orange', label: 'Arancione' },
    { value: 'orangeblack', label: 'Arancione-Nera' },
    { value: 'greenwhite', label: 'Verde-Bianca' },
    { value: 'green', label: 'Verde' },
    { value: 'greenblack', label: 'Verde-Nera' },
  ];

  const ensuranceOptions = [
    { value: 'A', label: 'Tipologia A' },
    { value: 'B', label: 'Tipologia B' }
  ]

  // const calculateExpiration = (date: Date): Date => {
  //   const exp = new Date(date);
  //   exp.setFullYear(exp.getFullYear() + 1)
  //   return exp
  // }



  const handleSubmit = async (values: Athlete) => {

    try {
      let saved;
      let medicalCertificate;
      let email;

      const today = new Date();

      if (!values.medicalCertificateReleaseDate) {
        medicalCertificate = false;
      } else {
        medicalCertificate = true;
      }

      if (!values.email) {
        email = ""
      } else {
        email = values.email
      }

      const formattedBirthDay = formatFieldsDate(values.birthDate);
      const formattedMedicalCertificateStartDate = values.medicalCertificateReleaseDate ? formatFieldsDate(values.medicalCertificateReleaseDate) : null
      const formattedEnsuranceStartDate = formatFieldsDate(values.ensuranceStartDate)

      if (isEditMode) {
        const { ensuranceExp, medicalCertificateExp, ...rest } = values;

        saved = await editAthlete(athleteId!, {
          ...rest,
          birthDate: formattedBirthDay,
          ensurance: true,
          ensuranceStartDate: formattedEnsuranceStartDate,
          medicalCertificate: medicalCertificate,
          medicalCertificateReleaseDate: formattedMedicalCertificateStartDate,
          email: email,
        });


        setAlert({
          infos: {
            title: "Atleta aggiornato con successo",
            subtitle: "Le informazioni sono state aggiornate correttamente.",
            isError: false,
            path: 'athletes'
          },
          showAlert: true
        })
      }
      else {
        saved = await addAthlete({
          ...values,
          ensurance: true,
          medicalCertificate: medicalCertificate,
          email: email,
          whatsappConsent: true,
          whatsappConsentDate: today
        });

        setAlert({
          infos: {
            title: "Atleta aggiunto con successo",
            subtitle: "L'atleta è stato inserito correttamente.",
            isError: false,
            path: 'athletes'
          },
          showAlert: true
        })
      }

    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      setAlert({
        infos: {
          title: "Errore nell'aggiunta dell'Atleta",
          subtitle: "Errore:" + error,
          isError: true,
          path: 'athletes'
        },
        showAlert: true
      })
    }
  };

  const TwoColumnLayout = ({ fields, values, errors, updateValue, Field }: any) => {

    // useEffect(() => {
    //   console.log("Values ->", values);
    // }, [values])

    const getBeltOptions = () => {
      if (values.type === 'kids') {
        return kidsBeltsOptions;
      } else if (values.type === 'adult') {
        return adultBeltsOptions;
      }
      return [];
    };

    const beltFieldConfig = fields.find((f: any) => f.name === 'belt');
    const dynamicBeltField = beltFieldConfig ? {
      ...beltFieldConfig,
      options: getBeltOptions()
    } : null;

    const handleFieldChange = (name: keyof Athlete, value: any) => {
      updateValue(name, value);

      if (name === 'birthDate' && value) {
        const age = calculateAge(value);
        const newType = getTypeFromAge(age);
        updateValue('type', newType);

        updateValue('belt', '');
      }

      if (name === 'type') {
        updateValue('belt', '');
      }

    };

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 pb-6">
          <div className="border p-8 border-gray-300 rounded-2xl">
            <div className="pb-6">
              <div className="flex items-center gap-8 pb-2">
                <FontAwesomeIcon icon={faUser} size="sm" />
                <p className="text-2xl font-semibold text-gray-800">Informazioni Personali</p>
              </div>
              <p className="text-md text-gray-400">Dati anagrafici dell'atleta</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Field
                config={fields.find((f: any) => f.name === 'name')}
                value={values.name}
                error={errors.name}
                onChange={handleFieldChange}
                className='focus:border-black'
              />
              <Field
                config={fields.find((f: any) => f.name === 'surname')}
                value={values.surname}
                error={errors.surname}
                onChange={handleFieldChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Field
                config={fields.find((f: any) => f.name === 'birthDate')}
                value={isEditMode ? formatFieldsDate(values.birthDate) : values.birthDate}
                error={errors.birthDate}
                onChange={handleFieldChange}
              />
              <Field
                config={fields.find((f: any) => f.name === 'gender')}
                value={values.gender}
                error={errors.gender}
                onChange={handleFieldChange}
              />
            </div>
            <Field
              config={fields.find((f: any) => f.name === 'fiscalCode')}
              value={values.fiscalCode}
              error={errors.fiscalCode}
              onChange={handleFieldChange}
            />

            <Field
              config={fields.find((f: any) => f.name === 'type')}
              value={values.type}
              error={errors.type}
              onChange={handleFieldChange}
            />

            {dynamicBeltField && values.type && (
              <Field
                config={dynamicBeltField}
                value={values.belt}
                error={errors.belt}
                onChange={handleFieldChange}
              />
            )}

            {!values.type && (
              <div className="mb-4">
                <label className="block text-l font-medium text-gray-700 mb-3">
                  Cintura
                  <span className="text-black ml-1">*</span>
                </label>
                <div className="w-full text-sm p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-500">
                  Seleziona prima la tipologia
                </div>
              </div>
            )}
          </div>
          <div className="border p-8 border-gray-300 rounded-2xl">
            <div className="pb-6">
              <div className="flex items-center gap-8 pb-2">
                <FontAwesomeIcon icon={faPhone} size="sm" />
                <p className="text-2xl font-semibold text-gray-800">Contatti</p>
              </div>
              <p className="text-md text-gray-400">Informazioni di contatto</p>
            </div>
            <Field
              config={fields.find((f: any) => f.name === 'email')}
              value={values.email}
              error={errors.email}
              onChange={handleFieldChange}
            />
            <Field
              config={fields.find((f: any) => f.name === 'phoneNumber')}
              value={values.phoneNumber}
              error={errors.phoneNumber}
              onChange={handleFieldChange}
            />
          </div>

        </div>
        <div className="grid grid-cols-1 gap-8 pb-5">
          <div className="border p-8 border-gray-300 rounded-2xl">
            <div className="pb-6">
              <div className="flex items-center gap-8 pb-2">
                <FontAwesomeIcon icon={faStethoscope} size="sm" />
                <p className="text-2xl font-semibold text-gray-800">Certificato Medico</p>
              </div>
              <p className="text-md text-gray-400">Registrazione del certificato</p>
            </div>
            <Field
              config={fields.find((f: any) => f.name === 'medicalCertificateReleaseDate')}
              value={isEditMode && values.medicalCertificateReleaseDate ? formatFieldsDate(values.medicalCertificateReleaseDate) : values.medicalCertificateReleaseDate}
              error={errors.medicalCertificateReleaseDate}
              onChange={
                handleFieldChange
              }
            />
          </div>

          <div className="border p-8 border-gray-300 rounded-2xl">
            <div className="pb-6">
              <div className="flex items-center gap-8 pb-2">
                <FontAwesomeIcon icon={faFileMedical} size="sm" />
                <p className="text-2xl font-semibold text-gray-800">Assicurazione</p>
              </div>
              <p className="text-md text-gray-400">Inserimento assicurazione</p>
            </div>
            <Field
              config={fields.find((f: any) => f.name === 'ensuranceType')}
              value={values.ensuranceType}
              error={errors.ensuranceType}
              onChange={handleFieldChange}
            />
            <Field
              config={fields.find((f: any) => f.name === 'ensuranceStartDate')}
              value={isEditMode ? formatFieldsDate(values.ensuranceStartDate) : values.ensuranceStartDate}
              error={errors.ensuranceStartDate}
              onChange={handleFieldChange}
            />

          </div>
        </div>
        {
          alert.showAlert && <Alert title={alert.infos.title} subtitle={alert.infos.subtitle} isError={alert.infos.isError} path={alert.infos.path} />
        }

      </>
    );
  };

  const userFields: FieldConfig<Athlete>[] = [
    {
      name: 'name',
      type: 'text',
      label: 'Nome',
      required: true,
      validation: (value: string) => value.length < 2 ? 'Nome deve avere almeno 2 caratteri' : undefined
    },
    {
      name: 'surname',
      type: 'text',
      label: 'Cognome',
      required: true,
      validation: (value: string) => value.length < 2 ? 'Cognome deve avere almeno 2 caratteri' : undefined
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'Data di nascita',
      validation: (value: string) => {
        const today = new Date();
        const valueDate = new Date(value);

        if (valueDate >= today) return "Data inserita non valida"
      }
    },
    {
      name: 'fiscalCode',
      type: 'text',
      label: 'Codice Fiscale',
      validation: (value: string) => {
        if (value.length != 16) return "Il Codice Fiscale deve essere lungo 16 caratteri"
      }
    },
    {
      name: 'gender',
      type: 'select',
      label: 'Genere',
      options: genderOptions
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tipologia',
      required: true,
      options: typeOptions
    },
    {
      name: 'belt',
      type: 'select',
      label: 'Cintura',
      required: true,
      options: []
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      validation: (value) => !/\S+@\S+\.\S+/.test(value) ? 'Email non valida' : undefined
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Numero di telefono',
      required: true,
      validation: (value) => {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return !phoneRegex.test(value) ? 'Numero di telefono non valido' : undefined;
      }
    },
    {
      name: 'medicalCertificateReleaseDate',
      type: 'date',
      label: 'Data rilascio certificato',
      required: false
    },
    {
      name: 'ensuranceType',
      type: 'select',
      label: 'Tipologia Assicurazione',
      required: true,
      options: ensuranceOptions
    },
    {
      name: 'ensuranceStartDate',
      type: 'date',
      label: 'Data attivazione assicurazione',
      required: true
    },
  ];

  return (
    <div className="">
      <div className="space-y-8">
        <div>
          {(!isEditMode || Object.keys(athleteData).length > 0) && (
            <ModularForm
              fields={userFields}
              initialValues={athleteData}
              onSubmit={handleSubmit}
              submitLabel={isEditMode ? "Aggiorna Atleta" : "Aggiungi Atleta"}
              layout={<TwoColumnLayout />}
            />
          )}

          {/* Loading state per modalità edit */}
          {isEditMode && Object.keys(athleteData).length === 0 && !error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}