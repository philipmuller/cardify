import { NextResponse } from 'next/server';
import { LighthouseEngine } from '@/app/engine/server-engine';
import { FileType } from '@/app/model/file-type';
import { Deck } from '@/app/model/card-model';
import { CreateDeckParam, CreateDeckMode } from '@/app/model/comms-utils';
import { Logger } from '@/app/engine/logging-engine';


export async function GET(request: Request) {
    const lg = new Logger("api/deck/create").subprocess("GET");
    lg.logCall([request]);
    
    const { searchParams } = new URL(request.url);

    try {
        var deck: Deck;
        const mode = searchParams.get(CreateDeckParam.mode);
        if (mode == null) {
            throw new Error("No mode specified");
        } else {
            switch (mode) {
                case CreateDeckMode.text:
                    deck = await fromText();
                    break;
                case CreateDeckMode.file:
                    deck = await fromFile();
                    break;
                default:
                    throw new Error("Invalid mode");
            }

            //console.log("I AM IN THE GET REQUEST NDOIAODI " + JSON.stringify(deck));
            //console.log("PLAIN VERSION  " + JSON.stringify(deck.plainObject()));
            return NextResponse.json(
                { deck: deck.plainObject() },
                { status: 200 },
            );
        }

    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 },
        );
    }

    async function fromText(): Promise<Deck> {
        const text = searchParams.get(CreateDeckParam.text);
        if (text == null) {
            throw new Error("Mode is text, but no text is specified");
        } else {
            return LighthouseEngine.getDeckFromText(text);
        }
    }

    async function fromFile(): Promise<Deck> {
        const url = searchParams.get(CreateDeckParam.fileUrl);
        const fileType = searchParams.get(CreateDeckParam.fileType);
        if (url == null || fileType == null) {
            throw new Error("Mode is file, but no file url and/or type is specified");
        } else {
            console.log("!!! IMPORTANT CHECK. String file type:" + fileType);
            console.log("!!! IMPORTANT CHECK. fileType in FileType" + (<any>Object).values(FileType).includes(fileType));
            if (!(<any>Object).values(FileType).includes(fileType)) {
                throw new Error("Invalid file type");
            }
            const type: FileType = <FileType> fileType;
            console.log("!!! IMPORTANT CHECK. String file type:" + fileType + "converted to FileType: " + type);
            return LighthouseEngine.getDeckFromFile(url, type);
        }
    }
    
}