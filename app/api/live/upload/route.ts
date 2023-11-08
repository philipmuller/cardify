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
 
        console.log('blob upload completed', blob, tokenPayload);
        const http = require('http');
        const fs = require('fs');
        
        const file = fs.createWriteStream("tmp/file.wav");
        const request = http.get(blob.url, function(response: any) {
          response.pipe(file);
          // after download completed close filestream
          file.on("finish", async () => {
              file.close();
              console.log("Download Completed");

              const audioFile = fs.createReadStream("tmp/file.wav");
              
              const openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: false});
              let response = await openai.audio.transcriptions.create({
                file: await audioFile,
                model: "whisper-1",
              }); 
              
              console.log(response.text);
          });
        });
 
        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
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