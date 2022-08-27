import React, { useState, useEffect } from 'react'
import { Stack, Box, TextField, InputAdornment, IconButton, Button, Avatar, Typography, Container, FormControl } from '@mui/material'
import { ConnectButton, ConnectDialog, Connect2ICProvider, useConnect, useWallet } from "@connect2ic/react"
import { useUserContext } from '../context/UserContext'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik, FormikProps, validateYupSchema } from 'formik';
import * as yup from 'yup';

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

const validationSchema = yup.object().shape({
  displayname: yup
    .string()
    .required('displayname is required'),
  tagname: yup
    .string()
    .min(3, '3 character Min')
    .required('tagname is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('email is required')
});

interface MyValues {
  displayname: string;
  tagname: string;
  email: string;
}



const Login = () => {
  let navigate = useNavigate()
  
  const { setToken, auth, setUser, setAuth } = useUserContext()
  const [wallet] = useWallet()
  const [principal, setPrincipal] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [register, setRegister] = useState<boolean>(false)



  const formik: FormikProps<MyValues> = useFormik<MyValues>({
    initialValues: {
      displayname: '',
      tagname: '',
      email: ''
    }, 
    validationSchema: validationSchema,
    onSubmit: (values) => {
    
      axios.post('http://13.215.51.165:5000/api/user/sign-up', {
        ...values,
        principal
      }).then((res) => {
        console.log(res);
        
      })
    }
  })

  useEffect(() => {
    setLoading(true)
    console.log(wallet);
    if (wallet?.principal) {
      setPrincipal(wallet.principal)
      setLoading(false)
    }

  }, [wallet, principal])

  useEffect(() => {
    console.log(auth);
  }, [auth])

  function handleLogin() {
    axios.post('http://13.215.51.165:5000/api/user/log-in', { principal }).then(res => {
      console.log(res.data);
      if (res.status === 200) {
        setAuth(true)
        const { data } = res.data;
        console.log(data.user);
        setToken(data.token)
        setUser(data.user)
        navigate('/')
      }
    }).catch(() => {
      setRegister(true)
    })
  }

  return (
    <>
      <Box sx={style}>
        <Typography mt={1}>Connect your <span style={{ color: '#2D8EEE' }}>wallet</span>, you need an ICP wallet to use <span style={{ fontFamily: 'lobster', fontSize: '25px' }}>DeSome</span></Typography>
        <Typography mt={2} variant='h4' textAlign='center'>{register ? 'REGISTER' : 'LOGIN'}</Typography>
        <ConnectButton />
        {loading ? 'pending' : principal}
        {loading ? null : <Button onClick={handleLogin}>Go to site</Button>}
        {
          register ?
            <Box>
              <Typography>This account isnt register in <span style={{ fontFamily: 'lobster', fontSize: '25px' }}>DeSome</span> yet, please <span style={{ color: '#2D8EEE' }}>register</span> this Principal</Typography>
              <Stack>
                <form onSubmit={formik.handleSubmit}>
                  <Stack>
                    <Typography>Display Name</Typography>
                    <TextField 
                      id="displayname"
                      name="displayname"
                      onChange={formik.handleChange}
                      value={formik.values.displayname}
                      error={formik.touched.displayname && Boolean(formik.errors.displayname)}
                      helperText={formik.touched.displayname && formik.errors.displayname}
                    />
                  </Stack>
                  <Stack>
                    <Typography>Tag Name</Typography>
                    <TextField 
                      id="tagname"
                      name="tagname"
                      onChange={formik.handleChange}
                      value={formik.values.tagname}
                      error={formik.touched.tagname && Boolean(formik.errors.tagname)}
                      helperText={formik.touched.tagname && formik.errors.tagname}
                    />
                  </Stack>
                  <Stack>
                    <Typography>Email</Typography>
                    <TextField 
                      id="email"
                      name="email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Stack>
                  <Button type='submit'>
                    Register
                  </Button>
                </form>
              </Stack>

            </Box> : null
        }
      </Box>
      <ConnectDialog />
    </>
  )
}

export default Login