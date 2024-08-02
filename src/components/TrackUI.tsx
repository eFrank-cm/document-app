// import { FC, useEffect, useState } from 'react'
// import './trackUI.css'

// interface TrackUIProp {
//     trackId: number
// }

// const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

// function formaterDate(date: Date) {
//     const year = date.getFullYear()
//     const month = months[date.getMonth()]
//     const day = date.getDate().toString().padStart(2, '0')

//     let hours = date.getHours()
//     const minutes = date.getMinutes().toString().padStart(2, '0')
//     const ampm = hours >= 12 ? 'pm' : 'am'
//     hours = hours % 12
//     hours = hours ? hours : 12
//     const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

//     return `${year} ${month} ${day} - ${formattedTime}`
// }

// export const TrackUI: FC<TrackUIProp> = ({ trackId }) => {
//     const [marks, setMarks] = useState<Mark[]>([])

//     useEffect(() => {
//         const data = getMarksByTrack(trackId)
//         setMarks(data)
//         console.log('getMarkByTrack', trackId)
//     }, [])

//     return (
//         <>
//             <div className='trackUIbody'>
//                 <div className="timeline">

//                     {
//                         marks.map((mark, index) => (
//                             <div key={mark.id} className='timeline-item'>
//                                 <div className={`timeline-marker ${index === marks.length - 1 ? 'marker-init' : ''} ${mark.isHere ? 'marker-ishere' : ''} `}></div>
//                                 <div className={`${index !== marks.length - 1 ? 'timeline-line' : ''}`}></div>
//                                 <div className='line'></div>
//                                 <div className="timeline-content w-fit">
//                                     <h3 className='text-base text-start'>{mark.location}</h3>
//                                     <p className='text-sm text-start text-gray-500'>{formaterDate(mark.createAt)}</p>
//                                 </div>
//                             </div>
//                         ))
//                     }

//                 </div>
//             </div>
//         </>

//     )
// }
