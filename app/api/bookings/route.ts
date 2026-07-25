import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/bookings
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}

// POST /api/bookings
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, startTime, endTime } = body;

    if (!userId || !startTime || !endTime) {
      return NextResponse.json(
        {
          success: false,
          error: "userId, startTime and endTime are required",
        },
        {
          status: 400,
        }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Rule 1: startTime must be before endTime
    if (start >= end) {
      return NextResponse.json(
        {
          success: false,
          error: "Start time must be before end time",
        },
        {
          status: 400,
        }
      );
    }

    // Rule 2 & 3: Prevent overlapping bookings with userId filter
    const conflict = await prisma.booking.findFirst({
      where: {
        userId: userId, // ✅ FIXED: Now checks only the same user
        startTime: {
          lt: end,
        },
        endTime: {
          gt: start,
        },
      },
    });

    if (conflict) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking time overlaps with existing booking",
          conflict: {
            id: conflict.id,
            startTime: conflict.startTime,
            endTime: conflict.endTime,
          },
        },
        {
          status: 409,
        }
      );
    }

    const bookingData: Prisma.BookingUncheckedCreateInput = {
      userId,
      startTime: start,
      endTime: end,
      status: "PENDING",
    };

    const booking = await prisma.booking.create({
      data: bookingData,
      include: {
        user: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: booking,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}