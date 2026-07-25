"use client";

import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

import axios from "axios";

import { notification } from "antd";

import { useEffect, useState } from "react";

import BookingForm from "../../../components/BookingForm";
import BookingTable from "../../../components/BookingTable";
import DashboardLayout from "../../../components/DashboardLayout";

import {
  createBooking,
  deleteBooking,
  getBookings,
} from "../../../services/bookingService";

import type { Booking } from "../../../types/booking";



type CurrentUser = {

  id:string;

  name:string;

  email:string;

  role:"ADMIN" | "OWNER" | "USER";

};







export default function BookingsPage() {


  const [bookings,setBookings] =
    useState<Booking[]>([]);


  const [loading,setLoading] =
    useState(false);


  const [user,setUser] =
    useState<CurrentUser | null>(null);


  const [error,setError] =
    useState<string | null>(null);







  const loadBookings = async()=>{


    try{


      setLoading(true);

      setError(null);



      const data =
        await getBookings();



      setBookings(data);



    }catch(err){


      const message =
        err instanceof Error
        ? err.message
        : "Failed to load bookings";



      setError(message);



      notification.error({

        title:"Failed to load bookings",

        description:message,

      });



    }finally{


      setLoading(false);


    }


  };









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



    void loadBookings();



  },[]);









  const handleCreate = async(

    values:{
      userId:string;
      startTime:string;
      endTime:string;
    }

  )=>{


    try{


      if(!user){

        return;

      }




      await createBooking({


        userId:user.id,

        startTime:values.startTime,

        endTime:values.endTime,


      });





      notification.success({


        title:"Booking created",


      });





      await loadBookings();





    }catch(err){



      const message =

        axios.isAxiosError(err)

        ?

        (

          err.response?.data?.error

          ??

          err.response?.data?.message

          ??

          err.message

        )

        :

        err instanceof Error

        ?

        err.message

        :

        "Failed to create booking";






      notification.error({


        title:"Failed to create booking",


        description:message,


      });



    }


  };









  const handleDelete = async(id:string)=>{


    try{


      await deleteBooking(id);




      notification.success({


        title:"Booking deleted",


      });




      await loadBookings();




    }catch(err){



      const message =

        err instanceof Error

        ?

        err.message

        :

        "Failed to delete booking";




      notification.error({


        title:"Failed to delete booking",


        description:message,


      });



    }


  };









  if(!user){


    return (

      <DashboardLayout title="Bookings">

        <Alert severity="warning">

          Please login first

        </Alert>


      </DashboardLayout>

    );


  }









  return (


    <DashboardLayout title="Bookings">


      <Stack spacing={3}>


        {
          error && (

            <Alert severity="error">

              {error}

            </Alert>

          )
        }







        <Card>

          <CardContent>


            <BookingForm

              loading={loading}

              onCreate={handleCreate}

            />


          </CardContent>


        </Card>









        <Card>


          <CardContent>



            <Stack

              direction="row"

              spacing={2}

              sx={{mb:2}}

            >



              <Button

                variant="contained"

                onClick={()=>void loadBookings()}

              >

                Refresh


              </Button>



            </Stack>








            <BookingTable


              bookings={bookings}


              loading={loading}


              currentRole={user.role}


              currentUserId={user.id}


              onDelete={handleDelete}



            />





          </CardContent>


        </Card>




      </Stack>



    </DashboardLayout>


  );


}