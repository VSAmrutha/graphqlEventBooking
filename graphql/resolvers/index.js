const bcrypt=require("bcryptjs")
const Event=require("../../models/event")
const User=require("../../models/user")

const events =  eventIds => {
    return Event.find({_id:{$in:eventIds}})
    .then(events=>{
        return events.map(event=>{
         return {
             ...event._doc,
             _id:event.id,
             date:new Date(event._doc.date).toISOString(),
            creator:user.bind(this,event.creator)}
        })
    }).catch(err=>{
        throw err;
    })
   
  };
//manual population function to connect event to users. 
//populate("creator ") is build in method to auto populate the connection
const user=(userId)=>{
    return User.findById(userId)
    .then(user=>{
        console.log("inside userfunction",events.bind(user,user._doc.createdEvents))
      return {
          ...user._doc,
          _id:user.id,
          createdEvents:events.bind(this,user._doc.createdEvents)}  
    })
    .catch(err=>{throw err})
}
module.exports={
    events:()=>{
    //  return events works fine with out extracting from the _doc and toString method
   return Event.find().then(events=>{
       return events.map(event=>{ 
           console.log("user",user.bind(event,event._doc.creator))         
        return {
             ...event._doc,
             _id:event.id,
             date:new Date(event._doc.date).toISOString(),
             creator:user.bind(this,event._doc.creator)}
    })  }).catch(err=>{
        console.log(err)
        throw err;
    })
    },
    createEvent:(args,parent)=>{
       
        const event=new Event({
            title:args.eventInput.title,
            description:args.eventInput.description,
            price:+args.eventInput.price,
            date:new Date(args.eventInput.date),
            creator:"5f9810803fbd7c630811b3d9"
        })
       let createdEvent;
        return event.save()
        .then(result=>{
            createdEvent={...result._doc,creator:user.bind(this,result._doc.creator)}
            return User.findById("5f9810803fbd7c630811b3d9")
            // console.log(result);
            // return {...result._doc}
        })
        .then(user=>{
            if(!user){
                throw new Error("User Does not exists")
            }
            user.createdEvents.push(event)
            return user.save()
        })
        .then(result=>{
            return createdEvent
        })
        .catch(err=>{
            console.log(err)
            throw err;
        });
        
    },
    createUser:(args)=>{
        return User.findOne({email:args.userInput.email})
        .then(user=>{
            if(user){
                throw new Error("User exists")
            }
            return bcrypt.hash(args.userInput.password,12)
        }).then(hashedPassword=>{
            const user=new User({
                email:args.userInput.email,
                password:hashedPassword
            });
           return user.save();
            
        }).then(result=>{
            return {...result._doc,password:null}
        })
        .catch(err=>{throw err})
        
        
    }
}