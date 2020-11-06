import React,{useContext} from 'react'
import "./EventItem.css"
import AuthContext from "../../../../context/auth-context"
function EventItem(props) {
 const context = useContext(AuthContext)
 
    return (   
        <li key={props.eventId} className="events__list-item">
        <div>
            <h1>{props.title}</h1>
            <h2>${props.price} - {new Date(props.date).toLocaleDateString("ko-kr")}</h2>
        </div>
        <div>
            
             {context.userId===props.creator._id ? <p>You are the Owner</p>:
             <button className="btn" onClick={props.onDetail.bind(this,props.eventId)} >View Details</button>}
        </div>
        </li>
   
    )
}

export default EventItem
