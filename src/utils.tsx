import type { AdultBelts, Athlete, KidsBelts, Subscription, SubscriptionType } from "../src/types";

type AllBelts = AdultBelts | KidsBelts;

export const getBeltColour = (belt: AllBelts, width: string, height: string): string => { //w-5 h-5 
    const baseClass = 'rounded-4xl';

    const beltColors: Record<AllBelts, string> = {
        white: 'bg-white',
        blue: 'bg-blue-600',
        purple: 'bg-purple-600',
        brown: 'bg-amber-900',
        black: 'bg-black',

        greywhite: 'bg-gray-100',
        grey: 'bg-gray-400',
        greyblack: 'bg-gray-700',

        yellowwhite: 'bg-yellow-100',
        yellow: 'bg-yellow-400',
        yellowblack: 'bg-yellow-700',

        orangewhite: 'bg-orange-200',
        orange: 'bg-orange-500',
        orangeblack: 'bg-orange-800',

        greenwhite: 'bg-green-200',
        green: 'bg-green-500',
        greenblack: 'bg-green-800',
    };

    const bgClass = beltColors[belt]

    const borderClass = belt === 'white' ? 'border border-black' : '';

    return [bgClass, baseClass, width, height, borderClass].filter(Boolean).join(' ');
};

export const getBeltTranslation = (belt: AllBelts) => {
    const beltColors: Record<AllBelts, string> = {
        white: 'Bianca',
        blue: 'Blu',
        purple: 'Viola',
        brown: 'Marrone',
        black: 'Nera',

        greywhite: 'Grigio Bianca',
        grey: 'Grigia',
        greyblack: 'Grigio Nera',

        yellowwhite: 'Gialla Bianca',
        yellow: 'Gialla',
        yellowblack: 'Gialla Nera',

        orangewhite: 'Arancio Bianca',
        orange: 'Arancio',
        orangeblack: 'Arancio Nera',

        greenwhite: 'Verde Bianca',
        green: 'Verde',
        greenblack: 'Verde Nera',
    };

    const bgTranslation = beltColors[belt]

    return bgTranslation
}

export const getAthleteAge = (birthDate: Date): string | undefined => {
    if (!birthDate) return;

    const formatDate = new Date(birthDate);
    const birthYear = formatDate.getUTCFullYear();
    const thisYear = new Date().getFullYear();
    const age = thisYear - birthYear
    return age.toString()
}

export const formatDate = (date: Date): string => {
    if (!date) return '';

    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("it-IT")
}

export const calculateAge = (birthDate: string | Date): number => {
    if (!birthDate) return 0;

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

export const getTypeFromAge = (age: number): string => {
    return age >= 16 ? 'adult' : 'kids';
};

