import { faEye, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface SubscriptionStatsCardProps {
    title: string,
    icon: IconDefinition,
    count: any,
    subtitle: string,
    textColor?: string
}

export default function SubscriptionStatsCard(props: SubscriptionStatsCardProps) {
    return (
        <div className="w-auto rounded-2xl h-60 border border-gray-300 p-7 flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <p className="font-semibold text-l">{props.title}</p>
                <FontAwesomeIcon icon={props.icon} size="sm" color="gray" />
            </div>
            <div className="pt-8">
                <p className={`font-semibold text-4xl ${props.textColor ?? ''}`}>{props.count}</p>
                <p className="pt-2 text-base text-gray-500">{props.subtitle}</p>
            </div>
        </div>
    )
}