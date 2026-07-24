"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import DashboardLayout from "../../../components/DashboardLayout";


type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OWNER" | "USER";
};



export default function DashboardPage() {


  const router = useRouter();


  const [user,setUser] =
    useState<User | null>(null);



  useEffect(()=>{


    const storedUser =
      localStorage.getItem(
        "currentUser"
      );


    if(storedUser){

      setUser(
        JSON.parse(storedUser)
      );

    }


  },[]);






  if(!user){


    return (

      <DashboardLayout>

        <Typography>
          Please login first
        </Typography>

      </DashboardLayout>

    );

  }







  return (

    <DashboardLayout title="Dashboard">


      <Stack spacing={3}>


        <Card>

          <CardContent>


            <Typography variant="h4">

              Welcome, {user.name}

            </Typography>


            <Typography sx={{mt:2}}>

              Email: {user.email}

            </Typography>


            <Typography>

              Role:

              <b className="ml-2">

                {user.role}

              </b>

            </Typography>



          </CardContent>


        </Card>







        {/* ADMIN */}

        {
          user.role === "ADMIN" && (

            <Card>

              <CardContent>


                <Typography variant="h5">

                  Admin Management

                </Typography>


                <Typography sx={{mt:2}}>

                  Admin can:

                </Typography>


                <ul>

                  <li>Create users</li>

                  <li>Delete users</li>

                  <li>Change user roles</li>

                  <li>View all users</li>

                  <li>View all bookings</li>

                  <li>Delete any booking</li>

                </ul>



                <Button

                  variant="contained"

                  onClick={()=>router.push("/users")}

                >

                  Manage Users

                </Button>


              </CardContent>


            </Card>

          )
        }







        {/* OWNER */}

        {
          user.role === "OWNER" && (

            <Card>

              <CardContent>


                <Typography variant="h5">

                  Owner Dashboard

                </Typography>



                <Typography sx={{mt:2}}>

                  Owner can:

                </Typography>



                <ul>

                  <li>Create booking</li>

                  <li>View all bookings</li>

                  <li>Delete any booking</li>

                  <li>View booking summary</li>

                </ul>



                <Button

                  variant="contained"

                  onClick={()=>router.push("/bookings")}

                >

                  View Bookings

                </Button>



              </CardContent>


            </Card>


          )
        }







        {/* USER */}

        {
          user.role === "USER" && (

            <Card>

              <CardContent>


                <Typography variant="h5">

                  User Dashboard

                </Typography>



                <Typography sx={{mt:2}}>

                  User can:

                </Typography>



                <ul>

                  <li>Create booking</li>

                  <li>View all bookings</li>

                  <li>Delete own bookings only</li>

                </ul>



                <Button

                  variant="contained"

                  onClick={()=>router.push("/bookings")}

                >

                  Create Booking

                </Button>



              </CardContent>


            </Card>

          )
        }





      </Stack>


    </DashboardLayout>

  );

}