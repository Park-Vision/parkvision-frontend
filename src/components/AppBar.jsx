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
import { Link } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authenticationActions";
import { useNavigate } from 'react-router-dom';
import decodeToken from '../utils/decodeToken';
import { getUser } from '../redux/actions/userActions';
import { getParking } from '../redux/actions/parkingActions';
import ManagerNavigation from './ManagerNavigation';

const pages = ['Home', 'Contact', 'About'];
const links = ['/', '/contact', '/about'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state) => state.authenticationReducer.isLoggedIn);
  const currentUser = useSelector((state) => state.authenticationReducer.decodedUser);
  const [initials, setinitials] = React.useState('');
  const userjson = JSON.parse(localStorage.getItem("user"));
  const user = decodeToken(userjson?.token);
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
    handleCloseNavMenu();
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setinitials('');
    handleCloseUserMenu();
    handleCloseNavMenu();
  }

  const handleProfile = () => {
    navigate('/profile');
    handleCloseUserMenu();
  }

  const handleCars = () => {
    navigate('/cars');
    handleCloseUserMenu();
  }

  const handleReservations = () => {
    navigate('/profile/reservations');
    handleCloseUserMenu();
  }

  const getInitials = (userInfo) => {
    if (userInfo.firstName && userInfo.lastName) {
      const result = userInfo.firstName.charAt(0) + userInfo.lastName.charAt(0);
      return result.toUpperCase();
    }
  }

  const handleClick = (path) => {
    navigate(path);
    handleCloseNavMenu();
  }

  const handleAdmin = () => {
    navigate('/admin');
    handleCloseUserMenu();
  }

  React.useEffect(() => {
    if (user) {
      dispatch(getUser(user.userId)).then((response) => {

        setinitials(getInitials(response));
        if (response.role === "PARKING_MANAGER" && response.parkingDTO) {
          dispatch(getParking(response.parkingDTO.id));
        }
      });
    }
  }, [currentUser]);

  const getMenuItems = () => {
    const menuItems = pages.map((page, index) => (
      <MenuItem key={page} onClick={() => handleClick(links[index])}>
        <Link style={{ textDecoration: 'none' }}>
          <Typography textAlign="center">{page}</Typography>
        </Link>
      </MenuItem>
    ));

    if (!isLoggedIn) {
      menuItems.push(
        <MenuItem key={'login'} onClick={handleLogin}>
          <Link style={{ textDecoration: 'none' }}>Login</Link>
        </MenuItem>
      );
    } else {
      menuItems.push(
        <MenuItem key={'logout'} onClick={handleLogout}>
          <Link style={{ textDecoration: 'none' }}>Logout</Link>
        </MenuItem>
      );
    }
    return menuItems;
  };


  const getProfileMenuItems = () => {
    const menuItems = [];
    if (user && (user.role === 'USER' || user.role === 'PARKING_MANAGER')) {
      menuItems.push(
        <MenuItem key={'reservations'} onClick={handleReservations}>
          <Typography textAlign="center">Reservations</Typography>
        </MenuItem>
      );
      menuItems.push(
        <MenuItem key={'profile'} onClick={handleProfile}>
          <Typography textAlign="center">Profile</Typography>
        </MenuItem>
      );
    }
    if (user && user.role === 'USER') {
      menuItems.push(
        <MenuItem key={'cars'} onClick={handleCars}>
          <Typography textAlign="center">Cars</Typography>
        </MenuItem>
      );
    }
    if (user && user.role === 'ADMIN') {
      menuItems.push(
        <MenuItem key={'admin'} onClick={handleAdmin}>
          <Typography textAlign="center">Admin</Typography>
        </MenuItem>
      );
    }
    menuItems.push(
      <MenuItem key={'logout'} onClick={handleLogout}>
        <Typography textAlign="center">Logout</Typography>
      </MenuItem>
    );
    return menuItems;
  }



  return (
    <AppBar position="fixed"
      sx={{
        background: "linear-gradient(to right, #00838f ,#3d8c62)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
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

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} >
            <IconButton
              data-cy={'menu'}
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
              {getMenuItems()}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
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
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} >
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={() => handleClick(links[index])}
                sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link style={{ textDecoration: 'none', color: 'inherit' }}>
                  {page}
                </Link>
              </Button>
            ))}
            {!isLoggedIn ? (
              <Button
                onClick={handleLogin}
                sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link style={{ textDecoration: 'none', color: 'inherit' }}>
                  Login
                </Link>
              </Button>
            ) : (
              <Button
                onClick={handleLogout}
                sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link style={{ textDecoration: 'none', color: 'inherit' }}>
                  Logout
                </Link>
              </Button>
            )}
          </Box>

          {user && user.role === 'PARKING_MANAGER' && (
            <Box sx={{ flexGrow: 0 }}>
              <ManagerNavigation />
            </Box>
          )}

          {currentUser && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Initials">{initials}</Avatar>
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
                {getProfileMenuItems()}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;