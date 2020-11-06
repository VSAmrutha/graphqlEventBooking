const Event=require("../../models/event")
const User=require("../../models/user")
const {transformEvent}=require("./merge")

module.exports={
    events:async()=>{
  try{
    const events=await  Event.find()
       return events.map(event=>{ 
        return transformEvent(event)
       })
     }catch(err){     
        throw err;
    }
    },
    createEvent:async(args,req)=>{ 
          if(!req.isAuth){
            throw new Error("Unauthenticated")
          }
        const event=new Event({
            title:args.eventInput.title,
            description:args.eventInput.description,
            price:+args.eventInput.price,
            date:new Date(args.eventInput.date),
            creator:req.userId
        })
       let createdEvent;
       try{
        const result= await event.save()    
            createdEvent=transformEvent(result)
            const creatorUser= await User.findById("5f9810803fbd7c630811b3d9")       
            if(!creatorUser){
                throw new Error("User Does not exists")
            }
            creatorUser.createdEvents.push(event)
           await creatorUser.save()       
            return createdEvent    
        }catch(err){          
            throw err;
        }      
    }   
}