import { NextResponse } from "next/server";
import { LighthouseEngine } from "@/app/engine/server-engine";
import { Logger } from "@/app/engine/logging-engine";

export async function GET(request: Request) {
  const lg = new Logger("api/deck/create").subprocess("GET");
  lg.logCall([request]);

  const { searchParams } = new URL(request.url);
  lg.log("searchParams");
  lg.log(searchParams);
  try {
    const deckParams = LighthouseEngine.createDeckParamsFrom(searchParams);
    lg.log("deckParams");
    lg.log(deckParams);
    const deck = await LighthouseEngine.handleGetDeckRequest(deckParams);
    lg.log("deck");
    lg.log(deck);
    return NextResponse.json({ deck: deck.plainObject() }, { status: 200 });
  } catch (error) {
    lg.log("Error: " + (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
