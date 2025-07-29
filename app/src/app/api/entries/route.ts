import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// create new entries
export async function POST(req: NextRequest) {
  const body = await req.json();
  const errors: Record<string, string> = {};

  if (
    !body.content ||
    typeof body.content !== "string"
  ) {
    errors.content = "content is required or invalid";
  }


  let parsedDate: Date | undefined;
  if (body.date) {
    try {
      parsedDate = new Date(body.date);
      if (isNaN(parsedDate.getTime())) errors.date = "invalid date format";
    } catch {
      errors.date = "invalid date format";
    }
  }

  if (Object.keys(errors).length > 0)
    return NextResponse.json({ success: false, errors }, { status: 400 });

  // content is empty, so delete entry
  if (body.content.trim() == "") {
    const entry = await prisma.entry.findFirst({
      where: {
        date: parsedDate,
      },
      select: {
        id: true,
      }
    })

    if (entry) {
      const r = await prisma.entry.delete({
        where: {
          id: entry.id,
        },
      });
      return NextResponse.json({ success: true, deleted: true });
    } else {
      return NextResponse.json({ success: false, errors: { id: "entry not found" } }, { status: 404 });
    }
  }


  // if we have content, we can create or update an entry

  const exists = await prisma.entry.findFirst({
    where: {
      date: parsedDate
    }, select: { id: true }
  })


  if (!exists) {
    const result = await prisma.entry.create({
      data: {
        content: body.content,
        userId: 1, // todo: implement auth
        ...(parsedDate && { date: parsedDate }),
      },
    });
    return NextResponse.json({ success: true, entry: result });
  } else {
    const result = await prisma.entry.update({
      where: {
        id: exists.id
      },
      data: {
        content: body.content,
        userId: 1, // todo: implement auth
        ...(parsedDate && { date: parsedDate }),
      },
    });
    return NextResponse.json({ success: true, entry: result });

  }

}

// retrieving entries
export async function GET(req: NextRequest) {
  const queryParam = req.nextUrl.searchParams.get("date");
  const errors: Record<string, string> = {};

  if (queryParam) {
    try {
      const parsedDate = new Date(queryParam);

      if (isNaN(parsedDate.getTime())) {
        errors.id = "date is invalid";
        return NextResponse.json({
          success: false,
          errors,
        });
      }

      //todo: impl. auth hihi
      const entry = await prisma.entry.findFirst({
        where: {
          date: parsedDate,
        },
      });

      if (!entry) {
        errors.entry = "entry not found";
        return NextResponse.json(
          {
            success: true,
            errors,
          }
        );
      }

      return NextResponse.json({
        success: true,
        entry,
      });
    } catch {
      errors.id = "error fetching entry";
    }
  } else {
    errors.id = "id is invalid or missing";
  }

  return NextResponse.json({ success: false, errors }, { status: 500 });
}
