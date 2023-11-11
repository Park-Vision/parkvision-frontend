import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Link} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../actions/authenticationActions";
import { useNavigate } from 'react-router-dom';

const pages = ['Home', 'Contact', 'About'];
const links = ['/', '/contact', '/about'];
const settings = ['Account', 'Cars', 'Reservations'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state) => state.authenticationReducer.isLoggedIn);
  const currentUser = useSelector((state) => state.authenticationReducer.decodedUser);

  const navigate = useNavigate()

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

    const handleLogin = () => {
      navigate('/login');
  }

  const handleLogout = () => {
      dispatch(logout());
      navigate('/');
      handleCloseUserMenu();
  }

  const handleProfile = () => {
    navigate('/profile');
    handleCloseUserMenu();
  }

  const handleReservations = () => {
    navigate('/profile/reservations');
    handleCloseUserMenu();
  }

  const getInitials = () => {
        const result = currentUser.role.charAt(0) + currentUser.sub.charAt(0);
        return result.toUpperCase();
  }


    return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ParkVision
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, index) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Link href={links[index]} style={{ textDecoration: 'none' }}>
                          <Typography textAlign="center">{page}</Typography>
                      </Link>
                  </MenuItem>
              ))}
                {!isLoggedIn ? (
                    <MenuItem onClick={handleCloseNavMenu}>
                        <Link style={{ textDecoration: 'none' }} onClick={handleLogin}>
                            Login
                        </Link>
                    </MenuItem>
                ) : (
                    <MenuItem onClick={handleCloseNavMenu}>
                        <Link style={{ textDecoration: 'none' }} onClick={handleLogout} >
                            Logout
                        </Link>
                    </MenuItem>
                )}


            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ParkVision
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}>
                  <Link href={links[index]} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {page}
                  </Link>
              </Button>
            ))}
              {!isLoggedIn ? (
                  <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: 'white', display: 'block' }}>
                      <Link href={'/login'} style={{ textDecoration: 'none', color: 'inherit' }}>
                          Login
                      </Link>
                  </Button>
              ) : (
                  <Button
                      onClick={handleLogout}
                      sx={{ my: 2, color: 'white', display: 'block' }}>
                      <Link href={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
                          Logout
                      </Link>
                  </Button>
              )}
          </Box>

            {currentUser && (
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt="Remy Sharp">{getInitials()}</Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem onClick={handleProfile}>
                            <Typography textAlign="center">Profile</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleReservations}>
                            <Typography textAlign="center">Reservations</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <Typography textAlign="center">Logout</Typography>
                        </MenuItem>

                    </Menu>
                </Box>
            )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;