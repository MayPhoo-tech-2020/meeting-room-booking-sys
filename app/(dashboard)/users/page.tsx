"use client";

import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

import { notification } from "antd";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import DashboardLayout from "../../../components/DashboardLayout";
import UserForm from "../../../components/UserForm";
import UserTable from "../../../components/UserTable";

import {
  createUser,
  deleteUser,
  getUsers,
  updateUserRole,
} from "../../../services/userService";

import type { User } from "../../../types/user";



type CurrentUser = {

  id:string;

  name:string;

  email:string;

  role:"ADMIN"|"OWNER"|"USER";

};







export default function UsersPage(){


  const router = useRouter();



  const [users,setUsers] =
    useState<User[]>([]);



  const [loading,setLoading] =
    useState(false);



  const [currentUser,setCurrentUser] =
    useState<CurrentUser | null>(null);



  const [error,setError] =
    useState<string | null>(null);








  const showError = (
    action:string,
    err:any
  )=>{


    if(
      err?.response?.data?.error
    ){

      const backendError =
        err.response.data.error;



      notification.error({

        title:action,

        description:
          backendError,

      });


      return;

    }



    notification.error({

      title:action,

      description:
        "Something went wrong. Please try again.",

    });


  };








  const loadUsers = async()=>{


    try{


      setLoading(true);

      setError(null);



      const data =
        await getUsers();



      setUsers(data);



    }catch(err){



      setError(
        "Unable to load users"
      );



      showError(
        "Failed to load users",
        err
      );



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


      const user =
        JSON.parse(storedUser);



      setCurrentUser(user);



      if(
        user.role !== "ADMIN"
      ){

        router.push(
          "/dashboard"
        );

        return;

      }


    }



    void loadUsers();



  },[]);









  const handleCreate = async(
    values:{
      name:string;
      email:string;
      role:string;
    }
  )=>{


    try{


      await createUser({

        name:
          values.name,

        email:
          values.email,

        role:
          values.role as User["role"],

      });




      notification.success({

        title:"User created",

      });



      await loadUsers();



    }catch(err){



      showError(
        "Failed to create user",
        err
      );


    }


  };









  const handleDelete = async(
    id:string
  )=>{


    try{


      await deleteUser(id);



      notification.success({

        title:"User deleted",

      });



      await loadUsers();




    }catch(err){


      showError(
        "Failed to delete user",
        err
      );


    }


  };









  const handleRoleChange = async(
    id:string,
    nextRole:User["role"]
  )=>{


    try{


      await updateUserRole(

        id,

        nextRole

      );




      notification.success({

        title:"Role updated",

      });



      await loadUsers();




    }catch(err){



      showError(

        "Failed to update role",

        err

      );


    }


  };









  if(!currentUser){


    return (

      <DashboardLayout title="Users">


        <Alert severity="warning">

          Checking permission...

        </Alert>


      </DashboardLayout>

    );


  }









  return (


    <DashboardLayout title="Users">


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


            <UserForm

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

              sx={{
                mb:2
              }}

            >



              <Button

                variant="contained"

                onClick={()=>
                  void loadUsers()
                }

              >

                Refresh


              </Button>



            </Stack>








            <UserTable


              users={users}


              loading={loading}


              currentRole={
                currentUser.role
              }


              onDelete={
                handleDelete
              }


              onRoleChange={
                handleRoleChange
              }


            />



          </CardContent>


        </Card>





      </Stack>


    </DashboardLayout>


  );


}