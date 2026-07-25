import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    // Rule 2 & 3: Prevent overlapping bookings for the SINGLE ROOM
    // ✅ REMOVED userId filter - checking ALL bookings
    const conflict = await prisma.booking.findFirst({
      where: {
        // ❌ NO userId filter here!
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
          error: "This time slot is already booked. Please choose a different time.",
          conflict: {
            id: conflict.id,
            startTime: conflict.startTime,
            endTime: conflict.endTime,
            userId: conflict.userId,
          },
        },
        {
          status: 409,
        }
      );
    }

    // Create the booking
    const bookingData: Prisma.BookingUncheckedCreateInput = {
      userId,
      startTime: start,
      endTime: end,
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