import React, { useState, useEffect, useContext } from 'react'
import {useNavigate } from "react-router-dom";

import { useUserContext } from '../context/UserContext'
import { useWallet } from '@connect2ic/react'
import Loader from '../utils/Loader'
import {sang, User} from "../assets/data/user"

interface Props {
  user: User
}
export default function AuthGuard(ComponentComposed : React.ComponentType<Props>) {
  let navigate = useNavigate()
  const AuthCheck = (props: Props) => {
    const [isAuth, setIsAuth] = useState<boolean>(false) 
    const {auth} = useUserContext()
    useEffect(() => {
      console.log(auth);
      
      if (auth === false) {
        navigate('/login')
      } else {
        setIsAuth(true)
      }
    }, [auth])
    if (isAuth === false) {
      return <Loader />
    } else {
      return <ComponentComposed user={sang} {...props}/>
    }
  }
  return <AuthCheck user={sang}/>
}




