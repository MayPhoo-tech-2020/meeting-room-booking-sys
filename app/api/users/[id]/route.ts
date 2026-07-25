import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();




// GET /api/users/:id
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {


    const { id } =
      await context.params;



    const user =
      await prisma.user.findUnique({

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
        error:String(error),
      },

      {
        status:500,
      }

    );


  }

}











// PATCH /api/users/:id
// Change user role
// ADMIN only
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {


  try {


    const adminRole =
      req.headers.get("x-user-role");



    if(adminRole !== "ADMIN"){


      return NextResponse.json(

        {
          success:false,
          error:"Only admin can change user roles",
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
          error:"Valid role is required",
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
        error:String(error),
      },

      {
        status:500,
      }

    );


  }

}












// DELETE /api/users/:id
// ADMIN only
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {


  try {


    const adminRole =
      req.headers.get("x-user-role");


    const currentUserId =
      req.headers.get("x-user-id");





    if(adminRole !== "ADMIN"){


      return NextResponse.json(

        {
          success:false,
          error:"Only admin can delete users",
        },

        {
          status:403,
        }

      );


    }








    const { id } =
      await context.params;







    // Prevent deleting currently logged-in admin
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








    /*
      Delete behavior:

      When a user is deleted,
      all bookings created by that user
      will also be deleted.
    */



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

      message:
        "User deleted successfully. Related bookings were also removed.",

    });






  } catch(error){


    return NextResponse.json(

      {
        success:false,
        error:String(error),
      },

      {
        status:500,
      }

    );


  }

}