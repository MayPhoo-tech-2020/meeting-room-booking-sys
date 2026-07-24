import { getAll, create } from "@/lib/crud";

export async function GET() {
  const users = await getAll("user");

  return Response.json({
    success: true,
    data: users,
  });
}


export async function POST(request: Request) {

  const body = await request.json();

  const user = await create(
    "user",
    body
  );

  return Response.json(user);
}