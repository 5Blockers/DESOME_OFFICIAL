import React, {useState, useEffect} from 'react'
import { Principal } from '@dfinity/principal'
import { Box, Grid, Typography, Stack, Avatar, Button, Modal, Divider, IconButton, Container } from '@mui/material'
import { sangNFTs, sangNFTCollected } from '../assets/data/nft'
import { User } from '../assets/data/user'
import NftCard from '../components/NftCard'
import { useUserContext } from '../context/UserContext'
import { useCanister } from '@connect2ic/react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
const OtherCollection = () => {
    
    const [collection] = useCanister("collection")
    const {token} = useUserContext()
    const params = useParams()
    const [myNfts, setNfts] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [otherUser, setOtherUser] = useState<User>({} as User)
    
    useEffect(() => {
        axios.get(`http://13.215.51.165:5000/api/user/${params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            const {data} = res.data
            setOtherUser(data.user)
            console.log(data);
            
        })
       
        // console.log(user);
        
        getNfts()
    }, [])

    async function getNfts() {
        setLoading(true)
        const nfts = await collection.getOwnerNFT(Principal.fromText(otherUser.principal))
        console.log(nfts);
        
        setNfts(nfts)
        setLoading(false)

    }
  return (
    <Box
        sx={{
            paddingLeft: '2rem'
        }}
    >
        <Stack direction="row">
            <Typography variant='h5' color='#ffffff'>{otherUser.displayname} Collection</Typography>

        </Stack>
        
        <Grid container spacing={1} mt={2} justifyContent="center" alignItems="center">
            {
                myNfts.map((nft) => (
                    <Grid item xs={3} md={2}>
                        <NftCard myNft={nft} type='onsale' about='personal'/>
                    </Grid>
                ))
            }
        </Grid>
    </Box>
  )
}

export default OtherCollection