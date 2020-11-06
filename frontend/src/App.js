import React, {useState} from "react"
import './App.css';
import {BrowserRouter,Route,Switch,Redirect} from "react-router-dom"
import AuthPage from "./pages/Auth"
import BookingsPage from "./pages/Bookings"
import EventsPage from "./pages/Events"
import MainNavigation from "./components/Navigation/MainNavigation"
import AuthContext from "./context/auth-context"
function App() {
  const [token,setToken]=useState(null)
  const [userId,setUserId]=useState(null)
  const login=(token, userId,tokenexpiration)=>{
    setToken(token)
    setUserId(userId)
  }
  const logout=()=>{
    setToken(null)
    setUserId(null)
  }
  return (
    <BrowserRouter>
    <>
    <AuthContext.Provider value={{ userId:userId,token:token, login,logout }}>
    <MainNavigation/>
    <main className="main-content">
    <Switch>
   
  
   {token &&<Redirect from ="/" to="/events" exact />}
   {token &&<Redirect from ="/auth" to="/events" exact />}
   {!token && <Route path="/auth" exact component={AuthPage}/>}
   <Route path="/events" exact component={EventsPage}/>
   {token && <Route path="/bookings" exact component={BookingsPage}/>}
   {!token &&<Redirect  to="/auth" exact />}
   </Switch>
    </main>
    </AuthContext.Provider>
    </>
    </BrowserRouter>
  );
}

export default App;
