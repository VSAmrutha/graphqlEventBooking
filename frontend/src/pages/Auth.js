import React, {useRef,useState,useContext} from 'react'
import "./Auth.css"
import AuthContext from "../context/auth-context" 
function Auth() {
    const [isLogin,setIsLogin]=useState(true)
    const inputEmail = useRef(null);
    const inputPass = useRef(null);
    const value=useContext(AuthContext)
   
    const submitHandler=(e)=>{
        e.preventDefault();
        const email=inputEmail.current.value
        const password=inputPass.current.value
        if(email.trim().length===0 || password.trim().length===0){
            return;
        }
        let requestBody={
            query:`
            query login($email:String!,$password:String!){
                login(email:$email,password:$password){
                    userId
                    token
                    tokenExpiration
                }
            }`,
            variables:{
                email:email,
                password:password
            }
        }
        if(!isLogin){
             requestBody={
                query:`
                    mutation CreateUser($email:String!,$password:String!){
                        createUser(userInput:{email:$email,password:$password}){
                            _id
                            email
                        }
                    }
                `,
                 variables:{
                email:email,
                password:password
            }
            }
        }
        
        fetch("http://localhost:8000/graphql",{
            method:'POST',
            body:JSON.stringify(requestBody),
            headers:{
                "Content-Type":"application/json"
            }
        }).then(res=>{
            if(res.status!==200 && res.status!==201){
                throw new Error("Failer")
               
            }
            return res.json()
        })
        .then(resData=>{
            
            value.login(resData.data.login.token,resData.data.login.userId,resData.data.login.tokenExpiration)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const switchModehandler=()=>{
        setIsLogin(prevState=>!prevState)
    }
    
    return (
        <form className="auth-form" onSubmit={submitHandler}>
            <div className="form-control">
                <label htmlFor="email">Email</label>
                <input ref= {inputEmail} type="email" id="email"/>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input ref= {inputPass} type="password" id="password"/>
            </div>
            <div className="form-actions">
                
                <button type="submit" >Submit</button>
                <button type="button" onClick={switchModehandler}>Switch to {isLogin?"Signup":"Login"}</button>
            </div>
        </form>
    )
}

export default Auth
