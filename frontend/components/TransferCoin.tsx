import React from 'react'
import {useFormik, FormikProps} from 'formik'
import * as yup from 'yup'
import { Card, FormControlLabel, CardMedia, Box, CardActionArea, CardContent, Typography, Stack, Avatar, Button, Modal, Divider, IconButton, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { Actor, ActorMethod, ActorSubclass, HttpAgent } from "@dfinity/agent"
import { Principal } from '@dfinity/principal'
import { toast } from 'react-toastify'
import { useUserContext } from '../context/UserContext'


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



interface Props {
    open: boolean;
    handleClose: () => void;
    fetchToken: () => Promise<ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>>>
}
interface FormikValues {
    to: string;
    amount: number;
}
const TransferCoin: React.FC<Props> = (props) => {
    const {open, handleClose, fetchToken} = props
    const {user} = useUserContext()
    const formik : FormikProps<FormikValues> = useFormik({
        initialValues: {
            to: "principal ID",
            amount: 0,
        }, 
        validationSchema: yup.object().shape({
            to: yup.string().required('You must provide Principal ID which received'),
            amount: yup.number().required('You must provide amount of coin')
        }), 
        onSubmit: (values) => {
            const {to, amount} = values;
            (async function transfer() {
                
                const actor = await fetchToken()
                const res = await actor.transferWithPrincipal(Principal.fromText(user.principal), Principal.fromText(to), amount)
                if (res == "Success") {
                    toast.success('Transfer Successfully', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    toast.error('Insufficient amount', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })()
           
            handleClose()
        }
    })
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
                <Typography textAlign='center' variant='h6'>Transfer Coin</Typography>
                <TextField name='to' value={formik.values.to} onChange={formik.handleChange}/>
                <TextField name='amount' value={formik.values.amount} onChange={formik.handleChange} type='number'/>
                <Button type='submit'>Send</Button>
            </Stack>
        </form>
      </Box>
    </Modal>
  )
}

export default TransferCoin