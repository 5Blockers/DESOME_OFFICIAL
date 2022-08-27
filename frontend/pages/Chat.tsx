import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'
import {io} from 'socket.io-client'
import {host} from '../utils/APIUrl'
import { useUserContext } from '../context/UserContext'

export default function Chat() {
  const {token} = useUserContext()
  const socket = useRef(null)
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentChat, setCurrentChat] = useState(undefined)
  
  //checking current user
  useEffect(() => {
    async function checkCurrentUser() {
      // console.log(token)
      if (!token) navigate('/')
      else {
        // const token = await JSON.parse(localStorage.getItem('token'))
        // console.log(token)
        const response = await fetch(`${host}/api/user/current-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        }).then((res) => res.json())
        // console.log(response)
        setCurrentUser(response.data.user)
        
      }
    }
    checkCurrentUser()
  }, [])

  //get contacts
  useEffect(() => {
    async function getContacts() {
        if (currentUser) {
            // const token = await JSON.parse(localStorage.getItem ('token'))
            const response = await fetch(`${host}/api/user/all-chat-users`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
                }
            }).then(res => res.json())          
            setContacts(response.data.chatList)
        }
    }
    getContacts()
}, [currentUser])

  //add online users (socket)
  useEffect(() => {
    
    if (currentUser) {
            socket.current = io(host)
            socket.current.emit('add-user', currentUser._id)
    }
  }, [currentUser])

  //change chat
  const handleChatChange = (chat) => {
    setCurrentChat(chat)
  }

  return (
    <>
        <Container>
        <div className="container">
            <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
            {
                currentChat === undefined ? 
                <Welcome  currentUser={currentUser}/> :
                <ChatContainer currentUser={currentUser} currentChat={currentChat} socket={socket}/>
            }
            
        </div>
        </Container>
    </> 
  )
}

const Container = styled.div`

height: 88vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #222831;
.container {
  border-radius: 10px;
  height: 80vh;
  width: 85vw;
  background-color: #222831;
  display: grid;
  grid-template-columns: 25% 75%;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-columns: 35% 65%;
  }
}
`;
