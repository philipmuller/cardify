"use client";

import { Card, Deck } from "../model/card-model";
import CardBrowser from "./card-browser";
import { useState, useEffect, useRef } from "react";
import { Record, Pause, VinylRecord } from "@phosphor-icons/react";
import { FileType } from "../model/file-type";
import { LanternEngine } from "../engine/client-engine";

export default function LiveView({
  onClose,
}: {
  onClose?: () => void;
})  {
  const [cards, setCards] = useState<Card[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const MINUTE_MS = 30000;

  useEffect(() => {
    console.log("Running effect");
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.onstart = () => {
        console.log("Started recording");
        console.log(mediaRecorder.current?.state);
      };

      mediaRecorder.current.ondataavailable = async (event) => {
        console.log("Data available");
        console.log(mediaRecorder.current?.state);
        var chunks: Blob[] = [];
        chunks.push(event.data);

        const audioBlob = new Blob(chunks, { type: FileType.webm });

        const uploadedFileUrl = await LanternEngine.uploadFile(
          audioBlob,
          FileType.webm,
        );
        const response =
          await LanternEngine.getDeckFromLiveRecording(uploadedFileUrl);

        const json = await response.json();
        const deck = json.deck as Deck;

        setCards((oldCards) => [...oldCards, ...deck.cards]);
      };

      mediaRecorder.current.onstop = async () => {
        console.log("Stopped recording");
      };
    });
  }, []);

  const startRecording = () => {
    console.log("Start recording called");
    if (mediaRecorder) {
      mediaRecorder.current?.start();
      setIsRecording(true);
      setTimeout(() => {
        console.log("Timout over");
        if (mediaRecorder.current?.state == "recording") {
          console.log("Stopping & restarting");
          mediaRecorder.current?.stop();
          startRecording();
        }
      }, MINUTE_MS);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.current?.stop();
      setIsRecording(false);
    }
  };

  return (
    <CardBrowser 
    cards={cards} 
    title="Live session" 
    liveMode={true}
    onClose={() => {
      stopRecording();
      onClose?.();
    }}
    startRecording={startRecording} 
    stopRecording={stopRecording}/>
  );
}
