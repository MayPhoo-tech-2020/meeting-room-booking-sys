import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();



// GET /api/users
// ADMIN only
export async function GET(
  req: NextRequest
) {

  try {


    const role =
      req.headers.get("x-user-role");



    if(role !== "ADMIN") {

      return NextResponse.json(

        {
          success:false,
          error:"Only admin can view users",
        },

        {
          status:403,
        }

      );

    }





    const users =
      await prisma.user.findMany({

        orderBy:{
          createdAt:"desc",
        },

        include:{

          _count:{
            select:{
              bookings:true,
            },
          },

        },

      });





    return NextResponse.json({

      success:true,

      count:users.length,

      data:users,

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








// POST /api/users
// ADMIN only
export async function POST(
  req: NextRequest
) {


  try {


    const role =
      req.headers.get("x-user-role");



    if(role !== "ADMIN") {


      return NextResponse.json(

        {
          success:false,
          error:"Only admin can create users",
        },

        {
          status:403,
        }

      );


    }





    const body =
      await req.json();



    const {
      name,
      email,
      role:newRole,
    } = body;





    if(
      !name ||
      !email
    ){

      return NextResponse.json(

        {
          success:false,
          error:"Name and email are required",
        },

        {
          status:400,
        }

      );

    }





    const existingUser =
      await prisma.user.findUnique({

        where:{
          email,
        },

      });





    if(existingUser){

      return NextResponse.json(

        {
          success:false,
          error:"Email already exists",
        },

        {
          status:409,
        }

      );

    }






    let userRole: Role = Role.USER;





    if(newRole){


      if(
        !Object.values(Role).includes(newRole)
      ){

        return NextResponse.json(

          {
            success:false,
            error:"Invalid role",
          },

          {
            status:400,
          }

        );

      }



      userRole = newRole;


    }







    const user =
      await prisma.user.create({

        data:{

          name,

          email,

          role:userRole,

        },

      });






    return NextResponse.json(

      {
        success:true,
        data:user,
      },

      {
        status:201,
      }

    );





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