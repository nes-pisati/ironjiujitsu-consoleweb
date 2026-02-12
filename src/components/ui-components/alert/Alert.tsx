import { useNavigate } from "react-router-dom";

export type AlertProps = {
    title: string,
    subtitle: string,
    path: string,
    isError: boolean
}

const Alert: React.FC<AlertProps> = ({ title, subtitle, isError, path }) => {

    const style = "flex items-center justify-between gap-2 px-5 py-2 rounded-xl border border-2";
    let bgColor = "";
    let textColor = ""

    if (isError) {
        bgColor = "bg-red-300 border-red-600"
        textColor = "text-red-800"
    } else {
        bgColor = "bg-green-300 border-green-600"
        textColor = "text-green-800"
    }

    const navigate = useNavigate()

    const handleNavigate = (path: string) => {
        navigate(`/${path}`)
    }

    return (
        <div className={`${style} ${bgColor}`}>
            <div>
                <p className={`font-bold ${textColor}`}>{title}</p>
                <p className={`text-xs ${textColor}`}>{subtitle}</p>
            </div>
            <div >
                <button onClick={() => handleNavigate(path)}>
                    <div className="flex items-center gap-2">
                        <p className={`text-xs font-semibold cursor-pointer ${textColor}`}>Indietro</p>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default Alert;