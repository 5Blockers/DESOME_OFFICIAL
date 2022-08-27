import { User } from '../assets/data/user'
import { fromArray } from '../utils/utils';

import React, { useState, useEffect } from 'react'
import { Container, Stack, Box, Avatar, Typography, IconButton, Grid, Button } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import { Principal } from '@dfinity/principal';
// import { postList } from '../assets/data/post'
import { sangNFTCollected, sangNFTMinted } from '../assets/data/nft'
import NewFeed from '../components/NewFeed'
import NftCard from '../components/NftCard';
import CollectionsIcon from '@mui/icons-material/Collections';
import { Link } from "react-router-dom";
import NftMint from "../components/NftMint"
import { useUserContext } from '../context/UserContext';
import Loader from '../utils/Loader'
import axios from 'axios';
import { useCanister } from '@connect2ic/react';
const PersonalPage = () => {

    

    const [collection] = useCanister("collection")
    const [nft] = useCanister("nft")
    const [myNfts, setNfts] = useState<any>([]);
    const {user, userPost, token} = useUserContext()
    const [loading, setLoading] = useState<boolean>(true)
    const [nftTab, setNftTab] = useState<string>("collected")
    const [openModalMint, setOpenModalMint] = useState<boolean>(false)
    const handleChange = (event: React.SyntheticEvent<EventTarget>, newValue: string) => {
        setNftTab(newValue);
    };
    useEffect(() => {
       
        console.log(user);
        
        getNfts()
    }, [])

    async function getNfts() {
        setLoading(true)
        const nfts = await collection.getOwnerNFT(Principal.fromText(user.principal))
        console.log(nfts);
        
        setNfts(nfts)
        setLoading(false)

    }
    return (
        <Container maxWidth={false}>
            <Box>
                <Box sx={{
                    maxWidth: '100%',
                    height: '400px'
                }}>
                    <img src={user.background} alt="" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                </Box>
                <Stack direction="row" color="#ffffff" sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
              
                    <Stack direction="row" spacing={2} sx={{
                        position: 'relative',
                        top: '55%'
                    }}>
                        <Avatar src={user.avatar} sx={{ width: 150, height: 150 }} />
                        <Stack color="#ffffff">
                            <Typography variant='h5'>{user.displayname}</Typography>
                            <Typography variant='caption'>{user.tagname}</Typography>
                        </Stack>
                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                    <Stack direction="row" title='info' spacing={3}>
                        <Stack textAlign="center">
                            <Typography variant='h5'>{userPost?.length ? userPost.length : 0}</Typography>
                            <Typography>Posts</Typography>
                        </Stack>
                        <Stack textAlign="center">
                            <Typography variant='h5'>{user.following?.length ? user.following?.length : 0}</Typography>
                            <Typography>Following</Typography>
                        </Stack>
                        <Stack textAlign="center">
                            <Typography variant='h5'>{user.followers?.length ? user.followers.length : 0}</Typography>
                            <Typography>Followers</Typography>
                        </Stack>
                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton onClick={() => setOpenModalMint(true)}>
                        <CollectionsIcon sx={{
                            color: '#ffffff',
                            width: '40px',
                            height: '40px'
                        }} />
                    </IconButton>
                </Stack>
            </Box>
            <Stack direction="row">
                <Box className='post-list' sx={{ width: '50%' }}>
                    {
                        userPost?.map((post) => (
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
                                    <Link to="/collection">View All</Link>
                                </Button>
                            </Stack>
                            <Grid container spacing={2}>
                                {myNfts.map((nft, index) => (
                                    <Grid item xs={6} md={4}>
                                        <NftCard myNft={nft} key={index} type='collected' about='personal'/>
                                    </Grid>
                                ))}
                            </Grid>
                        </TabPanel>
                        <TabPanel value='onsale'>
                            <Stack direction="row">
                                <Box sx={{ flexGrow: 1 }} />
                                <Button>
                                    <Link to="/collection">View All</Link>
                                </Button>
                            </Stack>
                            <Grid container spacing={2}>
                            {myNfts.map((nft, index) => (
                               <Grid item xs={6} md={4}>
                                    <NftCard myNft={nft} key={index} type='onsale' about='personal'/>
                               </Grid>
                            ))}
                            </Grid>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Stack>
            <NftMint open={openModalMint} handleClose={() => setOpenModalMint(false)}/>
        </Container>
    )
}

export default PersonalPage