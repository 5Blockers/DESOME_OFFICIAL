import React, {useState, useEffect} from 'react'
import { Principal } from '@dfinity/principal'
import { Box, Grid, Typography, Stack, Avatar, Button, Modal, Divider, IconButton, Container } from '@mui/material'
import { sangNFTs, sangNFTCollected } from '../assets/data/nft'
import NftCard from '../components/NftCard'
import { useUserContext } from '../context/UserContext'
import { useCanister } from '@connect2ic/react'

const Collection = () => {
    const {user} = useUserContext()
    const [collection] = useCanister("collection")
    const [myNfts, setNfts] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false)
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
    <Box
        sx={{
            paddingLeft: '2rem'
        }}
    >
        <Stack direction="row">
            <Typography variant='h5' color='#ffffff'>Your Collection</Typography>

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

export default Collection