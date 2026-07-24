import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// GET /api/bookings/:id
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;


    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        room: true,
      },
    });


    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        {
          status: 404,
        }
      );
    }


    return NextResponse.json({
      success: true,
      data: booking,
    });


  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );

  }
}




// DELETE /api/bookings/:id
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;


    const userId = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role");


    if (!userId || !role) {
      return NextResponse.json(
        {
          success: false,
          error: "User information missing",
        },
        {
          status: 401,
        }
      );
    }



    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
    });



    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        {
          status: 404,
        }
      );
    }



    // USER can delete only own booking
    if (
      role === "USER" &&
      booking.userId !== userId
    ) {

      return NextResponse.json(
        {
          success: false,
          error: "You can delete only your own bookings",
        },
        {
          status: 403,
        }
      );

    }



    // OWNER and ADMIN can delete any booking

    if (
      role !== "USER" &&
      role !== "OWNER" &&
      role !== "ADMIN"
    ) {

      return NextResponse.json(
        {
          success: false,
          error: "Invalid role",
        },
        {
          status: 403,
        }
      );

    }



    await prisma.booking.delete({
      where: {
        id,
      },
    });



    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
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