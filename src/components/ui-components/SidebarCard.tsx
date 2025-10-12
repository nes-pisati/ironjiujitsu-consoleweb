import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export interface SidebarProps {
    icon: IconDefinition;
    label: string;
    navigateTo: string;
}

export default function SidebarCard(props: SidebarProps) {
    const navigate = useNavigate()

    const handleNavigate = (path: string) => {
        navigate(`/${path}`)
    }

    return (
        <div className="w-50 h-12 ps-4 flex items-center rounded-2xl gap-4 transition-all duration-100 ease-in hover:bg-gray-200 hover:cursor-pointer" onClick={() => handleNavigate(props.navigateTo)}>
            <FontAwesomeIcon icon={props.icon} />
            <p className="text-l font-semibold">{props.label}</p>
        </div>
    )
}