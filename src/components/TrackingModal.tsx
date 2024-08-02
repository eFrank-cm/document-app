// import { FC } from "react"
// import { Modal } from "./Modal"

// import { TrackUI } from "./TrackUI"
// import { Instance } from "../types"
// import { CheckBadgeIcon, DocDuplicateIcon, XIcon } from "./Icons"
// import { createPortal } from "react-dom"

// interface TrackingModalProp {
//     title: string,
//     instance: Instance,
//     onClose: () => void
// }

// export const TrackingModal: FC<TrackingModalProp> = ({ instance, title, onClose }) => {
//     const { trackId, type } = instance
//     // const [show, setShow] = useState(false)

//     return createPortal(
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <Modal className="relative min-w-96 max-w-96">
//                 <button
//                     onClick={onClose}
//                     className="p-0.5 rounded-full absolute -right-9 -top-0.5"
//                 >
//                     <XIcon />
//                 </button>

//                 <div className="border rounded p-1 mb-4 bg-gray-800 border-gray-500 flex gap-2">
//                     {type === 'original'
//                         ? <CheckBadgeIcon className="text-green-600 flex-shrink-0 w-6 h-6" />
//                         : <DocDuplicateIcon className="flex-shrink-0 w-6 h-6" />
//                     }
//                     <h3 className="text-start">
//                         {title}
//                     </h3>
//                 </div>

//                 <TrackUI trackId={trackId} />
//             </Modal>
//         </div>,
//         document.body
//     );
// }
