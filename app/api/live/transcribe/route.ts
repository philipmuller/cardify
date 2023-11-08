import { NextResponse } from 'next/server';
import { anthropicKey, openAIKey } from "@/keychain";
import OpenAI from "openai";
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url') ?? "";
  var transcription = "";
  const https = require('https');
        const fs = require('fs');

        const { Readable } = require('stream');
        const { finished } = require('stream/promises');
        const path = require("path");

        async function downloadFileD(url: string, filename: string) {
          console.log(`running downloadFileD with params: url: ${url}, filename: ${filename}`);
          const res = await fetch(new URL(url), { method: 'GET' });
          console.log(res.statusText);
          //console.log(`fetch successful, result: ${JSON.stringify(res)}, res.body: ${JSON.stringify(res.body)}, ${res}`);
          const destination = path.resolve(`tmp/${filename}`);
          console.log(`destination: ${JSON.stringify(destination)}`);
          const fileStream = fs.createWriteStream(destination);
          //console.log(`fileStream: ${JSON.stringify(fileStream)}`);
          await finished(Readable.fromWeb(res.body).pipe(fileStream));
        }

        function downloadFile(url: string, path: string) {
        
          https.get(url, (res: any) => {
              const fileStream = fs.createWriteStream(path);
              res.pipe(fileStream);
              fileStream.on('finish', () => {
                  fileStream.close();
                  console.log('Download finished')
              });
          })
        }
 
        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });

          await downloadFileD(url, "slice.webm");
          console.log('finished downloading file');
          fs.readFile('tmp/slice.webm', (err: any, data: any) => {
            if (!err && data) {
              //console.log('data: ' + data);
            } else {
              console.log('err: ' + err);
            }
          });
          const fileContent = fs.readFileSync(`tmp/slice.webm`);
          //console.log(`finished reading file from /tmp/slice.wav, fileContent: ${fileContent}, ${JSON.stringify(fileContent)}`);

          const openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: false});

          //console.log("ASKING WHISPER " + JSON.stringify(fileContent));
          try {
            const response = await openai.audio.transcriptions.create({
              file: fs.createReadStream(`tmp/slice.webm`),
              model: 'whisper-1',
            });
            //return response?.text
            console.log("TRANSCRIPTION RESPONSE: " + JSON.stringify(response.text));
            transcription = response.text;
          } catch (error) {
            console.log('ERROR IS:', error)
          }
          
          // let response = await openai.audio.transcriptions.create({
          //   file: fileContent,
          //   model: "whisper-1",
          // }); 

          
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