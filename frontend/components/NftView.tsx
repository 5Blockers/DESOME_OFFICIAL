import React from 'react'
import { Card, CardMedia, Box, CardActionArea, CardContent, Typography, Stack, Avatar, Button, Modal, Divider, IconButton } from '@mui/material'
import { NFT } from "../assets/data/nft"
import dfinity from "../assets/img/avatar/dfinity.png"
import SubjectIcon from '@mui/icons-material/Subject';
import VerifiedIcon from '@mui/icons-material/Verified';
interface Props {
    myNft: NFT
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
    const { myNft, open, type, handleClose } = props
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Stack>
                    <Stack direction="row" spacing={3}>
                        <img src={myNft?.assest} style={{ width: '362px', height: '362px' }} />
                        <Stack spacing={3} sx={{
                            height: '362px'
                        }}>
                            <Stack direction="row" sx={{alignItems: 'center'}} spacing={1}>
                                <Typography variant='h3'>{myNft?.collection}</Typography>
                                <VerifiedIcon sx={{ color: '#0096FF' }}/>
                            </Stack>
                            
                            <Typography variant='h5'>{myNft?.name}</Typography>
                            <Typography>Owned by <span style={{ color: '#0096FF' }}>{myNft?.owner.tagname}</span> </Typography>
                            <Box sx={styleBox}>
                                <Stack sx={{padding: '1rem'}}>
                                    <Typography variant='h6'>Current price</Typography>
                                    <Stack direction="row" sx={{ alignItems: 'center' }}>
                                        <Avatar src={dfinity} />
                                        {
                                            myNft?.onSale ? <Typography>{myNft?.onSale.price} ({Math.floor(myNft?.onSale.price * 6.24)} USD)</Typography>
                                                : <Typography>This NFT is <span style={{ color: 'red' }}>inactive</span>, not for sale</Typography>
                                        }
                                    </Stack>
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction="row" mt={3    }>
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
    )
}

export default NftView