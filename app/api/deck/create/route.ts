import { NextResponse } from 'next/server';
import { LighthouseEngine } from '@/app/engine/server-engine';
import { FileType } from '@/app/model/file-type';
import { Deck } from '@/app/model/card-model';
import { CreateDeckParams } from '@/app/model/comms-utils';
import { Logger } from '@/app/engine/logging-engine';


export async function GET(request: Request) {
    const lg = new Logger("api/deck/create").subprocess("GET");
    lg.logCall([request]);
    
    const { searchParams } = new URL(request.url);

    try {
        const deckParams = LighthouseEngine.createDeckParamsFrom(searchParams);
        const deck = await LighthouseEngine.handleGetDeckRequest(deckParams);

        return NextResponse.json(
            { deck: deck.plainObject() },
            { status: 200 },
        );
    } catch (error) {
        lg.log("Error: " + (error as Error).message);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 },
        );
    }
    
}