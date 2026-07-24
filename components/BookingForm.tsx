"use client";


import { Button, DatePicker, Form } from "antd";

import dayjs from "dayjs";

import { useEffect, useState } from "react";





interface BookingFormProps {

  loading?: boolean;

  onCreate: (
    values:{
      userId:string;
      startTime:string;
      endTime:string;
    }
  ) => Promise<void> | void;

}







type CurrentUser = {

  id:string;

  name:string;

};







export default function BookingForm({

  loading=false,

  onCreate

}:BookingFormProps){



  const [form] =
    Form.useForm();



  const [currentUser,setCurrentUser] =
    useState<CurrentUser|null>(null);








  useEffect(()=>{


    const stored =
      localStorage.getItem(
        "currentUser"
      );


    if(stored){

      setCurrentUser(
        JSON.parse(stored)
      );

    }


  },[]);









  const handleFinish = async(values:any)=>{



    if(!currentUser){

      return;

    }





    const start =
      values.startTime.toISOString();



    const end =
      values.endTime.toISOString();







    await onCreate({

      userId:currentUser.id,

      startTime:start,

      endTime:end,

    });





    form.resetFields();



  };









  return (

    <Form

      form={form}

      layout="vertical"

      onFinish={handleFinish}

    >






      <Form.Item

        label="Created By"

      >

        <div

          className="
          border
          rounded
          p-2
          bg-gray-50
          "

        >

          {
            currentUser
            ?
            currentUser.name
            :
            "Loading..."
          }


        </div>


      </Form.Item>









      <Form.Item


        name="startTime"

        label="Start Time"


        rules={[

          {

            required:true,

            message:
            "Please select start time"

          }

        ]}


      >


        <DatePicker

          showTime

          format="YYYY-MM-DD HH:mm"

          disabledDate={(current)=>
            current &&
            current < dayjs().startOf("day")
          }


          style={{

            width:"100%"

          }}


        />


      </Form.Item>









      <Form.Item


        name="endTime"

        label="End Time"


        dependencies={[
          "startTime"
        ]}


        rules={[


          {

            required:true,

            message:
            "Please select end time"

          },




          ({getFieldValue})=>({

            validator(_,value){


              const start =
                getFieldValue(
                  "startTime"
                );



              if(

                !start ||

                !value ||

                dayjs(value)
                .isAfter(dayjs(start))

              ){

                return Promise.resolve();

              }



              return Promise.reject(

                new Error(
                  "End time must be after start time"
                )

              );


            }

          })


        ]}



      >



        <DatePicker


          showTime


          format="YYYY-MM-DD HH:mm"



          style={{

            width:"100%"

          }}


        />


      </Form.Item>









      <Button

        type="primary"

        htmlType="submit"

        loading={loading}

      >

        Create Booking


      </Button>






    </Form>


  );

}