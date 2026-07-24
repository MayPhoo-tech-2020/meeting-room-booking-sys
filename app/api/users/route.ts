import { prisma } from "@/lib/prisma";
import { createCrud } from "@/lib/crud";

const users = createCrud(prisma.user);


export async function GET() {

  const data = await users.findMany();

  return Response.json({
    success:true,
    count:data.length,
    data
  });

}



export async function POST(req:Request){

  const body = await req.json();

  const data = await users.create(body);


  return Response.json({
    success:true,
    data
  });

}