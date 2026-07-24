import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// GET /api/users
// Public: used by login user selector
export async function GET() {

  try {

    const users =
      await prisma.user.findMany({

        select: {

          id: true,

          name: true,

          email: true,

          role: true,

          createdAt: true,

          updatedAt: true,

          _count: {

            select: {

              bookings: true,

            },

          },

        },


        orderBy: {

          createdAt: "desc",

        },


      });



    return NextResponse.json({

      success: true,

      data: users,

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
      req.headers.get(
        "x-user-role"
      );



    if(role !== "ADMIN") {


      return NextResponse.json(

        {

          success:false,

          error:
          "Only admin can create users",

        },

        {

          status:403,

        }

      );

    }




    const body =
      await req.json();



    const user =
      await prisma.user.create({

        data: {

          name: body.name,

          email: body.email,

          role: body.role ?? "USER",

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