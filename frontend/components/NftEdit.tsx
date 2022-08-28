import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { Card, FormControlLabel, CardMedia, Box, CardActionArea, CardContent, Typography, Stack, Avatar, Button, Modal, Divider, IconButton, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { useFormik, FormikProps } from 'formik'
import { NFT, NFT_DESOME } from "../assets/data/nft"
import { useCanister } from '@connect2ic/react';
import { Principal } from '@dfinity/principal';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'
interface Props {
  myNft: NFT_DESOME;
  open: boolean;
  handleClose: () => void;
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
interface FormikValue {
  name: string;
  description: string;
  collection: string;
  status: string
  price: number;
  newStartPrice: number
}
const NftEdit: React.FC<Props> = (props) => {
  let nav = useNavigate()
  const { open, handleClose, myNft } = props
  const [collectionCanister] = useCanister("collection")
  const [myCollection, setCollection] = useState<string>('monkey')
  const [checked, setChecked] = useState<boolean>(myNft?.status === 'listed' ? true : false)
  function handleChangeChecked(event: React.ChangeEvent<HTMLInputElement>) {
    setChecked(event.target.checked)
  }
  function handleChange(event: SelectChangeEvent) {
    setCollection(event.target.value as string)
  }
  const formik: FormikProps<FormikValue> = useFormik<FormikValue>({
    initialValues: {
      name: myNft?.name,
      description: myNft?.description,
      collection: myNft?.collection,
      status: myNft?.status,
      price: myNft?.nftPrice,
      newStartPrice: 0
    },
    onSubmit: (values) => {
      const {name, collection, description, price, newStartPrice} = values
    
      
      if (checked == false) {
        updateNFT(name, collection, description, false, 0, newStartPrice)
      } else {
        updateNFT(name, collection, description, true, price, newStartPrice)
      }
      nav('/')
      handleClose()
    }
  })
  async function updateNFT(name, collection, description, onSale : boolean, price : number, newStartPrice:number) {
    const res = await collectionCanister.updateNFT(Principal.fromText(myNft.principalNFT), name, collection, description, onSale, price, newStartPrice);
    if (res == "Update NFT successfully") {
      toast.success("Update NFT successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
        
        
    } else {
      
      toast.error('Error', {
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
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <form onSubmit={formik.handleSubmit}>
          <Typography textAlign='center' variant='h4'>Update NFT</Typography>
          <Stack>
            <Typography>
              Name
            </Typography>
            <TextField name='name' value={formik.values.name} onChange={formik.handleChange}/>
          </Stack>
          <Stack mt={1}>
            <Typography>Description</Typography>
            <TextField name='description' multiline value={formik.values.description} onChange={formik.handleChange}/>
          </Stack>
          <Stack mt={1}>
            <Typography>Collection</Typography>
            <TextField name='collection' value={formik.values.collection} onChange={formik.handleChange}/>
          </Stack>
          <Stack mt={1}>
            <FormControlLabel
              sx={checked ? { color: 'green' } : { color: 'red' }}
              control={<IOSSwitch name='onSale' onChange={handleChangeChecked} sx={{ m: 1 }} defaultChecked={myNft?.status === 'listed' ? true : false} checked={checked} />}
              label={checked ? 'Listed' : 'Inactive'}
            />
          </Stack>
          {
            checked ?
              <Stack>
                <Typography>Price</Typography>
                <TextField name='price' type='number' onChange={formik.handleChange} value={formik.values.price} />
                <Typography>Start new price</Typography>
                <TextField name='newStartPrice' type='number' onChange={formik.handleChange} value={formik.values.newStartPrice} />
              </Stack> : null
          }
          <Stack direction="row" justifyContent="space-between" mt={1}>
            <Button color='error'>Delete</Button>
            <Button variant="contained" type='submit'>Update</Button>
          </Stack>
        </form>
      </Box>

    </Modal>
  )
}

export default NftEdit