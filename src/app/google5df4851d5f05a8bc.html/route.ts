import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("google-site-verification: google5df4851d5f05a8bc.html", {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}
