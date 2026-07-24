import { prisma } from "@/lib/prisma";


type Context = {
  params: Promise<{
    id:string;
  }>;
};



export async function GET(
 req:Request,
 context:Context
){

 try{

  const {id}=await context.params;


  const booking = await prisma.booking.findUnique({

    where:{
      id
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
 context:Context
){

 try{

  const {id}=await context.params;

  const body=await req.json();



  const booking = await prisma.booking.update({

    where:{
      id
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
 context:Context
){

 try{

  const {id}=await context.params;


  await prisma.booking.delete({

    where:{
      id
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