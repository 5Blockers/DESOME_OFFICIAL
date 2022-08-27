import React, { useState, useEffect } from 'react'
import { NFT } from "../assets/data/nft"
import { Card, CardMedia, CardActionArea, CardContent, Typography, Stack, Avatar, Button } from '@mui/material'
// icon 
import dfinity from "../assets/img/avatar/dfinity.png"
import NftView from "./NftView"
import NftEdit from "./NftEdit"
import { idlFactory } from '../../.dfx/local/canisters/nft';
// import { idlFactory as  tokenIdlFactory} from '../../.dfx/local/canisters/token'
import {Actor, HttpAgent} from "@dfinity/agent"
import {useCanister} from "@connect2ic/react"
import { Principal } from '@dfinity/principal'
import axios from 'axios'
import { sang } from '../assets/data/user'
import Loader from "../utils/Loader"
import NftTransmit from "./NftTransmit"
import { useUserContext } from '../context/UserContext'
interface Props {
    myNft: any
    type: 'collected' | 'onsale'
    about: 'personal' | 'another'
}

const NftCard: React.FC<Props> = (props) => {
    const localhost = "http://localhost:3000/"
    const agent = new HttpAgent({host: localhost})
    const {user} = useUserContext()
   
    const { myNft, type, about } = props
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [openEdit, setOpenEdit] = useState<boolean>(false)
    const [openTransmit, setOpenTransmit] = useState<boolean>(false)
    const [nftCard, setNftCard] = useState<NFT>()
    const [collection] = useCanister("collection")
    const [nft] = useCanister("nft")


    // async function searchUser() {
    //     axios.post('http://13.215.51.165:5000/api/user/search-user', {
    //         query: 
    //     })
    // }


    let NFTActor;
    agent.fetchRootKey()
    
    async function loadNFT() {
        setLoading(true)
        NFTActor = await Actor.createActor(idlFactory, {
            agent,
            canisterId: myNft
        })
        const name : string = await NFTActor.getName();
        const owner : Principal = await NFTActor.getOwner();
        const assest : string = await NFTActor.getAssest();
        console.log(assest);
        
        const description : string = await NFTActor.getDescription();
        const collection : string = await NFTActor.getCollection()
        const ownerString = owner.toText()
        const principalOfNft : Principal = await NFTActor.getCanisterID()
        const principalNFT : string = principalOfNft.toText()
        const statusNFT : string = await NFTActor.getStatus() 
        const status = (statusNFT === 'active') ? 'listed' : 'inactive'
        let mNFT : NFT = {
            principalNFT,
            owner: sang,
            name,
            assest,
            description,
            collection,
            status
        }
        setNftCard(mNFT)
        console.log(mNFT);
        setLoading(false)
    }

    useEffect(() => {
        // test()
        loadNFT()
    }, [])

    return loading ? <Loader/> : (
        <Card sx={{ maxWidth: 312, borderRadius: '10px' }}>
            <CardActionArea onClick={() => setOpen(true)}>
                <CardMedia
                    component="img"
                    width={212}
                    src={nftCard?.assest}
                />
            </CardActionArea>
            {
                (type === 'collected' && about === 'personal')?
                    <CardContent>
                        <Stack>
                            <Button onClick={() => setOpenTransmit(true)}>Transfer</Button>
                        </Stack>
                    </CardContent>
                    :
                    <CardContent>
                        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                            <Typography variant='h6'>Name</Typography>
                            <Typography variant='h6'>Price</Typography>
                        </Stack>
                        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                            <Typography>{nftCard?.name}</Typography>
                            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Avatar src={dfinity} />
                                <Typography>{nftCard?.onSale ? nftCard.onSale.price : '--'}</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction="row" sx={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Stack>
                                <Typography variant='h6'>Status</Typography>
                                <Typography sx={nftCard?.status === 'listed' ? { color: 'green' } : { color: 'red' }}>{nftCard?.status}</Typography>
                            </Stack>
                            {
                                (about === 'personal') ?
                                    <Button onClick={() => setOpenEdit(true)}>Edit</Button>
                                : null
                            }
                          
                        </Stack>
                    </CardContent>
            }

            
            <NftView myNft={nftCard} type='personal' open={open} handleClose={() => setOpen(false)} />
            {
                (about === 'personal') ?
                    <NftEdit myNft={nftCard} open={openEdit} handleClose={() => setOpenEdit(false)} />
                    : null
            }
            <NftTransmit ownerNFT={user.principal} assestNFT={nftCard?.assest} open={openTransmit} handleClose={() => setOpenTransmit(false)} principalNFT={nftCard?.principalNFT}/>
        </Card>
    )
}

export default NftCard