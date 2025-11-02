export interface SubscriptionStatsCardProps {
    athleteName: string,
    type: string,
    dates: string,
    amount: string,
    paymentMethod: string
}

export default function SubscriptionResume(props: SubscriptionStatsCardProps) { 
    return (
        <div className="w-auto rounded-2xl h-60 border border-gray-400 bg-gray-200 p-7 flex flex-col justify-between">
            <div>
                <p className="text-xl font-semibold">Riepilogo Abbonamento</p>
            </div>
            <div>
                <div className="flex justify-between mb-2">
                    <p className="text-sm">Atleta:</p>
                    <p className="text-sm font-semibold">{props.athleteName}</p>
                </div>
                <div className="flex justify-between mb-2">
                    <p className="text-sm">Tipo:</p>
                    <p className="text-sm font-semibold">{props.type}</p>
                </div>
                <div className="flex justify-between mb-2">
                    <p className="text-sm">Periodo:</p>
                    <p className="text-sm font-semibold">{props.dates}</p>
                </div>
                <div className="flex justify-between mb-2">
                    <p className="text-sm">Metodo di pagamento:</p>
                    <p className="text-sm font-semibold">{props.paymentMethod}</p>
                </div>
                <div className="flex justify-between mb-2 items-center">
                    <p className="text-sm">Prezzo finale:</p>
                    <p className="text-lg font-bold">{props.amount}</p>
                </div>
            </div>
        </div>
    )
}