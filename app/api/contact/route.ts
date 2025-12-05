// file: app/api/contact/route.ts
import { NextResponse } from "next/server";

export type ContactRequestBody = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<ContactRequestBody>;

  const errors: Record<string, string> = {};

  if (!body.name || !body.name.trim()) {
    errors.name = "Le nom est requis.";
  }

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
  if (!body.email || !emailRegex.test(body.email)) {
    errors.email = "Un email valide est requis.";
  }

  if (!body.message || !body.message.trim()) {
    errors.message = "Le message est requis.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        success: false,
        errors,
      },
      { status: 400 },
    );
  }

  console.log("Contact request received", {
    name: body.name,
    email: body.email,
    phone: body.phone,
    subject: body.subject,
    message: body.message,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
