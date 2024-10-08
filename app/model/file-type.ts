export enum FileType {
    mp3 = "audio/mpeg",
    wav = "audio/wav",
    webm = "audio/webm",
    webmVideo = "video/webm",
    doc = "application/msword",
    docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pdf = "application/pdf",
    ppt = "application/vnd.ms-powerpoint",
    txt = "text/plain"
}

export function getFileTypeFromString(value: string): FileType | undefined {
    return Object.values(FileType).find((enumValue) => enumValue === value);
}