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
      where: {
        id,
      },
      include: {
        bookings: {
          include: {
            room: true,
          },
        },
      },
    });


    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }


    return NextResponse.json({
      success: true,
      data: user,
    });


  } catch(error) {

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
// Update role
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const adminRole = req.headers.get("x-user-role");


    if(adminRole !== "ADMIN") {

      return NextResponse.json(
        {
          success:false,
          error:"Only admin can update users",
        },
        {
          status:403,
        }
      );

    }



    const { id } = await context.params;


    const body = await req.json();


    const { role } = body;



    if(!role || !Object.values(Role).includes(role)) {

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



    const user = await prisma.user.update({

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



  } catch(error) {


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
// Admin only
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {


    const adminRole = req.headers.get("x-user-role");


    if(adminRole !== "ADMIN") {

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



    const { id } = await context.params;



    const user = await prisma.user.findUnique({
      where:{
        id,
      },
    });



    if(!user) {

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



    // remove user's bookings first
    await prisma.booking.deleteMany({
      where:{
        userId:id,
      },
    });



    // remove user
    await prisma.user.delete({
      where:{
        id,
      },
    });



    return NextResponse.json({
      success:true,
      message:"User and related bookings deleted successfully",
    });



  } catch(error) {


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