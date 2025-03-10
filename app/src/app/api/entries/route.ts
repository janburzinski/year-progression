import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// create new entries
export async function POST(req: NextRequest) {
  const body = await req.json();
  const errors: Record<string, string> = {};

  if (
    !body.content ||
    typeof body.content !== "string" ||
    body.content.trim() === ""
  ) {
    errors.content = "content is required or invalid";
  }

  let parsedDate: Date | undefined;
  if (body.date) {
    try {
      parsedDate = new Date(body.date);
      if (isNaN(parsedDate.getTime())) errors.date = "invalid date format";
    } catch (e) {
      errors.date = "invalid date format";
    }
  }

  if (Object.keys(errors).length > 0)
    return NextResponse.json({ success: false, errors }, { status: 400 });

  const result = await prisma.entry.create({
    data: {
      content: body.content,
      userId: 1, // todo: implement auth
      ...(parsedDate && { date: parsedDate }),
    },
  });

  return NextResponse.json({ success: true, entry: result });
}

// retrieving entries
export async function GET(req: NextRequest) {
  const queryParam = req.nextUrl.searchParams.get("id");
  const errors: Record<string, string> = {};

  if (queryParam) {
    try {
      const parsedId = parseInt(queryParam, 10);

      if (isNaN(parsedId)) {
        console.log(`invalid id #1 :: qp: ${queryParam} - pI: ${parsedId}`);
        errors.id = "id is invalid";
        return NextResponse.json({
          success: false,
          errors,
        });
      }

      //todo: impl. auth hihi
      const entry = await prisma.entry.findFirst({
        where: {
          id: parsedId,
        },
      });

      if (!entry) {
        errors.entry = "error while getting entry";
        return NextResponse.json(
          {
            success: false,
            errors,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        entry,
      });
    } catch (e) {
      errors.id = "error fetching entry";
    }
  } else {
    errors.id = "id is invalid or missing";
  }

  return NextResponse.json({ success: false, errors }, { status: 500 });
}
