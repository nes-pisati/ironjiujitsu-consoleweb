import { type IconDefinition, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export interface SidebarProps {
    icon?: IconDefinition;
    label: string;
    navigateTo: string;
    subItems?: SidebarProps[];
    isSubItem?: boolean;
    isOpen?: boolean;
    onToggle?: () => void;
}

export default function SidebarCard(props: SidebarProps) {
    const navigate = useNavigate()

    const handleNavigate = (path: string) => {
        navigate(`/${path}`)
    }

    return (
        <div className={`w-50 flex items-center rounded-2xl gap-4 transition-all duration-100 ease-in hover:bg-gray-200 hover:cursor-pointer ${props.isSubItem ? 'h-10 ps-12' : 'h-12 ps-4'}`} onClick={() => handleNavigate(props.navigateTo)}>
            {props.icon && <FontAwesomeIcon icon={props.icon} />}
            <p className={props.isSubItem ? "text-sm font-medium text-gray-600" : "text-l font-semibold"}>{props.label}</p>
            {props.onToggle &&
                <button
                    className="ms-auto me-3 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-300 hover:cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        props.onToggle!();
                    }}
                >
                    <FontAwesomeIcon icon={faChevronDown} size="xs" className={`transition-transform duration-200 ${props.isOpen ? 'rotate-180' : ''}`} />
                </button>
            }
        </div>
    )
}
