import { FileType } from "./file-type";

export enum CreateDeckMode { 
    text = "text",
    file = "file"
}

enum CreateDeckParam { 
    text = "text", 
    fileUrl = "fileUrl", 
    fileType = "fileType", 
    mode = "mode"
}

export class CreateDeckParams {
    mode: CreateDeckMode;
    text?: string;
    fileUrl?: string;
    fileType?: FileType;

    static modes = CreateDeckMode;
    static paramNames = CreateDeckParam;

    constructor(mode: CreateDeckMode, modeParams: { text?: string, fileUrl?: string, fileType?: FileType }) {
        this.mode = mode;
        this.text = modeParams.text;
        this.fileUrl = modeParams.fileUrl;
        this.fileType = modeParams.fileType;
    }

    toArray(): string[][] {
        let array: any[][] = [[CreateDeckParams.paramNames.mode, this.mode]];

        if (this.text != undefined) {
            array.push([CreateDeckParams.paramNames.text, this.text]);
        }

        if (this.fileUrl != undefined) {
            array.push([CreateDeckParams.paramNames.fileUrl, this.fileUrl]);
        }

        if (this.fileType != undefined) {
            array.push([CreateDeckParams.paramNames.fileType, this.fileType]);
        }
        
        return array;
    }
}