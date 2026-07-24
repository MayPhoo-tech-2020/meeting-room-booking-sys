import { prisma } from "@/lib/prisma";
import { createCrud } from "@/lib/crud";


const rooms = createCrud(prisma.room);



export async function GET(){

 const data = await rooms.findMany();


 return Response.json({
   success:true,
   count:data.length,
   data
 });

}



export async function POST(req:Request){

 const body = await req.json();


 const data = await rooms.create(body);


 return Response.json({
   success:true,
   data
 });

}