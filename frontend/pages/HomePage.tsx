import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import formik from "formik"
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json';
//
import { Stack, Box, TextField, InputAdornment, IconButton, Button, Avatar, Typography, Container } from '@mui/material'
// icon
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import SendIcon from '@mui/icons-material/Send';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import StoreIcon from '@mui/icons-material/Store';
import GavelIcon from '@mui/icons-material/Gavel';
// data
import { sang, User } from '../assets/data/user'
// import { postList } from '../assets/data/post';
// componet
import NewFeed from '../components/NewFeed';
import Loader from "../utils/Loader"
import UserInfo from '../components/UserInfo';
import NftMint from "../components/NftMint"
import { useUserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { useCanister } from '@connect2ic/react';

// import { idlFactory as  tokenIdlFactory} from '../../.dfx/local/canisters/nft'


const HomePage: React.FC = () => {

  const { auth, user, token, setUserPost, userPost } = useUserContext()
  
  const [occ] = useCanister("token")
  const [loading, setLoading] = useState<boolean>(true)
  const [openMint, setOpenMint] = useState<boolean>(false)
  const [imgUrl, setImgUrl] = useState<string>("");
  const [userFollow, setUserFollow] = useState<Array<User>>([])
  const [uploadStatusField, setUploadStatusField] = useState<string>("");
  const [trigger, setTrigger] = useState<boolean>(false)

  useEffect(() => {
    // console.log(token);
    // test()
    fetchPost()
    fetchAllUser()
  }, [loading, trigger])

  function fetchAllUser() {
    console.log(token);
    axios.post("http://13.215.51.165:5000/api/user/all-users").then((res) => {
      console.log(res.data.data.user);
      const userList: Array<User> = res.data.data.user.filter((u: User) => u._id !== user._id)
      setUserFollow(userList)
    })

  }
  function fetchPost() {
    axios.get('http://13.215.51.165:5000/api/post/get-posts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      const { data } = res.data
      setUserPost(data.posts)

      setLoading(false)
    })
  }


  const uploadImages = (files) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("upload_preset", "desome")
    axios.post("https://api.cloudinary.com/v1_1/sangtran127/image/upload", formData).then((res) => {
      setImgUrl(res.data.url)
    })
  }

  function handleImg() {
    if (!imgUrl) {
      return undefined
    } else {
      return [{
        link: imgUrl,
        nft: false,
        display: true,
        authorized: "Yes"
      }]
    }
  }

  function handlePost() {
    setLoading(true)
    axios.post('http://13.215.51.165:5000/api/post/create-post', {
      caption: uploadStatusField,
      resources: handleImg()
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {

    }).catch((err) => {

    })
  }

  function handleFollow(user: User, res : string) {
    // alert(userID)
    setTrigger(true)
    if (res) {
      axios.put('http://13.215.51.165:5000/api/user/unfollow', {
        unfollowId: user._id
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res);
      toast("Unfollow successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    })
    } else {
      axios.put('http://13.215.51.165:5000/api/user/follow', {
        followId: user._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        toast("Follow successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      })
    }
   
    setTrigger(false)
   
  }

  return (
    loading ? <Loader /> : (
      <Container maxWidth={false} className='homepage' sx={{
        display: 'flex',
      }}>
        <Stack direction="row" mt={3} spacing={3}>
          <Box className='posting-left'>
            <Box>
              <Stack direction="row" spacing={2}>
                <Avatar src={user.avatar} sx={{ width: 56, height: 56 }} />
                <Stack color="#ffffff">
                  <Typography>{user.displayname}</Typography>
                  <Typography variant='caption'>{user.tagname}</Typography>
                </Stack>
              </Stack>
            </Box>
            <Box
              mt={2}
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '10px 10px 0 0'
              }}>
              <TextField
                onChange={(event) => {
                  setUploadStatusField(event.target.value)
                }}
                id="upload-status"
                label="What's in your mind?"
                // multiline
                rows={5}
                variant='filled'
                sx={{
                  position: 'relative',
                  width: '320px'
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ position: 'absolute', top: '25px', right: '10px' }}>
                      ✍️
                    </InputAdornment>
                  ),
                }}
                multiline
              />
            </Box>
            <Stack direction="row" sx={{ justifyContent: 'space-between', backgroundColor: '#d9d9d9', borderRadius: '0 0 10px 10px' }} >
              <IconButton component="label">
                <input hidden accept="image/*" type="file" onChange={(event) => {
                  uploadImages(event.target.files)
                }} />
                <InsertPhotoIcon />
              </IconButton>
              <Button endIcon={<SendIcon />} onClick={handlePost}>
                Send
              </Button>
            </Stack>
          </Box>
          <Box className='newfeed' sx={{
            maxWidth: '850px',
          }}>
            {
              userPost.map((post) => (
                <NewFeed setLoading={setLoading} key={post._id} currentUser={user} post={post} />
              ))
            }
          </Box>
          <Box mt={2} className='right-side' sx={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            maxHeight: '1000px',
            width: '320px'
          }}>
            <Stack sx={{
              padding: '1rem'
            }}>
              <Stack>
                <Stack direction="row" sx={{ alignItems: 'center' }}>
                  <IconButton>
                    <ViewModuleIcon />
                  </IconButton>
                  <Link to='/collection'><Typography>My Collection</Typography></Link>

                </Stack>
                <Stack direction="row" sx={{ alignItems: 'center' }}>
                  <IconButton>
                    <StoreIcon />
                  </IconButton>
                  <Link to='/collection'><Typography>On Sale</Typography></Link>

                </Stack>
                <Stack direction="row" sx={{ alignItems: 'center', cursor: 'pointer' }} onClick={() => setOpenMint(true)}>
                  <IconButton>
                    <GavelIcon />
                  </IconButton>
                  <Typography >Mint NFT</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }} >
                <Typography>Suggestions</Typography>
                <Typography>View All</Typography>
              </Stack>
              <Stack>
                {
                   userFollow.map((u, index) => {
                    let content = 'follow'
                    let res = u.followers.find((f) => f === user._id)
                    if (res) {
                      content = 'unfollow'
                    }
                    return (<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0rem' }} key={index}>
                      <Link to={`/profile/${u._id}`}><UserInfo avatar={u.avatar} displayName={u.displayname} tagName={u.tagname} /></Link>
                      <Typography color={content === 'follow' ? '#3B9AE1' : "red"} onClick={() => handleFollow(u, res)}>
                        {content}
                      </Typography>
                    </Stack>)
                  })
                }
              </Stack>
            </Stack>
          </Box>
          <NftMint open={openMint} handleClose={() => setOpenMint(false)} />
        </Stack>
      </Container>
    )
  )
}

export default HomePage