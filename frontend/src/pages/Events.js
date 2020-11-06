import React, {useState,useRef,useContext,useEffect} from 'react'
import "./Events.css"
import Modal from "../components/Modal/Modal"
import Backdrop from "../components/Backdrop/Backdrop"
import Spinner from "../components/Spinner/Spinner"
import EventList from "../components/Events/EventList/EventList"
import AuthContext from "../context/auth-context" 
function Events() {
    const [creating,setCreating]=useState(false)
    const [events,setEvents]=useState([])
    const [loading,setLoading]=useState(false)
    const [selectedEvent,setSelectedEvent]=useState(null)
    const titleRef=useRef("")
    let isactive=true
    const priceRef=useRef("")
    const dateRef=useRef("")
    const descriptionRef=useRef("")
    const value=useContext(AuthContext)
    const fetchEvents=()=>{
        setLoading(true)
        const requestBody={
            query:`
                query{
                    events{
                        _id
                        title
                        description
                        price
                        date
                        creator{
                             _id
                             email
                        }
                    }
                }
            `
        }
    fetch("http://localhost:8000/graphql",{
        method:'POST',
        body:JSON.stringify(requestBody),
        headers:{
            "Content-Type":"application/json",
        }
    }).then(res=>{
        if(res.status!==200 && res.status!==201){
            throw new Error("Failer")           
        }
        return res.json()
    })
    .then(resData=>{
         const eventsData=resData.data.events;
       if(isactive){
            setEvents([...eventsData])
         setLoading(false)
       }
       
    })
    .catch(err=>{
        console.log(err)
         if(isactive){
        setLoading(false)
         }
    })
    }
    useEffect(()=>{
        fetchEvents()
          return ( ()=>{
         isactive=false
      });
    },[])
  
    const onClickHandler=()=>{
        setCreating(true)
    }
    const onCancel=()=>{
        setCreating(false) 
        setSelectedEvent(null)
    }
    const onConfirm=()=>{
        setCreating(false) 
         const title=titleRef.current.value;
         const price=+priceRef.current.value;
         const date=dateRef.current.value;
         const description=descriptionRef.current.value;
        if(title.trim().length===0 || price<=0 || date.trim().length===0 || description.trim().length===0){
            return;
        }
         const event={title,price,date,description};
        
            const requestBody={
                query:`
                    mutation{
                        createEvent(eventInput:{title:"${title}",description:"${description}",price:${price},date:"${date}"}){
                            _id
                            title
                            description
                            price
                            date
                        }
                    }
                `
            }
        
        const token=value.token;
       
        fetch("http://localhost:8000/graphql",{
            method:'POST',
            body:JSON.stringify(requestBody),
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + token
            }
        }).then(res=>{
            if(res.status!==200 && res.status!==201){
                throw new Error("Failer")
               
            }
            return res.json()
        })
        .then(resData=>{
            // fetchEvents()  
            const updatedEvents=[...events]
            updatedEvents.push({
                 _id:resData.data.createEvent._id,
                        title:resData.data.createEvent.title,
                        description:resData.data.createEvent.description,
                        price:resData.data.createEvent.price,
                        date:resData.data.createEvent.date,
                        creator:{
                             _id:value.userId
                        }
            })
            setEvents([...updatedEvents])
                   
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const onConfirmBookEvent=()=>{
        if(!value.token){
              setSelectedEvent(null)
            return;
        }
         setLoading(true)
        const requestBody={
            query:`
                mutation{
                    bookEvent(eventId:"${selectedEvent._id}"){
                        _id
                       createdAt
                       updatedAt
                    }
                }
            `
        }
    fetch("http://localhost:8000/graphql",{
        method:'POST',
        body:JSON.stringify(requestBody),
        headers:{
            "Content-Type":"application/json",
             "Authorization":"Bearer " + value.token
        }
    }).then(res=>{
        if(res.status!==200 && res.status!==201){
            throw new Error("Failer")           
        }
        return res.json()
    })
    .then(resData=>{

       console.log("resData",resData)
        setLoading(false)
        setSelectedEvent(null)
    })
    .catch(err=>{
        console.log(err)
        setLoading(false)
    })
    }
   const showDetail=(eventId)=>{
     
       setSelectedEvent((prevState)=>{
           const slectedEv=events.find(e=>e._id===eventId)
           
           return slectedEv
       })
    }
    
    return (
        <>
        {creating && <><Backdrop/>
        <Modal 
        title="Add Event" 
         confirmText="Confirm"
        onCancel={onCancel}
        onConfirm={onConfirm}
        canCancel 
        canConfirm>
            <form>
            <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                ref= {titleRef} 
                 type="text" id="title"/>
            </div>
            <div className="form-control">
                <label htmlFor="price">Price</label>
                <input
                 ref= {priceRef} 
                 type="text" id="price"/>
            </div>
            <div className="form-control">
                <label htmlFor="date">date</label>
                <input
                 ref= {dateRef} 
                 type="datetime-local" id="date"/>
            </div>
            <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                 ref= {descriptionRef} 
                 type="text" id="description" rows="4"></textarea>
            </div>
            </form>
        </Modal></>}
         {selectedEvent && <><Backdrop/>
        <Modal 
        title={selectedEvent.title }
        confirmText={value.token?"Book Event":"Confirm"}
        onCancel={onCancel}
        onConfirm={onConfirmBookEvent}
        canCancel 
        canConfirm>
           <h1>{selectedEvent.title}</h1>
           <h2>${selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString("ko-kr")}</h2>
           <p>{selectedEvent.description}</p>
        </Modal></>}

        {value.token && <div className="events-control">
            <p>Share your Own Events!!</p>
           <button className="btn" onClick={onClickHandler}>Create Event</button>
        </div>}
       {loading ?<Spinner/>: <EventList onViewDetail={showDetail} events={events}/>} 
        </>
    )
}

export default Events
