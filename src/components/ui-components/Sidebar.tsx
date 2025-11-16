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
        <div className="fixed left-0 top-0 h-screen w-60 bg-white shadow-md flex flex-col items-center gap-4 py-20">
            {sidebarEl.map(el => 
                <SidebarCard icon={el.icon} label={el.label} navigateTo={el.navigateTo}/>
            )}
            
        </div>
        </>
    )
}