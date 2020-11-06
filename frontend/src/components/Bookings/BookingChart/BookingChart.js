import React from 'react'
import {Bar as BarChart} from "react-chartjs"
const Booking_Buckets={
    "cheap":{
        min:0,
        max:11
    },
    "Normal":{
        min:12,
        max:500
    },
    "Expensive":{
        min:501,
        max:1001
    },
}

function BookingChart(props) {
    const chartData={labels:[],datasets:[]};
     let values=[]
    for(const bucket in Booking_Buckets){
        const filteredBookings=props.bookings.reduce((prev,current)=>{
            if(current.event.price >Booking_Buckets[bucket].min &&current.event.price<Booking_Buckets[bucket].max){
                return prev+1
            }else{
              return  prev;
            }
        },0)
       values.push(filteredBookings)
        chartData.labels.push(bucket);
       
        chartData.datasets.push({
            // label: "My First dataset",
			fillColor: "rgba(220,220,220,0.5)",
			strokeColor: "rgba(220,220,220,0.8)",
			highlightFill: "rgba(220,220,220,0.75)",
			highlightStroke: "rgba(220,220,220,1)",
			data: values
        })
        values=[...values]
        values[values.length-1]=0
    }
   

    return (
        <div style={{textAlign:"center"}}>
        <BarChart data={chartData}/>
        </div>
    )
}

export default BookingChart
