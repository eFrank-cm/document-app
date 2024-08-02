import { FC, useState } from "react"
import { ItemSet } from "../types"
import { TrackingModal } from "./TrackingModal"
import { CheckBadgeIcon, ChevronDownIcon, ChevronUpIcon, DocDuplicateIcon, EyeIcon } from "./Icons"

interface ComboBotton {
    className?: string,
    onClick: () => void,
}


export const ComboBotton: FC<ComboBotton> = ({ className, onClick }) => {
    const [down, setDown] = useState(false)

    function handleClick() {
        onClick()
        setDown(prev => !prev)
    }

    return (
        <button className={className} onClick={handleClick} >
            {
                down
                    ? <ChevronUpIcon />
                    : <ChevronDownIcon />
            }
        </button >
    )
}

interface CardProp {
    itemSet: ItemSet
}

export const ItemCard: FC<CardProp> = ({ itemSet }) => {
    const { name, instances } = itemSet
    const [hidden, setHidden] = useState(true)

    return (
        <div className="my-5 w-full">
            <fieldset className='flex justify-between items-start rounded border border-gray-500 py-3 px-2 bg-zinc-950'>
                <div className="flex items-start gap-3">
                    <span className="bg-red-600 rounded px-2">{instances.length}</span>
                    <h6 className="text-start">
                        {name}
                    </h6>
                </div>


                <ComboBotton className="py-0 px-0.5" onClick={() => setHidden(prev => !prev)} />
            </fieldset>

            <div className="pl-10" hidden={hidden}>
                {
                    instances.map((markWithType, index) => (
                        <div key={index} className="flex justify-between p-1 border border-t-0 rounded">
                            <div className="flex gap-2 pl-1 py-1">
                                {
                                    markWithType.type === 'original'
                                        ? <CheckBadgeIcon className="text-green-600 flex-shrink-0 w-6 h-6" />
                                        : <DocDuplicateIcon className="flex-shrink-0 w-6 h-6" />
                                }
                                <h6 className="text-start">
                                    en {markWithType.location}
                                </h6>
                            </div>

                            <div className="flex items-center">
                                <button className="px-2 py-1">
                                    <EyeIcon />
                                </button>
                                <TrackingModal instance={markWithType} title={name} />
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}
