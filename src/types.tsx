export type AdultBelts = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type KidsBelts = 'white' | 'greywhite' | 'grey' | 'greyblack' |
    'yellowwhite' | 'yellow' | 'yellowblack' |
    'orangewhite' | 'orange' | 'orangeblack' |
    'greenwhite' | 'green' | 'greenblack';
export type AthleteType = 'kids' | 'adult';

export type SubscriptionType = 'month' | 'quarterly' | 'sixmonth' | '10entrance';
export type PaymentType = 'banktransfer' | 'cash' | 'paypal' | 'other';
export type EnsuranceType = 'A' | 'B';
export type GenderType = 'M' | 'F'

type AllBelts = AdultBelts | KidsBelts;

export interface Athlete {
    _id: string,
    name: string,
    surname: string,
    birthDate: string,
    fiscalCode?: string,
    email: string,
    gender: GenderType,
    phoneNumber: string,
    type: AthleteType,
    belt: AllBelts,
    subscriptionId: string,
    medicalCertificate: boolean,
    medicalCertificateExp: Date | null,
    medicalCertificateReleaseDate: string | null,
    ensurance: boolean,
    ensuranceType: EnsuranceType,
    ensuranceExp: Date,
    ensuranceStartDate: string,
    whatsappConsent: boolean,
    whatsappConsentDate: Date,
    archived?: boolean
}

export interface Subscription {
    _id: string,
    date: Date,
    type: SubscriptionType,
    amount: number,
    subscriptionExp: Date,
    athleteId: string,
    notes?: string,
    paymentType: PaymentType,
    createdAt: Date
}

export interface User {
    username: string,
    password: string,
}
