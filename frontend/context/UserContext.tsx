
import { Post } from "../assets/data/post";
import React, { useContext, createContext, useState, useEffect } from "react";
import {User} from "../assets/data/user"

interface Props {
    children: React.ReactNode;
}

interface UserContext {
    user: User;
    auth: boolean;
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>
    doAuth: () => void;
    noAuth: () => void;
    setAuth: React.Dispatch<React.SetStateAction<boolean>>
    setUser: React.Dispatch<React.SetStateAction<User>>
    userPost: Array<Post>
    setUserPost: React.Dispatch<React.SetStateAction<Post[]>>
}

const UserContext = createContext({} as UserContext)


export function useUserContext() {
    return useContext(UserContext)
}


export const UserContextProvider: React.FC<Props> = ({children}) => {

    const [auth, setAuth] = useState<boolean>(false);
    const [user, setUser] = useState<User>({} as User);
    const [userPost, setUserPost] = useState<Array<Post>>([])
    const [token, setToken] = useState<string>("")
    const doAuth = () => setAuth(true);
    const noAuth = () => setAuth(false)
    return (
        <UserContext.Provider value={{setUserPost, userPost, token, setToken, user, auth, setAuth, doAuth, noAuth, setUser}}>
            {children}
        </UserContext.Provider>
    )
}