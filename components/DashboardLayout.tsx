"use client";


import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button
} from "@mui/material";


import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import EventNoteIcon from "@mui/icons-material/EventNote";


import Link from "next/link";

import { ReactNode, useEffect, useState } from "react";

import { useRouter } from "next/navigation";





const drawerWidth = 240;





const navItems = [

  {
    label:"Dashboard",
    href:"/dashboard",
    icon:<DashboardIcon/>
  },


  {
    label:"Users",
    href:"/dashboard/users",
    icon:<GroupIcon/>
  },


  {
    label:"Bookings",
    href:"/dashboard/bookings",
    icon:<EventNoteIcon/>
  }

];





interface DashboardLayoutProps {

  children:ReactNode;

  title?:string;

}








type CurrentUser = {

  name:string;

  email:string;

  role:"ADMIN"|"OWNER"|"USER";

};









export default function DashboardLayout({

  children,

  title="Dashboard"

}:DashboardLayoutProps){



  const router = useRouter();


  const [user,setUser]=useState<CurrentUser|null>(null);






  useEffect(()=>{


    const data =
      localStorage.getItem(
        "currentUser"
      );


    if(data){

      setUser(
        JSON.parse(data)
      );

    }


  },[]);







  const logout=()=>{


    localStorage.removeItem(
      "currentUser"
    );


    localStorage.removeItem(
      "selected-role"
    );


    router.push("/");


  };









  return (

    <Box sx={{display:"flex"}}>


      <CssBaseline />




      <AppBar

        position="fixed"

        sx={{
          zIndex:(theme)=>
          theme.zIndex.drawer+1
        }}

      >

        <Toolbar>


          <Typography
            variant="h6"
            sx={{
              flexGrow:1
            }}
          >

            {title}

          </Typography>





          {
            user && (

              <>

                <Typography
                  sx={{
                    mr:2
                  }}
                >

                  {user.name}
                  {" ("}
                  {user.role}
                  {")"}

                </Typography>



                <Button

                  color="inherit"

                  onClick={logout}

                >

                  Logout

                </Button>


              </>

            )
          }




        </Toolbar>


      </AppBar>







      <Drawer

        variant="permanent"

        sx={{

          width:drawerWidth,

          flexShrink:0,


          "& .MuiDrawer-paper":{

            width:drawerWidth,

            boxSizing:"border-box"

          }

        }}

      >


        <Toolbar />



        <Box sx={{overflow:"auto"}}>


          <List>


            {
              navItems.map(item=>(


                <ListItemButton

                  key={item.label}

                  component={Link}

                  href={item.href}

                >


                  <ListItemIcon>

                    {item.icon}

                  </ListItemIcon>


                  <ListItemText

                    primary={item.label}

                  />


                </ListItemButton>


              ))
            }



          </List>



        </Box>



      </Drawer>







      <Box

        component="main"

        sx={{

          flexGrow:1,

          p:3

        }}

      >


        <Toolbar />


        {children}


      </Box>



    </Box>

  );


}