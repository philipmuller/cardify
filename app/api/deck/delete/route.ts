// pages/api/deck/delete/route.ts
import { NextResponse } from "next/server";
import { LighthouseEngine } from "@/app/engine/server-engine";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const deckId = searchParams.get("deckId");
  console.log("POST request to delete deck, request: ", searchParams);

  if (!deckId) {
    return new NextResponse(JSON.stringify({ error: "Deck ID is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    await LighthouseEngine.deleteDeckFromDatabase(deckId);

    return new NextResponse(JSON.stringify("Success"), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
