import { prisma } from "@/lib/prisma";
import { createCrud } from "@/lib/crud";


const users = createCrud(prisma.user);


export async function GET(
 req:Request,
 {params}:{params:{id:string}}
){

 const data = await users.findUnique(params.id);


 return Response.json({
   success:true,
   data
 });

}



export async function PUT(
 req:Request,
 {params}:{params:{id:string}}
){

 const body = await req.json();

 const data = await users.update(
   params.id,
   body
 );


 return Response.json({
   success:true,
   data
 });

}



export async function DELETE(
 req:Request,
 {params}:{params:{id:string}}
){

 await users.delete(params.id);


 return Response.json({
   success:true,
   message:"User deleted"
 });

}