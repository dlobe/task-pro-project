import {
    AppBar,
    Toolbar,
    Typography,
    makeStyles,
    Button,
    IconButton,
    Drawer,
    Link,
    MenuItem,
  } from "@material-ui/core";
  import MenuIcon from "@material-ui/icons/Menu";
  import React, { useState, useEffect } from "react";
  import { Link as RouterLink } from "react-router-dom";
  import { getStaticContent } from "./service";
  
  const headersData = [
    {
      label: "Organizations",
      href: "/organizations",
    },
    {
      label: "Contacts",
      href: "/contacts",
    },
    {
      label: "Workstream",
      href: "/workstream",
    },
    {
      label: "Tasks",
      href: "/tasks",
    },
    {
        label: "Meetings",
        href: "/meetings",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ];
  
  const useStyles = makeStyles(() => ({
    header: {
      backgroundColor: "#006699",
      paddingRight: "79px",
      paddingLeft: "118px",
      position: "relative",
      "@media (max-width: 900px)": {
        paddingLeft: 0,
      },
    },
    logo: {
      fontFamily: "Work Sans, sans-serif",
      fontWeight: 600,
      color: "#FFFEFE",
      textAlign: "left",
    },
    menuButton: {
      fontFamily: "Open Sans, sans-serif",
      fontWeight: 700,
      size: "18px",
      marginLeft: "38px",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
    },
    drawerContainer: {
      padding: "20px 30px",
    },
  }));
  
  export default function Navbar() {
    const { header, logo, menuButton, toolbar, drawerContainer } = useStyles();
  
    const [state, setState] = useState({
      mobileView: false,
      drawerOpen: false,
    });
    const [staticcontent,  setStaticContent] = useState(null);
  
    const { mobileView, drawerOpen } = state;
  
    useEffect(() => {
      const setResponsiveness = () => {
        return window.innerWidth < 900
          ? setState((prevState) => ({ ...prevState, mobileView: true }))
          : setState((prevState) => ({ ...prevState, mobileView: false }));
      };
  
      setResponsiveness();
  
      window.addEventListener("resize", () => setResponsiveness());

      const fetchStaticContent = async () => {
        try {
          const { data } = await getStaticContent();
          for(let i=0; i<data.length; i++){
            if(data[i].Id == 'LogoTitleInfo'){
              setStaticContent(data[i]);
            }
          }        
        } catch (ex) {
        } finally {
        }      
  
      };
      fetchStaticContent();

    }, []);
  
    const displayDesktop = () => {
      return (
        <Toolbar className={toolbar}>
          {femmecubatorLogo}
          <div>{getMenuButtons()}</div>
        </Toolbar>
      );
    };
  
    const displayMobile = () => {
      const handleDrawerOpen = () =>
        setState((prevState) => ({ ...prevState, drawerOpen: true }));
      const handleDrawerClose = () =>
        setState((prevState) => ({ ...prevState, drawerOpen: false }));
  
      return (
        <Toolbar>
          <IconButton
            {...{
              edge: "start",
              color: "inherit",
              "aria-label": "menu",
              "aria-haspopup": "true",
              onClick: handleDrawerOpen,
            }}
          >
            <MenuIcon />
          </IconButton>
  
          <Drawer
            {...{
              anchor: "left",
              open: drawerOpen,
              onClose: handleDrawerClose,
            }}
          >
            <div className={drawerContainer}>{getDrawerChoices()}</div>
          </Drawer>
  
          <div>{femmecubatorLogo}</div>
        </Toolbar>
      );
    };
  
    const getDrawerChoices = () => {
      return headersData.map(({ label, href }) => {
        return (
          <Link
            {...{
              component: RouterLink,
              to: href,
              color: "inherit",
              style: { textDecoration: "none" },
              key: label,
            }}
          >
            <MenuItem>{label}</MenuItem>
          </Link>
        );
      });
    };
  
    const femmecubatorLogo = (
      <>
        <img src={(staticcontent !== null) ? staticcontent.Content.logo : ''} alt="Logo" width="90"/>
        <Typography variant="h6" component="h1" className={logo}>
          <Button className="logo-name" 
          {...{
            key: "Neart",
            color: "inherit",
            to: "/",
            component: RouterLink,
          }}
          >
            { (staticcontent !== null) ? staticcontent.Content.websiteName : '' }
          </Button>
        </Typography>
      </>
    );
  
    const getMenuButtons = () => {
      return headersData.map(({ label, href }) => {
        return (
          <Button
            {...{
              key: label,
              color: "inherit",
              to: href,
              component: RouterLink,
              className: menuButton,
            }}
          >
            {label}
          </Button>
        );
      });
    };
  
    return (
      <header>
        <AppBar className={header}>
          {mobileView ? displayMobile() : displayDesktop()}
        </AppBar>
      </header>
    );
  }