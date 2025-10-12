import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface PageTitleProps {
    title: string,
    subtitle: string,
    btnText?: string,
    btnIcon?: IconProp | undefined,
    btnVisible: boolean,
    onBtnClick?: () => void
}

export default function PageTitle(props: PageTitleProps) {

    return (
        <>
            <div className="pe-12">
                <div className="flex items-center gap-8">
                    {props.btnVisible &&
                        <button className="border border-gray-400 font-bold text-base py-4 px-4 rounded-2xl flex items-center gap-5 hover:cursor-pointer transition-all duration-100 ease-in hover:bg-black hover:text-white"
                            onClick={props.onBtnClick}>
                            <FontAwesomeIcon icon={props.btnIcon!} size="sm" />
                            {props.btnText}
                        </button>
                    }
                    <div>
                        <h1 className="text-3xl py-1 font-bold">{props.title}</h1>
                        <p className="text-xl text-gray-500">{props.subtitle}</p>
                    </div>
                </div>

            </div>
        </>
    )
}