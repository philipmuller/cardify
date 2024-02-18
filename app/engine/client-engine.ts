import { useRouter } from "next/router";
import { CreateDeckMode, CreateDeckParams } from "../model/comms-utils";
import { FileType } from "../model/file-type";
import { Logger } from "./logging-engine";
import { FileEngine } from "./file-engine";
import { upload } from "@vercel/blob/client";

export abstract class LanternEngine {
  static logger: Logger = new Logger("LanternEngine");

  static async deleteDeck(deckId: string) {
    const lg = this.logger.subprocess("deleteDeck");
    lg.logCall([deckId]);
    console.log("deckId", deckId);

    fetch(this.constructUrl("/api/deck/delete", [["deckId", deckId]]), {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));

    //const response = await this.fetch("/api/deck/delete", [["deckId", deckId]]);
  }

  static async uploadFile(
    file: Blob | File | ArrayBuffer | FormData,
    fileType: FileType,
  ): Promise<string> {
    const lg = this.logger.subprocess("uploadFile");
    lg.logCall([file, fileType]);

    const name =
      "attachment." +
      Object.keys(FileType)[Object.values(FileType).indexOf(fileType)];

    const response = await upload(name, file, {
      access: "public",
      handleUploadUrl: "/api/file/upload",
    });

    lg.logReturn(response.url);
    return response.url;
  }

  static constructNewDeckUrlFromFile(fileUrl: string, fileType: FileType) {
    const lg = this.logger.subprocess("constructNewDeckUrlFromFile");
    lg.logCall([fileUrl, fileType]);

    const params = new CreateDeckParams(CreateDeckMode.file, {
      fileUrl: fileUrl,
      fileType: fileType,
    });

    const returnValue = this.constructNewDeckUrl(params);
    lg.logReturn(returnValue);
    return returnValue;
  }

  static constructNewDeckUrlFromText(text: string): string {
    const lg = this.logger.subprocess("constructNewDeckUrlFromText");
    lg.logCall([text]);

    const params = new CreateDeckParams(CreateDeckMode.text, { text: text });

    const returnValue = this.constructNewDeckUrl(params);
    lg.logReturn(returnValue);
    return returnValue;
  }

  private static constructNewDeckUrl(params: CreateDeckParams): string {
    const lg = this.logger.subprocess("constructNewDeckUrl");
    lg.logCall([params]);

    let url = this.constructUrl("/deck", params.toArray());

    lg.logReturn(url);
    return url;
  }

  static async getDeckFromFile(
    fileUrl: string,
    fileType: FileType,
  ): Promise<Response> {
    //refactor to return deck
    const lg = this.logger.subprocess("getDeckFromFile");
    lg.logCall([fileUrl, fileType]);

    const response = await this.fetch("/api/deck/create", [
      [CreateDeckParams.paramNames.mode, CreateDeckMode.file],
      [CreateDeckParams.paramNames.fileUrl, fileUrl],
      [CreateDeckParams.paramNames.fileType, fileType],
    ]);

    lg.logReturn(response);
    return response;
  }

  static async getDeckFromLiveRecording(snippetUrl: string): Promise<Response> {
    //refactor to return deck
    const lg = this.logger.subprocess("getDeckFromLiveRecording");
    lg.logCall([snippetUrl]);

    const response = await this.getDeckFromFile(snippetUrl, FileType.webm);

    lg.logReturn(response);
    return response;
  }

  private static async fetch(
    baseUrl: string,
    searchParams?: string[][],
  ): Promise<Response> {
    const lg = this.logger.subprocess("(private) fetch");
    lg.logCall([baseUrl, searchParams]);

    const response = await fetch(this.constructUrl(baseUrl, searchParams));

    lg.logReturn(response);
    return response;
  }

  private static constructUrl(
    baseUrl: string,
    searchParams?: string[][],
  ): string {
    const lg = this.logger.subprocess("(private) constructUrl");
    lg.logCall([baseUrl, searchParams]);

    var completeUrl = baseUrl;

    if (searchParams) {
      completeUrl += "?" + new URLSearchParams(searchParams);
    }

    lg.logReturn(completeUrl);
    return completeUrl;
  }
}
