import { prisma } from "@/lib/prisma";


export async function GET() {

  try {

    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        room: true
      }
    });


    return Response.json({
      success: true,
      count: bookings.length,
      data: bookings
    });


  } catch(error:any){

    return Response.json(
      {
        success:false,
        error:error.message
      },
      {
        status:500
      }
    );

  }

}



export async function POST(req:Request){

  try {

    const body = await req.json();


    const booking = await prisma.booking.create({

      data: {
        userId: body.userId,
        roomId: body.roomId,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        status: body.status ?? "PENDING"
      },

      include:{
        user:true,
        room:true
      }

    });



    return Response.json({
      success:true,
      data:booking
    });



  } catch(error:any){

    return Response.json(
      {
        success:false,
        error:error.message
      },
      {
        status:500
      }
    );

  }

}