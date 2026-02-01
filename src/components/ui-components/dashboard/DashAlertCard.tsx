
export type AlertProps = {
    title: string,
    athleteName: string,
    // path: string,
    isError: boolean
    labelText?: string
}

const DashAlertCard: React.FC<AlertProps> = ({ title, athleteName, isError, labelText }) => {

    let style = "flex justify-between my-3 px-5 py-2 rounded-xl border border-2";
    let bgColor = "";
    let textColor = ""

    if (isError) {
        bgColor = "bg-red-100 border-red-300"
        textColor = "text-red-400"
    } else {
        bgColor = "bg-yellow-100 border-yellow-400"
        textColor = "text-yellow-500"
    }

    return (
        <div className={`${style} ${bgColor}`}>
            <div className="flex flex-col">
                <p className={`font-bold text-base ${textColor}`}>{title}</p>
                <p className="text-sm text-gray-600">{athleteName}</p>
            </div>
            {isError && labelText && (
                <div className="bg-red-400 h-fit px-2 py-1 rounded-xl">
                    <p className="text-xs font-medium text-white">{labelText}</p>
                </div>
            )}
        </div>
    )
}

export default DashAlertCard
