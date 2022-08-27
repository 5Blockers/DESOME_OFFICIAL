import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

export default function Contacts({contacts, currentUser, changeChat}) {
    const [currentUserName, setCurrentUserName] = useState(undefined)
    const [currentUserImage, setCurrentUserImage] = useState(undefined)
    const [currentSelected, setCurrentSelected] = useState(undefined)
    
    useEffect(() => {
        if (currentUser) {
            setCurrentUserImage(currentUser.avatar)
            setCurrentUserName(currentUser.displayname)
        }
    }, [currentUser])
    
    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index)
        changeChat(contact)
    }

    return (
    <>
            {
                currentUserImage && currentUserName && (
                    <Container>
                        <div className="brand">
                            <img src='' alt="logo" />
                            <h3>Desome</h3>
                        </div>
                        <div className="contacts">
                            {
                                contacts.map((contact, index) => {
                                    return (
                                        <div 
                                        className={`contact ${index === currentSelected ? 'selected' : ''}`} key={index}
                                        onClick={() => changeCurrentChat(index, contact)}
                                        >
                                            <div className="avatar">
                                                <img src={contact?.avatar} alt="contact avatar"/>
                                            </div>
                                            <div className="username">
                                                <h3>{contact?.displayname}</h3>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="current-user">
                            <div className="avatar">
                                <img src={currentUserImage}
                                alt="avatar"/>
                            </div>
                            <div className="username">
                                <h2>{currentUserName}</h2>
                            </div>
                        </div>
                    </Container>
                )
            }
        </>
  )
}

const Container = styled.div`
  margin-right: 5px;
  border-radius: 10px;
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #ffffff;
  .brand {
    border-bottom: 1px solid #D9D9D9;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 2rem;
    }
    h3 {
      color: #323232;
      text-transform: uppercase;
    }
  }
  .contacts {
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 10px;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: #323232;
        }
      }
    }
    .selected {
      background-color: #D3D3D3;
    }
  }
  .current-user {
    
    border-top: 1px solid #D9D9D9;
    background-color: #ffffff;
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 2rem;
    .avatar {
      margin-left: 20px;
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: #323232;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`