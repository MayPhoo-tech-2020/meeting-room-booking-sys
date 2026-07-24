"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OWNER" | "USER";
};



export default function Dashboard() {


  const router = useRouter();


  const [user, setUser] = useState<User | null>(null);



  useEffect(() => {

    const storedUser =
      localStorage.getItem("currentUser");


    if (storedUser) {

      setUser(JSON.parse(storedUser));

    }


  }, []);




  const handleLogout = () => {

    localStorage.removeItem("currentUser");

    localStorage.removeItem("selected-role");

    router.push("/");

  };




  if (!user) {

    return (

      <main className="p-8">

        <h1 className="text-xl">
          Please login first
        </h1>

      </main>

    );

  }



  return (

    <main className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-4xl mx-auto">


        <div className="bg-white rounded-lg shadow p-6">


          <div className="
            flex
            justify-between
            items-center
            mb-6
          ">


            <h1 className="text-3xl font-bold">

              Welcome, {user.name}

            </h1>



            <button

              onClick={handleLogout}

              className="
                bg-red-500
                hover:bg-red-600
                text-white
                px-4
                py-2
                rounded-lg
                font-semibold
              "

            >

              Logout

            </button>


          </div>




          <div className="mb-6">

            <p>
              Email:
              <span className="font-semibold ml-2">
                {user.email}
              </span>
            </p>


            <p>
              Role:
              <span className="font-bold ml-2 text-blue-600">
                {user.role}
              </span>
            </p>

          </div>



          {/* Keep your existing ADMIN / OWNER / USER sections here */}



        </div>


      </div>


    </main>

  );

}