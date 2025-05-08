import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, IconButton, List, ListItem, ListItemText, Divider, Toolbar, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';

const drawerWidth = 240;

function MobileMenuDrawer({ isMobile, WRODPRESS_URL }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem
          component="a"
          href={WRODPRESS_URL}
          onClick={handleDrawerClose}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            }
          }}
        >
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
        <ListItem
          component="a"
          href={WRODPRESS_URL}
          onClick={handleDrawerClose}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            }
          }}
        >
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Blog" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className="menu-icon">
      <IconButton aria-label="open drawer" edge="start" onClick={handleDrawerToggle} >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </div>
  );
}

MobileMenuDrawer.propTypes = {
  WRODPRESS_URL: PropTypes.string.isRequired,
};

export default MobileMenuDrawer;
