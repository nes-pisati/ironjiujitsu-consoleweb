import { useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarCard, { type SidebarProps } from "./SidebarCard";
import { faUsers, faCreditCard, faChartSimple } from "@fortawesome/free-solid-svg-icons";


export default function Sidebar() {

    const location = useLocation();

    const sidebarEl: SidebarProps[] = [
        {icon: faChartSimple, label: 'Dashboard', navigateTo: ''},
        {icon: faUsers, label: 'Atleti', navigateTo: 'athletes', subItems: [
            {label: 'Archivio atleti', navigateTo: 'athletes/archive'}
        ]},
        {icon: faCreditCard, label: 'Abbonamenti', navigateTo: 'subscriptions'}
    ]

    const [openItems, setOpenItems] = useState<string[]>(() =>
        sidebarEl
            .filter(el => el.subItems?.some(sub => location.pathname === `/${sub.navigateTo}`))
            .map(el => el.navigateTo)
    );

    const toggleItem = (navigateTo: string) => {
        setOpenItems(prev =>
            prev.includes(navigateTo) ? prev.filter(item => item !== navigateTo) : [...prev, navigateTo]
        );
    };

    return (
        <>
        <div className="fixed left-0 top-0 h-screen w-60 bg-white shadow-md flex flex-col items-center gap-4 py-20">
            {sidebarEl.map(el =>
                <div key={el.navigateTo} className="flex flex-col gap-1">
                    <SidebarCard
                        icon={el.icon}
                        label={el.label}
                        navigateTo={el.navigateTo}
                        isOpen={openItems.includes(el.navigateTo)}
                        onToggle={el.subItems ? () => toggleItem(el.navigateTo) : undefined}
                    />
                    {openItems.includes(el.navigateTo) && el.subItems?.map(sub =>
                        <SidebarCard key={sub.navigateTo} label={sub.label} navigateTo={sub.navigateTo} isSubItem/>
                    )}
                </div>
            )}
            
        </div>
        </>
    )
}
