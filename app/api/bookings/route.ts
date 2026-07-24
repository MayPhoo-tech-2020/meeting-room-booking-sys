import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// GET /api/bookings
export async function GET() {

  try {

    const bookings = await prisma.booking.findMany({

      include:{
        user:{
          select:{
            id:true,
            name:true,
            email:true,
            role:true,
          },
        },

        room:true,
      },


      orderBy:{
        startTime:"asc",
      },

    });



    return NextResponse.json({

      success:true,

      count:bookings.length,

      data:bookings,

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





// POST /api/bookings
export async function POST(
  req: NextRequest
) {

  try {


    const body = await req.json();


    const {
      userId,
      roomId,
      startTime,
      endTime,
    } = body;



    if(
      !userId ||
      !roomId ||
      !startTime ||
      !endTime
    ){

      return NextResponse.json(
        {
          success:false,
          error:"userId, roomId, startTime and endTime are required",
        },
        {
          status:400,
        }
      );

    }



    const start = new Date(startTime);
    const end = new Date(endTime);



    // Rule 1:
    // startTime must be before endTime
    if(start >= end) {

      return NextResponse.json(
        {
          success:false,
          error:"startTime must be before endTime",
        },
        {
          status:400,
        }
      );

    }





    /*
      Overlap rule:

      Existing:
      A -------- B

      New overlaps when:

      newStart < existingEnd
      AND
      newEnd > existingStart


      This catches:

      1. Same range

      10-11
      10-11


      2. Partial overlap

      10-12
        11-13


      3. Inside another

      10------14
        11-12


      4. Start inside

      10-12
          12-13  <-- allowed because equal

    */



    const conflict =
      await prisma.booking.findFirst({

        where:{

          roomId,


          startTime:{
            lt:end,
          },


          endTime:{
            gt:start,
          },

        },

      });





    if(conflict){


      return NextResponse.json(
        {
          success:false,
          error:"Booking time overlaps with existing booking",
          conflict:{
            id:conflict.id,
            startTime:conflict.startTime,
            endTime:conflict.endTime,
          },
        },
        {
          status:409,
        }
      );


    }




    const booking =
      await prisma.booking.create({

        data:{

          userId,

          roomId,

          startTime:start,

          endTime:end,

        },

        include:{

          user:true,

          room:true,

        },

      });




    return NextResponse.json(
      {
        success:true,
        data:booking,
      },
      {
        status:201,
      }
    );




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