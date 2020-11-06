import React,{useState,useEffect,useContext} from 'react'
import AuthContext from "../context/auth-context" 
import Spinner from "../components/Spinner/Spinner"
import BookingList from "../components/Bookings/BookingList/BookingList"
import BookingChart from "../components/Bookings/BookingChart/BookingChart"
import BookingControls from "../components/Bookings/BookingControls/BookingControls"

function Bookings() {
    const [loading,setLoading]=useState(false)
    const [bookings,setBookings]=useState(null)
    const [outputType,setOutputType]=useState("list")
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
                            price
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
                mutation CancelBooking($id:ID!){
                    cancelBooking(bookingId:$id){
                        _id
                        title
                        
                    }
                }
            `,
            variables:{
                id:bookingId
            }
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
    const changeOutHandler=(outputType)=>{
        if(outputType==="list"){
            setOutputType("list")
        }else{
            setOutputType("chart")
        }
    }
    let content= <Spinner/>
    if(!loading){
        content=(
            <>
               <BookingControls activeOutputType={outputType} changeOutHandler={changeOutHandler}/>
                <div>
                    {outputType==="list"?<BookingList onCancelBook={onCancelBook} bookings={bookings}/>:
                    <BookingChart bookings={bookings}/>}
                </div>
            </>
        )
    }
    return (
        <>
      {content}
       </>
    )
}

export default Bookings
