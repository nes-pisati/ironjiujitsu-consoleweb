export type AdultBelts = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type KidsBelts =     'white' | 'greywhite' | 'grey' | 'greyblack' |
'yellowwhite' | 'yellow' | 'yellowblack' |
'orangewhite' | 'orange' | 'orangeblack' |
'greenwhite' | 'green' | 'greenblack'; 
export type AthleteType = 'kid' | 'adult';

export type SubscriptionType = 'month' | 'quarterly';
export type PaymentType = 'banktransfer' | 'cash' | 'paypal';
export type EnsuranceType = 'A' | 'B';
export type GenderType = 'M' | 'F'

type AllBelts = AdultBelts | KidsBelts;

export interface Athlete {
    _id: string,
    name: string,
    surname: string,
    birthDate: string,
    fiscalCode: string,
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
    ensuranceStartDate: string
}

export interface Subscription {
    uid: string,
    date: Date,
    type: SubscriptionType,
    amount: number,
    subscriptionExp: Date,
    athleteId: string,
    notes?: string,
    paymentType: PaymentType,
    createdAt: Date
}