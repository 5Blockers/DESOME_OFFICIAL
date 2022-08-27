import React, {useState} from 'react'
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { Card,FormControlLabel, CardMedia, Box, CardActionArea, CardContent, Typography, Stack, Avatar, Button, Modal, Divider, IconButton, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { useFormik, FormikProps } from 'formik'
import {NFT} from "../assets/data/nft"
interface Props {
    myNft: NFT;
    open: boolean;
    handleClose: () => void;
}

interface FormikValue {
  name: string;
  description: string;
  collection: string
}

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));
  
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: '#ffffff',
    // color: '#ffffff',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: '20px',
    p: 4,
};
const NftEdit:React.FC<Props> = (props) => {
    const formik = useFormik
    const {open, handleClose, myNft} = props
    const [collection, setCollection] = useState<string>('monkey')
    const [checked, setChecked] = useState<boolean>(myNft?.onSale?.price ? true : false)
    function handleChangeChecked(event: React.ChangeEvent<HTMLInputElement>) {
        setChecked(event.target.checked)
    }
    function handleChange(event: SelectChangeEvent) {
        setCollection(event.target.value as string)
    }
  return (
    <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
            <Typography textAlign='center' variant='h4'>Update NFT</Typography>
           <Stack>
                <Typography>
                    Name
                </Typography>
                <TextField value={myNft?.name}/>
           </Stack>
           <Stack mt={1}>
                <Typography>Description</Typography>
                <TextField multiline value={myNft?.description}/>
           </Stack>
           <Stack mt={1}>
                <Typography>Collection</Typography>
                <Select defaultValue={myNft?.collection} value={collection} onChange={handleChange}>
                    <MenuItem value="monkey">Monkey</MenuItem>
                    <MenuItem value="foxy">Foxy</MenuItem>
                </Select>
           </Stack>
           <Stack mt={1}>
                <FormControlLabel
                sx={checked ? {color: 'green'} : {color: 'red'}}
                control={<IOSSwitch onChange={handleChangeChecked} sx={{ m: 1 }} defaultChecked={myNft?.onSale?.price ? true : false} checked={checked}/>}
                label={checked ? 'On Sale' : 'Inactive'}
                />
           </Stack>
           {
            checked ?
             <Stack>
                <Typography>Price</Typography>
                <TextField type='number' value={myNft?.onSale?.price}/>
            </Stack> : null
           }
            <Stack direction="row" justifyContent="space-between" mt={1}>
                <Button color='error'>Delete</Button>
                <Button variant="contained">Update</Button>
            </Stack>
        </Box>
          
    </Modal>
  )
}

export default NftEdit