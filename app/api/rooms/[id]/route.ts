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


    const room = await prisma.room.findUnique({

      where:{
        id
      },

      include:{
        bookings:true
      }

    });


    return Response.json({

      success:true,
      data:room

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


   const room=await prisma.room.update({

     where:{
       id
     },

     data:{
       ...body
     }

   });



   return Response.json({

     success:true,
     data:room

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


   await prisma.room.delete({

     where:{
       id
     }

   });



   return Response.json({

     success:true,
     message:"Room deleted"

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