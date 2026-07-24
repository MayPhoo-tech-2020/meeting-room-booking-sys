import { getAll, create } from "@/lib/crud";


export async function GET() {

  const rooms = await getAll(
    "room"
  );

  return Response.json({
    success:true,
    data:rooms
  });

}


export async function POST(request:Request){

 const body = await request.json();

 const room = await create(
    "room",
    body
 );

 return Response.json(room);

}