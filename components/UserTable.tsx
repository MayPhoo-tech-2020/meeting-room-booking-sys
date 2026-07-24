"use client";


import { Button, Select, Table, Tag } from "antd";

import type { ColumnsType } from "antd/es/table";

import type { User } from "../types/user";




interface UserTableProps {

  users: User[];

  loading?: boolean;

  currentRole:string;

  onDelete:(id:string)=>Promise<void>|void;

  onRoleChange:(
    id:string,
    role:User["role"]
  )=>Promise<void>|void;

}







const roleOptions=[

  {
    value:"ADMIN",
    label:"Admin"
  },

  {
    value:"OWNER",
    label:"Owner"
  },

  {
    value:"USER",
    label:"User"
  }

];










export default function UserTable({

  users,

  loading=false,

  currentRole,

  onDelete,

  onRoleChange

}:UserTableProps){







  const columns:ColumnsType<User>=[




    {

      title:"Name",

      dataIndex:"name"

    },







    {

      title:"Email",

      dataIndex:"email"

    },








    {

      title:"Role",

      dataIndex:"role",

      render:(role:User["role"])=>{


        const color =

          role==="ADMIN"

          ?

          "red"

          :

          role==="OWNER"

          ?

          "gold"

          :

          "green";



        return (

          <Tag color={color}>

            {role}

          </Tag>

        );


      }

    },







    {

      title:"Bookings",

      dataIndex:["_count","bookings"],

      render:(count)=>count ?? 0

    },







    {

      title:"Created",

      dataIndex:"createdAt",

      render:(value)=>


        new Date(value)
        .toLocaleDateString()


    },








    ...(

      currentRole==="ADMIN"

      ?

      [

        {

          title:"Actions",

          key:"actions",


          render:(
            _:unknown,
            record:User
          )=>(


            <div className="flex gap-2">


              <Select

                value={record.role}

                options={roleOptions}

                style={{
                  width:120
                }}

                onChange={(value)=>


                  onRoleChange(

                    record.id,

                    value as User["role"]

                  )

                }

              />





              <Button

                danger

                onClick={()=>


                  onDelete(record.id)

                }

              >

                Delete

              </Button>



            </div>


          )


        }

      ]

      :

      []

    )


  ];












  return (

    <Table

      rowKey="id"

      columns={columns}

      dataSource={users}

      loading={loading}

      pagination={{

        pageSize:5

      }}

    />

  );


}