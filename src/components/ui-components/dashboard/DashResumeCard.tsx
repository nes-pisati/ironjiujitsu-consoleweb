import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface DashResumeCardProps {
    title: string,
    subtitle: string,
    icon: IconDefinition,
    count: number
}

export default function DashResumeCard(props: DashResumeCardProps) { 
    return (
        <div className="w-auto rounded-2xl h-60 border border-gray-300 p-7 flex flex-col justify-between">
            <div className="pb-10">
                <div className="flex items-center justify-between">
                    <p className="text-l font-semibold">{props.title}</p>
                    <FontAwesomeIcon icon={props.icon} size="lg"/>
                </div>
                <p className="text-gray-500 text-base pt-2">{props.subtitle}</p>
            </div>
            <div>
                <p className="text-4xl font-semibold">{props.count}</p>
            </div>
        </div>
    )
}