import { NextResponse } from "next/server";
import { paymentsReady } from "@/lib/config";

export async function GET() {
  return NextResponse.json(paymentsReady());
}
