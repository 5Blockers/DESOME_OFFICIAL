import React, {useState, useEffect} from 'react'
import { Card, CardMedia, Box, CardActionArea, CardContent, Typography, Stack, Avatar, Button, Modal, Divider, IconButton } from '@mui/material'
import { NFT, NFT_DESOME } from "../assets/data/nft"
import dfinity from "../assets/img/avatar/dfinity.png"
import SubjectIcon from '@mui/icons-material/Subject';
import VerifiedIcon from '@mui/icons-material/Verified';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import {host_py, host} from '../utils/APIUrl';
import axios from 'axios';
import { Co2Sharp } from '@mui/icons-material';
import NftBuy from './NftBuy'
import { Principal } from "@dfinity/principal"
import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory as tokenIdlFactory } from '../../.dfx/local/canisters/token'
import {host_fe} from '../utils/APIUrl'
import { useCanister } from '@connect2ic/react';
import { useUserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
interface Props {
    myNft: NFT_DESOME
    type: 'personal' | 'another'
    open: boolean
    handleClose: () => void;
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: '#222831',
    color: '#ffffff',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: '20px',
    p: 4,
};
const styleBox = {
    backgroundColor: '#ffffff',
    color: '#111111',
    width: '100%',
    borderRadius: '10px',
    padding: '1rem 0rem'
}
// sx={{justifyContent: 'space-between'}}
const NftView: React.FC<Props> = (props) => {
    const {user} = useUserContext()
    const { myNft, open, type, handleClose } = props
    const [openBuy, setOpenBuy] = useState<boolean>(false);
    const [collectionCanister] = useCanister("collection")
    /// tien
   

    async function handleReport() {
        let reportLink = myNft.assest
        let linkList:any = await collectionCanister.getNftLinkList(reportLink);
        console.log(reportLink)
        console.log(linkList)
        let py_data = [{reportLink}, linkList.map((l) => {return{l}})]
        console.log(py_data)
        // let invalidLink = await axios.post(host_py, {
        //     py_data
        // })
        let invalidLink = await fetch(`${host_py}`, {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify({
                py_data
            })
        }).then(res => res.json())
        console.log(invalidLink)
        if (!invalidLink) return "Nothing to compare"
        else {
            let message:any = await collectionCanister.executeCompare(reportLink, invalidLink)
            console.log(message)
            if (message) return "error at compare two link"
            else {
                const {token} = useUserContext()
                let data = message.split(' ')
                console.log(data)
                let response = await fetch(`${host}/report`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        invalidLink: data[1],
                        invalidUserId: data[0],
                        reportCode: 'a6687d1a-d9e4-43e4-8612-f1f5e7f272f6'
                    })
                }).then(res => res.json())
                console.log(response)
            }
        }

    }






    ///


    //// sang

    async function handleBuy() {
        
        const agent = new HttpAgent({
          host: host_fe
        });
        const tokenActor = await Actor.createActor(tokenIdlFactory, {
            agent,
            canisterId: Principal.fromText("wflfh-4yaaa-aaaaa-aaata-cai")
          })
        const result = await tokenActor.transfer(Principal.fromText(myNft.owner), myNft.nftPrice);
        if (result == "Success") {
            const transferResult = await collectionCanister.transfer(Principal.fromText(myNft.principalNFT), Principal.fromText(myNft.owner), Principal.fromText(user.principal));
            // const transferResult = await opend.completePurchase(id, sellerID, CURRENT_USER_ID)
            console.log(transferResult);
            if (transferResult == "Success") {
                toast.success('Purchase successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            }
          }
        
        setOpenBuy(false)
    }


    ///

  

    return (
       <>
         <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Stack>
                    <Stack direction="row" spacing={3}>
                        <img src={myNft?.assest} style={{ width: '362px', height: '362px' }} />
                        <Stack spacing={3} sx={{
                            height: '362px'
                        }}>
                            <Stack direction="row" justifyContent="space-between">
                                <Stack direction="row" sx={{alignItems: 'center'}} spacing={1}>
                                    <Typography variant='h3'>{myNft?.collection}</Typography>
                                    <VerifiedIcon sx={{ color: '#0096FF' }}/>
                                </Stack>
                                <Stack>
                                    <IconButton sx={{color: '#ffffff'}} onClick={handleReport}>
                                        <FlagCircleIcon />
                                    </IconButton>
                                </Stack>
                            </Stack>
                            <Typography variant='h5'>{myNft?.name}</Typography>
                            <Typography>Owned by <span style={{ color: '#0096FF' }}>{myNft?.owner}</span> </Typography>
                            <Box sx={styleBox}>
                                <Stack sx={{padding: '1rem'}}>
                                    <Typography variant='h6'>Current price</Typography>
                                    <Stack direction="row" sx={{ alignItems: 'center' }}>
                                        
                                        {
                                            myNft?.status === 'listed' ? (
                                                <Stack spacing={2}>
                                                   
                                                    <Typography>{myNft?.nftPrice} OCC coin</Typography>
                                                    {
                                                        type === 'another' ? (
                                                            <IconButton onClick={() => setOpenBuy(true)}>
                                                                <ShoppingCartIcon/>
                                                            </IconButton>
                                                        ) : null
                                                    }
                                                </Stack>
                                            )
                                                : <Typography>This NFT is <span style={{ color: 'red' }}>inactive</span>, not for sale</Typography>
                                        }
                                    </Stack>
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction="row" mt={3}>
                    <Box sx={styleBox}>
                        <Stack direction="row" sx={{ alignItems: 'center' }}>
                            <IconButton>
                                <SubjectIcon/>
                            </IconButton>
                            <Typography>Description</Typography>
                        </Stack>       
                        <Divider />
                        <Typography sx={{padding: '1rem'}}>{myNft?.description}</Typography>
                    </Box>           
                    <Box></Box>     
                </Stack>
            </Box>
        </Modal>
        <NftBuy open={openBuy} price={myNft?.nftPrice} onClose={() => setOpenBuy(false)} handleBuy={handleBuy}/>
       </>
    )
}

export default NftView