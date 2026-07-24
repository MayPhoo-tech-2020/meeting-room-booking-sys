"use client";

import { Button, Form, Input, Select } from "antd";


interface UserFormProps {

  loading?: boolean;

  onCreate: (
    values:{
      name:string;
      email:string;
      role:"ADMIN" | "OWNER" | "USER";
    }
  ) => Promise<void> | void;

}






const roleOptions = [

  {
    value:"ADMIN",
    label:"Admin",
  },

  {
    value:"OWNER",
    label:"Owner",
  },

  {
    value:"USER",
    label:"User",
  },

];








export default function UserForm({

  loading=false,

  onCreate

}:UserFormProps){



  const [form] =
    Form.useForm();






  const handleFinish = async(
    values:{
      name:string;
      email:string;
      role:"ADMIN" | "OWNER" | "USER";
    }
  )=>{


    await onCreate(values);


    form.resetFields();


  };







  return (

    <Form

      form={form}

      layout="vertical"

      onFinish={handleFinish}

    >





      <Form.Item

        name="name"

        label="Name"

        rules={[
          {
            required:true,
            message:"Please enter a name",
          }
        ]}

      >

        <Input />

      </Form.Item>








      <Form.Item

        name="email"

        label="Email"

        rules={[

          {
            required:true,
            message:"Please enter an email",
          },

          {
            type:"email",
            message:"Please enter a valid email",
          }

        ]}

      >

        <Input />

      </Form.Item>









      <Form.Item

        name="role"

        label="Role"

        initialValue="USER"

      >

        <Select

          options={roleOptions}

        />

      </Form.Item>







      <Button

        type="primary"

        htmlType="submit"

        loading={loading}

      >

        Create User

      </Button>




    </Form>

  );

}