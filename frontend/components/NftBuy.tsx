import React from 'react'
import { Box, Typography, Stack, Button, Modal, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material'
interface Props {
    open: boolean;
    onClose: () => void;

}
const NftBuy:React.FC<Props> = (props) => {
    const {open, onClose} = props
  return (
    <div>NftBuy</div>
  )
}

export default NftBuy