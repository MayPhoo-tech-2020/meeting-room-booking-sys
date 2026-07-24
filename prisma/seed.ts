import { PrismaClient, Role, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, index) =>
      prisma.user.create({
        data: {
          name: `User ${index + 1}`,
          email: `user${index + 1}@example.com`,
          role: index === 0 ? Role.ADMIN : Role.USER,
        },
      })
    )
  );

  // Create 20 Bookings
  const statuses = [
    BookingStatus.PENDING,
    BookingStatus.APPROVED,
    BookingStatus.REJECTED,
  ];

  await Promise.all(
    Array.from({ length: 20 }).map((_, index) =>
      prisma.booking.create({
        data: {
          startTime: new Date(
            2026,
            6,
            24 + Math.floor(index / 5),
            9 + (index % 5)
          ),
          endTime: new Date(
            2026,
            6,
            24 + Math.floor(index / 5),
            10 + (index % 5)
          ),
          status: statuses[index % statuses.length],

          userId: users[index % users.length].id,
        },
      })
    )
  );

  console.log("Created:");
  console.log("10 Users");
  console.log("20 Bookings");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });