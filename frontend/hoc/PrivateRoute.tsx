import { useUserContext } from '../context/UserContext'
import React, {useEffect, useState} from 'react'
import { Navigate, Outlet } from 'react-router-dom'
const PrivateRoute = () => {
    const {auth, user} = useUserContext()
    const [isAuth, setIsAuth] = useState<boolean>(auth)
    
    useEffect(() => {
        setIsAuth(auth)
        console.log(isAuth);
    }, [auth, user])
  return (
    isAuth ? <Outlet /> : <Navigate to='/login'/>
  )
}

export default PrivateRoute