import React from 'react'
import "./EventList.css"
import EventItem from "./EventItem/EventItem"
function EventList(props) {
      const eventList=props.events.map(event=>{
        return <EventItem 
        date={event.date}
        key={event._id} 
        price={event.price} 
        eventId={event._id} 
        title={event.title} 
        creator={event.creator}
         onDetail={props.onViewDetail}/>
       
    })
    return (
         <ul className="events__list">
            {eventList}
        </ul>
    )
}

export default EventList
