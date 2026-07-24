import { getAll, create } from "@/lib/crud";


export async function GET(){

 const bookings = await getAll(
   "booking",
   {
     include:{
       user:true,
       room:true
     }
   }
 );


 return Response.json({
   success:true,
   data:bookings
 });

}