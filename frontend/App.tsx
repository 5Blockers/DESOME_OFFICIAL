import React, {useState, useContext, createContext, useMemo, useEffect} from "react"
import logo from "./assets/dfinity.svg"
// routerdom
import {Routes, Route} from 'react-router-dom'
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import { ConnectButton, ConnectDialog, Connect2ICProvider } from "@connect2ic/react"
import "@connect2ic/core/style.css"
/*
 * Import canister definitions like this:
 */
import * as counter from "../.dfx/local/canisters/counter"
import * as collection from "../.dfx/local/canisters/collection"
import * as nft from "../.dfx/local/canisters/nft"
import * as tokenCanister from "../.dfx/local/canisters/token"
/*
 * Some examples to get you started
 */
import { Counter } from "./components/Counter"
import { Transfer } from "./components/Transfer"
import { Profile } from "./components/Profile"
/*
  Import Component
*/
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import PersonalPage from "./pages/PersonalPage"
import AuthGuard from "./hoc/authGuard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import {sang, User} from "./assets/data/user"
import Collection from "./pages/Collection"
import PrivateRoute from "./hoc/PrivateRoute"
// 
import { UserContextProvider, useUserContext } from "./context/UserContext"
import OtherPersonal from "./pages/OtherPersonal"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chat from './pages/Chat'
import OtherCollection from "./pages/OtherCollections"


const App : React.FC = () : JSX.Element => {
  const {user} = useUserContext()

  return (
   <UserContextProvider>
      <div className="App">
        <Header/>
        
       
        <Routes>
          <Route path="/register" element={<Register/>}/> 
          <Route path="/login" element={<Login />}/>
      
          <Route element={<PrivateRoute/>}>
            <Route path="/profile" element={<PersonalPage/>} />
            <Route path="/profile/:id" element={<OtherPersonal/>}/>
          
            {/* <Route /> */}
            <Route path="/collection" element={<Collection/>} />
            <Route path="/" element={<HomePage/>}/>
            <Route path="/chat" element={<Chat />} />
            <Route path="/collection/:id" element={<OtherCollection/>}/>
          </Route>
        
        </Routes>
      </div>
      <ToastContainer />
   </UserContextProvider>
  )
}


















const client = createClient({
  canisters: {
    counter,
    collection,
    nft,
    tokenCanister
  },
  providers: defaultProviders,
  globalProviderConfig: {
    dev: import.meta.env.DEV,
  },
})

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
)
{/* <div className="auth-section">
<ConnectButton />
</div>
<ConnectDialog />

<header className="App-header">
<img src={logo} className="App-logo" alt="logo" />
<p className="slogan">
  React+TypeScript Template
</p>
<p className="twitter">by <a href="https://twitter.com/miamaruq">@miamaruq</a></p>
</header>

<p className="examples-title">
Examples
</p>
<div className="examples">
<Counter />
<Profile />
<Transfer />
</div> */}