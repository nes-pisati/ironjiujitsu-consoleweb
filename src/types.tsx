export type SubscriptionType = 'single' | 'month' | 'quaterly';
export type AdultBelts = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type KidsBelts =     'white' | 'greywhite' | 'grey' | 'greyblack' |
'yellowwhite' | 'yellow' | 'yellowblack' |
'orangewhite' | 'orange' | 'orangeblack' |
'greenwhite' | 'green' | 'greenblack' 

export interface Athlete {
    _id: string,
    name: string,
    surname: string,
    birthDate: Date,
    email: string,
    phoneNumber: string,
    type: string,
    belt: string,
    subscriptionId: string
}

export interface Subscription {
    uid: string,
    date: Date,
    type: string,
    amount: number,
    subscriptionExp: Date,
    athleteId: string,
    notes?: string
}