import React,{useState,useEffect,useContext} from 'react'
import AuthContext from "../context/auth-context" 
import Spinner from "../components/Spinner/Spinner"
import BookingList from "../components/Bookings/BookingList/BookingList"

function Bookings() {
    const [loading,setLoading]=useState(false)
    const [bookings,setBookings]=useState(null)
     const value=useContext(AuthContext)
    useEffect(()=>{
        fetchBookings()
    },[])
    const fetchBookings=()=>{
        setLoading(true)
        const requestBody={
            query:`
                query{
                    bookings{
                        _id
                        createdAt
                        event{
                            _id
                            title
                            date
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
            "Authorization":"Bearer " + value.token
        }
    }).then(res=>{
        if(res.status!==200 && res.status!==201){
            throw new Error("Failer")           
        }
        return res.json()
    })
    .then(resData=>{
         const bookingsData=resData.data.bookings;
        setBookings([...bookingsData])
         setLoading(false)
    })
    .catch(err=>{
        console.log(err)
        setLoading(false)
    })
    }
    const onCancelBook=(bookingId)=>{
        setLoading(true)
        const requestBody={
            query:`
                mutation{
                    cancelBooking(bookingId:"${bookingId}"){
                        _id
                        title
                        
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
       
         const bookingsData=bookings.filter(booking=>booking._id!==bookingId)
        setBookings([...bookingsData])
         setLoading(false)
    })
    .catch(err=>{
        console.log(err)
        setLoading(false)
    })
    }
    return (
        <>
      {loading ?<Spinner/>: <BookingList onCancelBook={onCancelBook} bookings={bookings}/>}
       </>
    )
}

export default Bookings
