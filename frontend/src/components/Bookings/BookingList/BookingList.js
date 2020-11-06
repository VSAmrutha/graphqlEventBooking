import React from 'react'
import "./BookingList.css"
function BookingList(props) {
    return (
        <ul className="booking__list">
            {props.bookings && props.bookings.map(booking=>{
                return  <li key={booking._id} className="booking__item">
               <div className="booking__item-data"> {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString("ko-kr")}</div>
               <div className="booking__item-actions">
               <button className="btn" onClick={props.onCancelBook.bind(this,booking._id)}>Cancel</button>
                </div>
                </li>
            })}
        </ul>
    )
}

export default BookingList
