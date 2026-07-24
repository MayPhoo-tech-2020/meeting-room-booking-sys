import { prisma } from "@/lib/prisma";
import { createCrud } from "@/lib/crud";


const rooms = createCrud(prisma.room);


export async function GET(
req:Request,
{params}:{params:{id:string}}
){

const data = await rooms.findUnique(params.id);

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

const data = await rooms.update(
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

await rooms.delete(params.id);


return Response.json({
success:true,
message:"Room deleted"
});

}