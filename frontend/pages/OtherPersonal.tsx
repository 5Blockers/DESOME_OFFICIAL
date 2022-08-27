import { useUserContext } from '../context/UserContext';
import { User } from '../assets/data/user';
import { Post } from '../assets/data/post';
import axios from 'axios'
import React, {useState, useEffect} from 'react'
import Loader from '../utils/Loader';
import { useParams } from 'react-router-dom';
import { Container, Stack, Box, Avatar, Typography, IconButton, Grid, Button } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import { sangNFTCollected, sangNFTMinted } from '../assets/data/nft'
import NewFeed from '../components/NewFeed'
import NftCard from '../components/NftCard';
import CollectionsIcon from '@mui/icons-material/Collections';
import { Link } from "react-router-dom";
import NftMint from "../components/NftMint"
const OtherPersonal = () => {
    let params = useParams()
    const {token, user} = useUserContext()
    const [nftTab, setNftTab] = useState<string>("collected")
    const [loading, setLoading] = useState<boolean>(true)
    const [person, setPerson] = useState<User>({} as User)
    const [posts, setPosts] = useState<Array<Post>>()
    const handleChange = (event: React.SyntheticEvent<EventTarget>, newValue: string) => {
        setNftTab(newValue);
    };
    function getUser() {
        axios.get(`http://13.215.51.165:5000/api/user/${params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data.data);
            setPerson(res.data.data.user)
            setPosts(res.data.data.posts)
            setLoading(false)
        }).catch(err => {
            console.log(err);
            
        }) 
    }
    useEffect(() => {
        getUser()
    }, [])
  return loading ? <Loader/> : (
    <Container maxWidth={false}>
            <Box>
                <Box sx={{
                    maxWidth: '100%',
                    height: '400px'
                }}>
                    <img src={person.background} alt="" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                </Box>
                <Stack direction="row" color="#ffffff" sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
              
                    <Stack direction="row" spacing={2} sx={{
                        position: 'relative',
                        top: '55%'
                    }}>
                        <Avatar src={person.avatar} sx={{ width: 150, height: 150 }} />
                        <Stack color="#ffffff">
                            <Typography variant='h5'>{person.displayname}</Typography>
                            <Typography variant='caption'>{person.tagname}</Typography>
                        </Stack>
                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                    <Stack direction="row" title='info' spacing={3}>
                        <Stack textAlign="center">
                            <Typography variant='h5'>{posts?.length ? posts.length : 0}</Typography>
                            <Typography>Posts</Typography>
                        </Stack>
                        <Stack textAlign="center">
                            <Typography variant='h5'>{person.following?.length ? person.following?.length : 0}</Typography>
                            <Typography>Following</Typography>
                        </Stack>
                        <Stack textAlign="center">
                            <Typography variant='h5'>{person.followers?.length ? person.followers.length : 0}</Typography>
                            <Typography>Followers</Typography>
                        </Stack>
                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                </Stack>
            </Box>
            <Stack direction="row">
                <Box className='post-list' sx={{ width: '50%' }}>
                    {
                        posts?.map((post) => (
                            <NewFeed currentUser={user} post={post} />
                        ))
                    }
                </Box>
                <Box className='collection' sx={{ width: '50%'}}>
                    <TabContext value={nftTab}>                 
                        <Box>
                            <TabList onChange={handleChange} variant="fullWidth">   
                                <Tab label="Collected" value="collected" />
                                <Tab label="On Sale" value="onsale" iconPosition='end' />
                            </TabList>
                        </Box>
                        <TabPanel value='collected'>
                            <Stack direction="row">
                            <Box sx={{ flexGrow: 1 }} />
                                <Button>
                                    <Link to={`/collection/${person._id}`}>View All</Link>
                                </Button>
                            </Stack>
                            <Grid container spacing={2}>
                                {sangNFTCollected.map((nft, index) => (
                                    <Grid item xs={6} md={4}>
                                        <NftCard myNft={nft} key={index} type='collected' about='another'/>
                                    </Grid>
                                ))}
                            </Grid>
                        </TabPanel>
                        <TabPanel value='onsale'>
                            <Stack direction="row">
                                <Box sx={{ flexGrow: 1 }} />
                                <Button>
                                <Link to={`/collection/${person._id}`}>View All</Link>
                                </Button>
                            </Stack>
                            <Grid container spacing={2}>
                            {sangNFTMinted.map((nft, index) => (
                               <Grid item xs={6} md={4}>
                                    <NftCard myNft={nft} key={index} type='onsale' about='another'/>
                               </Grid>
                            ))}
                            </Grid>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Stack>
            
        </Container>
  )
}

export default OtherPersonal