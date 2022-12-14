import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput';
import {v4 as uuidv4} from 'uuid'
import {host} from '../utils/APIUrl'
import { useUserContext } from '../context/UserContext'


export default function ChatContainer({currentUser, currentChat, socket}) {
    const {token} = useUserContext()
    const [messages, setMessages] = useState([])
    const [arrivalMessages, setArrivalMessages] = useState(null)
    const scrollRef = useRef(null)
    //get messages
    useEffect(() => {
        async function getMessages() {
            if (currentChat) {
                // const token = await JSON.parse(localStorage.getItem ('token'))
                const response = await fetch(`${host}/api/message/get-message`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        to: currentChat._id
                    })
                }).then(res => res.json())
                setMessages(response.data.projectMessages)
            }  
        }
        getMessages()
    }, [currentChat])

    //send message
    const handleSendMsg = async (msg) => {
        // const token = await JSON.parse(localStorage.getItem ('token'))
        const response = await fetch(`${host}/api/message/add-message`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                to: currentChat._id,
                message: msg
            })
        }).then(res => res.json())
        socket.current.emit('send-message', {
            to: currentChat._id,
            from: currentUser._id,
            message: msg
        })
        const msgs = [...messages]
        msgs.push({fromSelf: true, message: msg})
        setMessages(msgs)
    }

    //receive message
    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-receive', (msg) => {
                setArrivalMessages({fromSelf: false, message: msg})
            })
        }
    }, [])
    useEffect(() => {
        arrivalMessages && setMessages((prev) => [...messages, arrivalMessages])
    }, [arrivalMessages])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behaviour: 'smooth'})
    }, [messages])

  return (
    <Container>
        <div className="chat-header">
            <div className="user-details">
                <div className="avatar">
                    <img 
                        src={`${currentChat.avatar}`}
                        alt="avatar"/>
                </div>
                <div className="username">
                    <h3>{currentChat.displayname}</h3>
                </div>
            </div>
        </div>
        <div className="chat-messages">
            {
                messages.map((m) => {
                    return (
                        <div ref={scrollRef} key={uuidv4()}>
                            <div className={`message ${m.fromSelf ? 'sended' : 'received'}`}>
                                <div className="content">
                                    <p>{m.message}</p>
                                </div>
                            </div>
                        </div>
                        
                    )
                })
            }
        </div>
        <ChatInput handleSendMsg={handleSendMsg}/>
    </Container>
  )
}

const Container = styled.div`
border-radius: 10px;
background-color: white;
margin-left: 20px;
display: grid;
grid-template-rows: 10% 80% 10%;
gap: 0.1rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  grid-template-rows: 15% 70% 15%;
}
.chat-header {
  border-bottom: 1px solid #D9D9D9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  
  .user-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    .avatar {
      margin-top: 0.5rem;
      img {
        height: 2rem;
      }
    }
    .username {
      margin-top: 0.5rem;
      h3 {
        color: #323232;
      }
    }
  }
}
.chat-messages {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .message {
    display: flex;
    align-items: center;
    .content {
      max-width: 40%;
      overflow-wrap: break-word;
      padding: 0.01rem 0.5rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      border: 1px solid #323232;
      color: #323232;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        max-width: 70%;
      }
    }
  }
  .sended {
    justify-content: flex-end;
    .content {
      background-color: #D9D9D9;
    }
  }
  .received {
    justify-content: flex-start;
    .content {
      background-color: #ffffff;
    }
  }
}
`;