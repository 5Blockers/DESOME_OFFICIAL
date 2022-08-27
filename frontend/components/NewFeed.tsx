import React, { useState, useEffect } from 'react'
import Loader from '../utils/Loader'
import axios from 'axios'
import { Post } from "../assets/data/post"
import { User } from "../assets/data/user"
import { Stack, Box, Typography, Divider, IconButton, Collapse, Badge, TextField, InputAdornment, Avatar } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import Comment from '../assets/icons/Comment.svg';
import Share from "../assets/icons/Share.svg"

// component
import UserInfo from "./UserInfo"
import { useUserContext } from '../context/UserContext';
import { toast } from 'react-toastify'

interface Props {
    post: Post
    currentUser?: User
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>
}

const NewFeed: React.FC<Props> = (props) => {
    const { currentUser, post, setLoading} = props
    const [cmt, setCmt] = useState<string>("")
    
    const { token } = useUserContext()
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    function submitComment() {
        setLoading(true)
        axios.put('http://13.215.51.165:5000/api/post/comment', {
            postId: post._id,
            text: cmt
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            toast.success('comment successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            setLoading(false)
        }).catch((err) => {

        })
    }
    function handleLike() {
        setLoading(true)
        axios.put('http://13.215.51.165:5000/api/post/like', {
            postId: post._id,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            setLoading(false)
            
            
        }).catch((err) => {

        })
    }
    return (
            <>
                < Box mt={2} sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    padding: '1rem',
                }
                }>
                    <UserInfo avatar={post.postedBy.avatar} displayName={post.postedBy.displayname} tagName={post.postedBy.tagname} />
                    <Box mt={1}>
                        <Typography paragraph>{post.caption}</Typography>
                        {
                            (post.resources.length > 0 || post.resources != null) && <Box sx={{ textAlign: 'center' }}> {post.resources.map((img, index) => <img src={`${img.link}?w=164&h=164&fit=crop&auto=format`} key={index} loading="lazy" />)} </Box>
                        }
                    </Box>
                    <Stack direction="row">
                        <IconButton onClick={handleLike}>
                            <Badge badgeContent={post.likes?.length}>
                                <FavoriteBorderIcon sx={{ fontSize: 40 }} style={{color: 'red'}}/>
                            </Badge>
                        </IconButton>
                        <IconButton onClick={handleClick}>
                            <Badge badgeContent={post.comments.length} color='primary'><img src={Comment} alt="logo" /></Badge>
                        </IconButton>
                        <IconButton>
                            <img src={Share} alt="logo" />
                        </IconButton>
                    </Stack>
                    <Divider variant='middle' />
                    <Box className='comment' mt={1}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            {post.comments?.map((cmt) => (
                                <Box sx={{ marginLeft: '1.5rem' }} key={cmt._id}>
                                    <UserInfo avatar={cmt.postedBy.avatar} displayName={cmt.postedBy.displayname} tagName={cmt.postedBy.tagname} />
                                    <Typography paragraph variant='caption'>{cmt.text}</Typography>
                                </Box>
                            ))}
                        </Collapse>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={currentUser.avatar} sx={{ width: 34, height: 34 }} />
                        <TextField sx={{ width: '100%', margin: '0 1rem' }} label="Add a comment..." variant='standard' onChange={(e) => setCmt(e.target.value)} />
                        <IconButton onClick={submitComment}>
                            <SendIcon />
                        </IconButton>
                    </Box>

                </Box>
            </>
        )
}

export default NewFeed