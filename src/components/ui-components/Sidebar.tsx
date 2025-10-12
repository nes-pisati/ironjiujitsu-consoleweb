import SidebarCard, { type SidebarProps } from "./SidebarCard";
import { faUsers, faCreditCard, faChartSimple } from "@fortawesome/free-solid-svg-icons";


export default function Sidebar() {

    const sidebarEl: SidebarProps[] = [
        {icon: faChartSimple, label: 'Dashboard', navigateTo: ''},
        {icon: faUsers, label: 'Atleti', navigateTo: 'athletes'},
        {icon: faCreditCard, label: 'Abbonamenti', navigateTo: 'subscriptions'}
    ]

    return (
        <>
        <div className="min-h-screen py-25 flex flex-col items-center gap-4 w-60">
            {sidebarEl.map(el => 
                <SidebarCard icon={el.icon} label={el.label} navigateTo={el.navigateTo}/>
            )}
            
        </div>
        </>
    )
}