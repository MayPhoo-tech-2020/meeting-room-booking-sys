"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getUsers } from "../services/userService";


type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OWNER" | "USER";
};


export default function UserSelector() {

  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);



  useEffect(() => {

    const loadUsers = async () => {

      try {

        const data = await getUsers();

        setUsers(data);

      } catch (err) {

        console.error(err);

        setError("Failed to load users");

      } finally {

        setLoading(false);

      }

    };


    void loadUsers();

  }, []);




  const handleLogin = () => {

    const user = users.find(
      (item) => item.id === selectedUser
    );


    if (!user) return;


    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );


    localStorage.setItem(
      "selected-role",
      user.role
    );


    router.push("/dashboard");

  };




  return (

    <div className="max-w-xl mx-auto mt-10 px-4">


      <div className="
        bg-white
        rounded-xl
        shadow-lg
        p-6
      ">



        <div className="text-center mb-6">


          <div className="
            w-16
            h-16
            mx-auto
            rounded-full
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
            text-xl
            font-bold
          ">
            MB
          </div>



          <h1 className="
            text-2xl
            font-bold
            mt-3
          ">
            Meeting Room Booking
          </h1>



          <p className="
            text-gray-500
            mt-1
          ">
            Select a user to continue
          </p>


        </div>





        {
          error && (

            <div className="
              bg-red-100
              text-red-700
              p-3
              rounded-lg
              mb-5
            ">

              {error}

            </div>

          )
        }







        {/* Role Permissions */}

        <div className="
          border
          rounded-lg
          p-4
          mb-6
        ">


          <h2 className="
            font-bold
            mb-3
          ">
            Role Permissions
          </h2>




          <div className="space-y-3 text-sm">


            <div>

              <div className="flex items-center gap-2 font-semibold">

                <span className="
                  w-3
                  h-3
                  rounded-full
                  bg-red-500
                " />

                Admin

              </div>


              <p className="text-gray-600 ml-5">
                Manage users, roles, and all bookings.
              </p>

            </div>




            <div>

              <div className="flex items-center gap-2 font-semibold">

                <span className="
                  w-3
                  h-3
                  rounded-full
                  bg-yellow-500
                " />

                Owner

              </div>


              <p className="text-gray-600 ml-5">
                Manage all bookings and view summaries.
              </p>

            </div>





            <div>

              <div className="flex items-center gap-2 font-semibold">

                <span className="
                  w-3
                  h-3
                  rounded-full
                  bg-green-500
                " />

                User

              </div>


              <p className="text-gray-600 ml-5">
                Create bookings and manage own bookings.
              </p>

            </div>


          </div>


        </div>









        {/* Login Dropdown */}


        <label className="
          block
          font-semibold
          mb-2
        ">

          Login as

        </label>




        <div className="relative w-full">


          <button

            type="button"

            disabled={loading}

            onClick={() => setOpen(!open)}

            className="
              w-full
              border
              rounded-lg
              p-3
              bg-white
              text-left
              flex
              justify-between
              items-center
            "

          >


            <span>

              {
                selectedUser

                ?

                (() => {

                  const user = users.find(
                    u => u.id === selectedUser
                  );


                  return user
                    ? `${user.name} - ${user.role}`
                    : "Select User";


                })()


                :

                "Select User"

              }


            </span>




            <span
              className={`
                transition-transform
                duration-200
                ${open ? "rotate-180" : ""}
              `}
            >

              ⌄

            </span>


          </button>







          {
            open && (

              <div className="
                absolute
                z-50
                top-full
                left-0
                mt-2
                w-full
                bg-white
                border
                rounded-lg
                shadow-lg
                max-h-60
                overflow-y-auto
              ">



                {
                  users.map((user)=>(


                    <div

                      key={user.id}

                      onClick={() => {

                        setSelectedUser(user.id);

                        setOpen(false);

                      }}


                      className="
                        p-3
                        hover:bg-gray-100
                        cursor-pointer
                        flex
                        items-center
                        gap-3
                      "

                    >




                      <span
                        className={`
                          w-3
                          h-3
                          rounded-full
                          ${
                            user.role === "ADMIN"
                            ? "bg-red-500"
                            :
                            user.role === "OWNER"
                            ? "bg-yellow-500"
                            :
                            "bg-green-500"
                          }
                        `}
                      />





                      <div className="flex-1">


                        <div className="font-semibold">

                          {user.name}

                        </div>



                        <div className="text-sm text-gray-500">

                          {user.email}

                        </div>


                      </div>





                      <span
                        className={`
                          text-xs
                          px-2
                          py-1
                          rounded-full
                          ${
                            user.role === "ADMIN"
                            ? "bg-red-100 text-red-700"
                            :
                            user.role === "OWNER"
                            ? "bg-yellow-100 text-yellow-700"
                            :
                            "bg-green-100 text-green-700"
                          }
                        `}
                      >

                        {user.role}

                      </span>



                    </div>


                  ))

                }



              </div>

            )
          }



        </div>









        <button

          disabled={!selectedUser || loading}

          onClick={handleLogin}

          className="
            w-full
            mt-5
            py-3
            rounded-lg
            bg-blue-600
            text-white
            font-semibold
            hover:bg-blue-700
            disabled:bg-gray-400
          "

        >

          {
            loading
            ? "Loading..."
            : "Login"
          }


        </button>




      </div>


    </div>


  );

}