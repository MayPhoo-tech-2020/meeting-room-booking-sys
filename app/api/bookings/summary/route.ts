import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// GET /api/bookings/summary
// OWNER + ADMIN only
export async function GET(req: NextRequest) {

  try {

    const role = req.headers.get("x-user-role");


    if (
      role !== "OWNER" &&
      role !== "ADMIN"
    ) {

      return NextResponse.json(
        {
          success:false,
          error:"Only owner or admin can view summary",
        },
        {
          status:403,
        }
      );

    }



    const totalBookings = await prisma.booking.count();



    const bookingsByUser = await prisma.user.findMany({

      select:{
        id:true,
        name:true,
        email:true,
        role:true,

        _count:{
          select:{
            bookings:true,
          },
        },

      },

      orderBy:{
        bookings:{
          _count:"desc",
        },
      },

    });



    return NextResponse.json({

      success:true,

      data:{

        totalBookings,

        bookingsByUser:
          bookingsByUser.map(user => ({

            userId:user.id,

            name:user.name,

            email:user.email,

            role:user.role,

            totalBookings:
              user._count.bookings,

          })),

      },

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