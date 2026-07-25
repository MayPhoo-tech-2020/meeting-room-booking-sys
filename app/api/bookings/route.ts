// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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

    // ✅ 1. Required fields validation
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

    // ✅ 2. Validate dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid date format",
        },
        {
          status: 400,
        }
      );
    }

    // ✅ 3. Rule 1: startTime must be before endTime
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

    // ✅ 4. SECURITY: Prevent booking in the past
    const now = new Date();
    if (start < now) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot book in the past. Please select a future time.",
        },
        {
          status: 400,
        }
      );
    }

    // ✅ 5. Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // ✅ 6. Rules 2 & 3: Prevent overlapping bookings (single room)
    // Overlap detection logic:
    // - Identical ranges: start < end and end > start
    // - Partial overlaps: start < end and end > start
    // - One range fully inside another: start < end and end > start
    // - Back-to-back: start = end or end = start (allowed, no overlap)
    const conflict = await prisma.booking.findFirst({
      where: {
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

    // ✅ 7. Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        startTime: start,
        endTime: end,
      },
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
    console.error("Booking creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create booking",
      },
      {
        status: 500,
      }
    );
  }
}