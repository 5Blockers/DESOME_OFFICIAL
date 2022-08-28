import React, { useEffect, useState } from "react"
import { styled, alpha } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import AppBar from "@mui/material/AppBar"
import Typography from "@mui/material/Typography"
import InputBase from "@mui/material/InputBase"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Badge from "@mui/material/Badge"
import Toolbar from "@mui/material/Toolbar"
import MenuItem from "@mui/material/MenuItem"
import Menu from "@mui/material/Menu"
import Divider from "@mui/material/Divider"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import ListItemIcon from "@mui/material/ListItemIcon"
import { Button } from "@mui/material"
/// icon
import MarkunreadIcon from "@mui/icons-material/Markunread"
import PublicIcon from "@mui/icons-material/Public"
import HomeIcon from "@mui/icons-material/Home"
import Avatar from "@mui/material/Avatar"
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
///
/// img
// import sang from "../assets/img/avatar/sang.jpg"
import dfinity from "../assets/img/avatar/dfinity.png"
///
/// ic
import { useWallet, useBalance } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"
import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory as tokenIdlFactory } from '../../.dfx/local/canisters/token'
///
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext"
import { host_fe } from "../utils/APIUrl"
import { toast } from "react-toastify"

import TransferCoin from "./TransferCoin"

const iconStyle = {
    color: "#ffffff",
}
const paperPropsAvatar = {
    elevation: 0,
    sx: {
        overflow: "visible",
        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
        mt: 1.5,
        "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
        },
        "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
        },
    },
}
const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: "10px",
    backgroundColor: "#d9d9d9",
    "&:hover": {
        backgroundColor: "#ffffff",
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        color: "#000000",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}))

const Header = () => {
    const { user } = useUserContext()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [wallet] = useWallet()
    const open = Boolean(anchorEl)
    const [assest] = useBalance()
    const [anchorElWallet, setAnchorElWallet] = React.useState<null | HTMLElement>(null);
    const openWallet = Boolean(anchorElWallet);
    const [principalBalance, setPrincipalBalance] = useState<number>()
    const [openTransfer, setOpenTransfer] = useState<boolean>(false)
    const [trigger, setTrigger] = useState<boolean>(false)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElWallet(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorElWallet(null);
    };
    const handleMenu = (type: string) => {
        switch (type) {
            case "payout":
                (async function payout() {
                    const actor = await fetchTokenReused()
                    const res = await actor.payOutWithPrincipal(Principal.fromText(user.principal))
                    if (res == "Payout successfully") {
                        toast.success('Payout successfully', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        setTrigger(true)
                    } else if (res == "Insufficient amount") {
                        toast.error('Insufficient amount', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        setTrigger(true)
                    } else {
                        toast.error('Already claimed', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        setTrigger(true)
                    }
                })()
                break;
            case "transfer": {
                setOpenTransfer(true)
            }
        }
        setAnchorElWallet(null);
    }
    // console.log(wallet)
    function popupAvatar(e: React.MouseEvent<HTMLElement>) {
        setAnchorEl(e.currentTarget)
        // console.log(anchorEl)
    }
    function closePopup() {
        setAnchorEl(null)
    }
    // ========= NFT
    async function fetchTokenReused() {
        const agent = new HttpAgent({ host: host_fe })
        agent.fetchRootKey()
        const tokenActor = await Actor.createActor(tokenIdlFactory, {
            agent,
            canisterId: Principal.fromText("rno2w-sqaaa-aaaaa-aaacq-cai")
        })
        return tokenActor
    }
    async function fetchToken() {
        const agent = new HttpAgent({ host: host_fe })
        agent.fetchRootKey()
        const tokenActor = await Actor.createActor(tokenIdlFactory, {
            agent,
            canisterId: Principal.fromText("rno2w-sqaaa-aaaaa-aaacq-cai")
        })

        if (user) {
            const balance = Number(await tokenActor.balanceOf(Principal.fromText(user?.principal)))
            setPrincipalBalance(balance as number)
        }

    }
    useEffect(() => {
        fetchToken()
        console.log(principalBalance);

        console.log(user);
    }, [user])
    // 




    return (
        <>
            <AppBar
                style={{ backgroundColor: "#393e46", justifyContent: 'center' }}
                className="navbar"
                position="static"
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: "Lobster",
                        }}
                        className="navbar__logo"
                    >
                        <Link to='/'>DeSome</Link>
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon
                                sx={{
                                    color: "#323232",
                                }}
                            />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ "aria-label": "search" }}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box>
                        <IconButton>

                            <Link to='/'><HomeIcon sx={iconStyle} /></Link>
                        </IconButton>
                        <IconButton>
                            <Badge badgeContent={4} color="error">
                                <Link to='/chat'><MarkunreadIcon sx={iconStyle} /></Link>
                            </Badge>
                        </IconButton>
                        <IconButton>
                            <Badge badgeContent={19} color="error">
                                <PublicIcon sx={iconStyle} />
                            </Badge>
                        </IconButton>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box>
                        <Stack direction="row" spacing={2}>
                            {/* {wallet && (
                            <Tooltip title={wallet.principal}>
                                <Chip
                                    sx={{
                                        backgroundColor: "#d9d9d9",
                                    }}
                                    label={`ICP: ${assest ? assest[0].amount : "loading"}`}
                                    avatar={<Avatar alt="ICP" src={dfinity} />}
                                />  
                            </Tooltip>
                        )} */}
                            <Button
                                id="demo-positioned-button"
                                aria-controls={openWallet ? 'demo-positioned-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openWallet ? 'true' : undefined}
                                onClick={handleClick}
                                variant='contained'
                            >
                                OCC coin: {principalBalance}
                            </Button>
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorElWallet}
                                open={openWallet}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <MenuItem onClick={() => handleMenu('payout')}>Payout</MenuItem>
                                <MenuItem onClick={() => handleMenu('transfer')}>Transfer</MenuItem>
                                <MenuItem onClick={handleClose}>Logout</MenuItem>
                            </Menu>

                            <Tooltip title="Account settings">
                                <IconButton sx={{ p: 0 }} onClick={popupAvatar}>
                                    <Avatar alt="Sang" src={user.avatar} id="avt" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClick={closePopup}
                                onClose={closePopup}
                                PaperProps={paperPropsAvatar}
                                transformOrigin={{ horizontal: "right", vertical: "top" }}
                                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                            >
                                <MenuItem>
                                    <Avatar />
                                    <Link to='/profile'>Profile</Link>
                                </MenuItem>
                                <Divider />
                                <MenuItem>
                                    <ListItemIcon>
                                        <ViewModuleOutlinedIcon fontSize="small" />
                                    </ListItemIcon>
                                    {/* Collections */}
                                    <Link to='/collection'>Collections</Link>
                                </MenuItem>
                                <Divider />
                                <MenuItem>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <Divider />
                                <MenuItem>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Stack>
                    </Box>
                </Toolbar>
            </AppBar>
            <TransferCoin fetchToken={fetchTokenReused} open={openTransfer} handleClose={() => setOpenTransfer(false)}/>
        </>
    )
}

export default Header
