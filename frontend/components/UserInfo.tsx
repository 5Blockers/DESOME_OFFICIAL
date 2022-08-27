import React from 'react'
import { Stack, Typography, Avatar } from '@mui/material'
interface Props {
    avatar: string;
    displayName: string;
    tagName: string;
}
const UserInfo: React.FC<Props> = (props) => {
    const { avatar, displayName, tagName } = props;
    return (
        <Stack direction="row" spacing={2}>
            <Avatar src={avatar} sx={{ width: 56, height: 56 }} />
            <Stack color="#000000">
                <Typography>{displayName}</Typography>
                <Typography variant='caption'>{tagName}</Typography>
            </Stack>
        </Stack>
    )
}

export default UserInfo