import React, { useState } from 'react'
import { Box, Typography, Stack, Button, Modal, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import { useFormik, FormikProps } from 'formik'
import * as yup from 'yup'
import { useCanister } from '@connect2ic/react'
import axios from 'axios'
import { toast } from 'react-toastify';
// icon 


interface Props {
    open: boolean;
    handleClose: () => void;
}
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


interface FormikNftValue {
    name: string;
    description: string;
    collection: string;
    collectionSelect: string;
}

const NftMint: React.FC<Props> = (props) => {

    const { open, handleClose } = props
    const [collection] = useCanister("collection")
    const [img, setImg] = useState<string>("");
    const [addCollection, setAddCollection] = useState<boolean>(false);
    const formik: FormikProps<FormikNftValue> = useFormik<FormikNftValue>({
        initialValues: {
            name: "",
            description: "",
            collection: "",
            collectionSelect: ""
        },
        validationSchema: yup.object().shape({
            name: yup.string().required(),
            description: yup.string().required(),
            collection: yup.string(),
            collectionSelect: yup.string()
        })
        ,
        onSubmit: (values) => {
            const { name, description, collection, collectionSelect } = values
            const finalCollection = collection ? collection : collectionSelect
            mintNft(name, description, finalCollection, img);
            handleClose()
        }
    })


    const uploadImages = (files) => {
        const formData = new FormData()
        formData.append("file", files[0])
        formData.append("upload_preset", "desome")
        axios.post("https://api.cloudinary.com/v1_1/sangtran127/image/upload", formData).then((res) => {
            setImg(res.data.url)
        })
    }

    async function mintNft(name, description, collectionNft, img) {
        const result = await collection.mint(name, img, collectionNft, description)
        toast.success('NFT mint successfully', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <form onSubmit={formik.handleSubmit}>
                    <Typography textAlign='center' variant='h5'>Mint NFT</Typography>
                    <Stack>
                        <Stack>
                            <Typography>Image, Video <span style={{ color: 'red' }}>*</span><span style={{ color: '#BDBDD7' }}>required fields</span></Typography>
                            <Stack direction='row'>
                                <Button style={{
                                    borderRadius: '10px',
                                    padding: '5rem',
                                    backgroundColor: '#D9D9D9',
                                    color: '#111111'
                                }} component='label'>
                                    <input hidden accept="image/*" type="file" onChange={(event) => {
                                        uploadImages(event.target.files)
                                    }} />
                                    <CropOriginalIcon fontSize='large' />
                                </Button>
                            </Stack>


                        </Stack>
                        <Stack mt={2}>
                            <Typography>Name <span style={{ color: 'red' }}>*</span><span style={{ color: '#BDBDD7' }}>required fields</span></Typography>
                            <TextField
                                name='name'
                                onChange={formik.handleChange}
                                value={formik.values.name}
                            />
                        </Stack>
                        <Stack mt={2}>
                            <Typography>Description <span style={{ color: 'red' }}>*</span><span style={{ color: '#BDBDD7' }}>required fields</span></Typography>
                            <TextField multiline name='description' onChange={formik.handleChange} value={formik.values.description} />
                        </Stack>
                        <Stack mt={2}>
                            <Typography>Collection</Typography>
                            {
                                addCollection ?
                                    <TextField placeholder='New collection name' name='collection' value={formik.values.collection} onChange={formik.handleChange} />
                                    : <Select name="collectionSelect" onChange={formik.handleChange} value={formik.values.collectionSelect}>
                                        <MenuItem value="monkey">Monkey</MenuItem>
                                        <MenuItem value="foxy">Foxy</MenuItem>
                                    </Select>
                            }

                            <Stack direction="row" mt={1}>
                                <Box sx={{ flexGrow: '1' }}></Box>
                                <Button variant='outlined' color={addCollection ? 'error' : 'primary'} onClick={() => setAddCollection(!addCollection)}>{addCollection ? 'x' : '+'}</Button>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction="row" justifyContent='flex-end' mt={2}>
                        <Button variant='contained' type='submit'>Mint Now</Button>
                    </Stack>
                </form>
            </Box>
        </Modal>
    )
}

export default NftMint