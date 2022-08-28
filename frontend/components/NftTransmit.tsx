import React from 'react'
import { useFormik, FormikProps } from 'formik'
import { TextField, Modal, Box, Typography, Button, CardMedia, Stack, tooltipClasses } from '@mui/material'
import { Principal } from '@dfinity/principal'
import { toast } from 'react-toastify';
import * as yup from 'yup'
import { useCanister } from '@connect2ic/react';
import {useNavigate} from 'react-router-dom'
interface Props {
    open: boolean;
    handleClose: () => void;
    principalNFT: string
    assestNFT: string
    ownerNFT: string
}
interface FormikType {
    toPrincipal: string;
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: '#ffffff',
    color: '#000000',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: '20px',
    p: 4,
};
const NftTransmit: React.FC<Props> = (props) => {
    const {open, handleClose, principalNFT, assestNFT, ownerNFT} = props
    const [collection] = useCanister("collection")
    const formik : FormikProps<FormikType> = useFormik<FormikType>({
        initialValues: {
            toPrincipal: ""
        }, validationSchema: yup.object().shape({
            toPrincipal: yup.string().required('This field is required')
        }),
        onSubmit: (values) => {
            const {toPrincipal} = values
            transmitNFT(toPrincipal)
            
        }
    })
    async function transmitNFT(to: string) {
        const result = await collection.transfer(Principal.fromText(principalNFT), Principal.fromText(ownerNFT), Principal.fromText(to))
        if (result == "Success") {
            toast.success("Transmit successfully", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        } else {
            toast.error(result as string, {
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
            <Typography variant='h6' textAlign='center'>Transfer NFT</Typography>
            <Typography></Typography>
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={1}>
                   <Stack sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Box width={212} height={212} textAlign="center" >
                            <CardMedia component="img"
                                width={212}
                                src={assestNFT}
                                />
                        </Box>
                   </Stack>
                    <Typography>Address <span style={{color: 'red'}}>*</span>required field</Typography>
                    <TextField name='toPrincipal' onChange={formik.handleChange} value={formik.values.toPrincipal}/>
                    <Button type='submit'>Transfer</Button>
                </Stack>
            </form>
        </Box>
    </Modal>
  )
}

export default NftTransmit