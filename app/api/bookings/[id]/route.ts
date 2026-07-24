import { prisma } from "@/lib/prisma";


export async function GET(
 req:Request,
 {params}:{params:{id:string}}
){

  try {


    const booking = await prisma.booking.findUnique({

      where:{
        id:params.id
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



  }catch(error:any){

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



export async function PUT(
 req:Request,
 {params}:{params:{id:string}}
){

  try {

    const body = await req.json();


    const booking = await prisma.booking.update({

      where:{
        id:params.id
      },


      data:{

        ...(body.userId && {
          userId:body.userId
        }),

        ...(body.roomId && {
          roomId:body.roomId
        }),

        ...(body.startTime && {
          startTime:new Date(body.startTime)
        }),

        ...(body.endTime && {
          endTime:new Date(body.endTime)
        }),

        ...(body.status && {
          status:body.status
        })

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



  }catch(error:any){

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




export async function DELETE(
 req:Request,
 {params}:{params:{id:string}}
){

  try {


    await prisma.booking.delete({

      where:{
        id:params.id
      }

    });



    return Response.json({

      success:true,

      message:"Booking deleted"

    });



  }catch(error:any){

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