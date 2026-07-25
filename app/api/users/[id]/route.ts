import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();



// GET /api/users/:id
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;


    const user = await prisma.user.findUnique({

      where:{
        id,
      },

      include:{
        bookings:true,
      },

    });



    if(!user){

      return NextResponse.json(

        {
          success:false,
          error:"User not found",
        },

        {
          status:404,
        }

      );

    }



    return NextResponse.json({

      success:true,

      data:user,

    });



  } catch(error){

    return NextResponse.json(

      {
        success:false,
        error:"Something went wrong",
      },

      {
        status:500,
      }

    );

  }

}







// PATCH /api/users/:id
// Change user role
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id:string }> }
) {

  try {


    const currentRole =
      req.headers.get("x-user-role");


    const currentUserId =
      req.headers.get("x-user-id");




    if(currentRole !== "ADMIN"){

      return NextResponse.json(

        {
          success:false,
          error:"Only administrators can change roles",
        },

        {
          status:403,
        }

      );

    }



    const { id } =
      await context.params;



    const body =
      await req.json();


    const { role } = body;



    if(
      !role ||
      !Object.values(Role).includes(role)
    ){

      return NextResponse.json(

        {
          success:false,
          error:"Invalid role selected",
        },

        {
          status:400,
        }

      );

    }



    // Prevent changing your own role
    if(currentUserId === id){

      return NextResponse.json(

        {
          success:false,
          error:"You cannot change your own role",
        },

        {
          status:400,
        }

      );

    }




    const user =
      await prisma.user.update({

        where:{
          id,
        },

        data:{
          role,
        },

      });



    return NextResponse.json({

      success:true,

      data:user,

    });



  } catch(error){


    return NextResponse.json(

      {
        success:false,
        error:"Unable to update user role",
      },

      {
        status:500,
      }

    );

  }

}








// DELETE /api/users/:id
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id:string }> }
) {


  try {


    const currentRole =
      req.headers.get("x-user-role");


    const currentUserId =
      req.headers.get("x-user-id");




    if(currentRole !== "ADMIN"){

      return NextResponse.json(

        {
          success:false,
          error:"Only administrators can delete users",
        },

        {
          status:403,
        }

      );

    }





    const { id } =
      await context.params;




    if(currentUserId === id){


      return NextResponse.json(

        {
          success:false,
          error:"You cannot delete your own account",
        },

        {
          status:400,
        }

      );

    }





    const user =
      await prisma.user.findUnique({

        where:{
          id,
        },

      });




    if(!user){


      return NextResponse.json(

        {
          success:false,
          error:"User not found",
        },

        {
          status:404,
        }

      );

    }




    await prisma.booking.deleteMany({

      where:{
        userId:id,
      },

    });





    await prisma.user.delete({

      where:{
        id,
      },

    });





    return NextResponse.json({

      success:true,

      message:"User deleted successfully",

    });





  } catch(error){


    return NextResponse.json(

      {
        success:false,
        error:"Unable to delete user",
      },

      {
        status:500,
      }

    );


  }

}