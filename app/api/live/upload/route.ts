import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { anthropicKey, openAIKey } from "@/keychain";
import OpenAI from "openai";
 
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
 
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname: string,
        /* clientPayload?: string, */
      ) => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.
        console.log("this is runnig I guess");
        return {
        //token: "vercel_blob_rw_Djoe2Zyycs82umeT_HIiFjdJjSiI2SOVvteB0I2pmjkOzPu",
          //allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            // you could pass a user id from auth, or a value from clientPayload
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow
        const https = require('https');
        const fs = require('fs');

        const { Readable } = require('stream');
        const { finished } = require('stream/promises');
        const path = require("path");
        const fetch = require("node-fetch");

        async function downloadFileD(url: string, filename: string) {
          console.log(`running downloadFileD with params: url: ${url}, filename: ${filename}`);
          const res = await fetch(url);
          console.log(`fetch successful, result: ${JSON.stringify(res)}, res.body: ${JSON.stringify(res.body)}, ${res}`);
          const destination = path.resolve(`/tmp/${filename}`);
          console.log(`destination: ${JSON.stringify(destination)}`);
          const fileStream = fs.createWriteStream(destination, { flags: 'wx' });
          console.log(`fileStream: ${JSON.stringify(fileStream)}`);
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
          console.log('blob upload completed', blob, tokenPayload);

          await downloadFileD(blob.url, blob.pathname);
          console.log('finished downloading file');
          const fileContent = fs.readFileSync(`/tmp/${blob.pathname}`);
          console.log(`finished reading file from /tmp/${blob.pathname}, fileContent: ${fileContent}, ${JSON.stringify(fileContent)}`);

          const openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: false});

          let response = await openai.audio.transcriptions.create({
            file: await fileContent,
            model: "whisper-1",
          }); 

          console.log("TRANSCRIPTION RESPONSE: " + JSON.stringify(response));

        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });
 
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}