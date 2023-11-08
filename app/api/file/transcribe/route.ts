import { NextResponse } from 'next/server';
import { LighthouseEngine } from '@/app/engine/server-engine';
 
export async function GET(request: Request) {
  const fs = require('fs');
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url') ?? "";
  var transcription = "";
 
  try {
    const filename = "slice.webm";
    const savePath = await LighthouseEngine.donwloadFile(url, filename);
    const file = LighthouseEngine.readFile(savePath);
    transcription = await LighthouseEngine.getTranscription(file);
    
  } catch (error) {
    throw new Error('Could not update user');
  }
 
  return NextResponse.json(
    {
      transcription: transcription
    },
    {
      status: 200,
    },
  );
}