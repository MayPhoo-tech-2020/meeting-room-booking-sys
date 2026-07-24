"use client";

import { Button, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import type { Booking } from "../types/booking";



interface BookingTableProps {

  bookings: Booking[];

  loading?: boolean;

  currentRole: string;

  currentUserId?: string;

  onDelete: (
    id:string
  ) => Promise<void> | void;

}






export default function BookingTable({

  bookings,

  loading=false,

  currentRole,

  currentUserId,

  onDelete

}:BookingTableProps){






  const canDelete = (
    booking:Booking
  )=>{


    if(
      currentRole === "ADMIN" ||
      currentRole === "OWNER"
    ){

      return true;

    }



    if(
      currentRole === "USER" &&
      booking.userId === currentUserId
    ){

      return true;

    }



    return false;


  };









  const columns:ColumnsType<Booking>=[



    {

      title:"Created By",

      render:(
        _:unknown,
        record:Booking
      )=>(

        <div>

          <div className="font-semibold">

            {
              record.user?.name
              ||
              "Unknown"
            }

          </div>


          <div className="text-gray-500 text-sm">

            {
              record.user?.email
            }

          </div>


        </div>

      )

    },





    {

      title:"Status",

      dataIndex:"status",

      render:(value)=>{


        const color =

          value === "APPROVED"

          ?

          "green"

          :

          value === "REJECTED"

          ?

          "red"

          :

          "orange";



        return (

          <Tag color={color}>

            {value}

          </Tag>

        );


      }

    },





    {

      title:"Start Time",

      dataIndex:"startTime",

      render:(value)=>


        new Date(value)
        .toLocaleString()


    },







    {

      title:"End Time",

      dataIndex:"endTime",

      render:(value)=>


        new Date(value)
        .toLocaleString()


    },








    {

      title:"Actions",

      key:"actions",

      render:(
        _:unknown,
        record:Booking
      )=>


      canDelete(record)

      ?

      (

        <Button

          danger

          onClick={()=>
            onDelete(record.id)
          }

        >

          Delete

        </Button>


      )


      :

      (

        <span className="text-gray-400">

          No permission

        </span>

      )


    }



  ];








  return (

    <Table

      rowKey="id"

      columns={columns}

      dataSource={bookings}

      loading={loading}

      pagination={{
        pageSize:5
      }}

    />

  );


}