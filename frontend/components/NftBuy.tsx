import React from 'react'
import { Box, Typography, Stack, Button, Modal, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material'

interface Props {
    open: boolean;
    onClose: () => void;
    handleBuy: () => void;
    price: number;
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
const NftBuy:React.FC<Props> = (props) => {
    const {open, onClose, price, handleBuy} = props
  return (
    <Modal open={open} onClose={onClose}>
        <Box sx={style}>
            <Stack spacing={3} textAlign='center'>
                <Typography>Do you wanna buy this for {price}</Typography>
                <Button onClick={handleBuy}>Yes, I do</Button>
            </Stack>
        </Box>
    </Modal>
  )
}

export default NftBuy