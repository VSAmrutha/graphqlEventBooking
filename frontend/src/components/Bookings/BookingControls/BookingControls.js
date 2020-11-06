import React from 'react'
import "./BookingControls.css"
function BookingControls(props) {
    return (
         <div className="bookings-control">
                    <button 
                    className={props.activeOutputType==="list"?"active":""} 
                    onClick={props.changeOutHandler.bind(this,"list")}>List</button>
                    <button 
                    className={props.activeOutputType==="chart"?"active":""} 
                    onClick={props.changeOutHandler.bind(this,"chart")}>Chart</button>
                </div>
    )
}

export default BookingControls
