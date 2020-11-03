const bcrypt=require("bcryptjs")
const Event=require("../../models/event")
const User=require("../../models/user")

const events =  async eventIds => {
    try{
        const events= await Event.find({_id:{$in:eventIds}});
            return events.map(event=>{
             return {
                 ...event._doc,
                 _id:event.id,
                 date:new Date(event._doc.date).toISOString(),
                creator:user.bind(this,event.creator)
            }
            })
    }
    catch(err){
        throw err;
    }   
  };
//manual population function to connect event to users. 
//populate("creator ") is build in method to auto populate the connection
const user=async (userId)=>{
    try{
    const user=await User.findById(userId)
   
      return {
          ...user._doc,
          _id:user.id,
          createdEvents:events.bind(this,user._doc.createdEvents)}  

      }catch(err){throw err}
}
module.exports={
    events:async()=>{
    //  return events works fine with out extracting from the _doc and toString method
  try{
    const events=await  Event.find()
       return events.map(event=>{ 
        return {
             ...event._doc,
             _id:event.id,
             date:new Date(event._doc.date).toISOString(),
             creator:user.bind(this,event._doc.creator)}
        })
     }catch(err){     
        throw err;
    }
    },
    createEvent:async(args,parent)=>{
       
        const event=new Event({
            title:args.eventInput.title,
            description:args.eventInput.description,
            price:+args.eventInput.price,
            date:new Date(args.eventInput.date),
            creator:"5f9810803fbd7c630811b3d9"
        })
       let createdEvent;
       try{
        const result= await event.save()
       
            createdEvent={...result._doc,creator:user.bind(this,result._doc.creator)}
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
        
    },
    createUser:async (args)=>{
        try{
        const existingUser=await User.findOne({email:args.userInput.email})
            if(existingUser){
                throw new Error("User exists")
            }
            const hashedPassword=await bcrypt.hash(args.userInput.password,12)
            const user=new User({
                email:args.userInput.email,
                password:hashedPassword
            });
           const result=await user.save();
            return {...result._doc,password:null}
    }catch(err){throw err}
        
        
    }
}