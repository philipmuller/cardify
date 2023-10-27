"use client"

import { Card } from "../../deck/card-model";
import { getDeck } from "../../deck/deck-creator-service";
import CardBrowser from "../../deck/components/card-browser";
import { useState, useEffect, useRef } from "react";
import { Record, Pause } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function LiveView() {

    const [cards, setCards] = useState<Card[]>([]);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    //let chunks: Blob[] = [];

    const mediaRecorder = useRef<MediaRecorder | null>(null);

    const MINUTE_MS = 30000;

    useEffect(() => {
        console.log('Running effect');
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.onstart = () => {
                console.log('Started recording');
                console.log(mediaRecorder.current?.state);
            }

            mediaRecorder.current.ondataavailable = (event) => {
                console.log('Data available');
                console.log(mediaRecorder.current?.state);
                var chunks: Blob[] = [];
                chunks.push(event.data);

                const audioBlob = new Blob(chunks, { type: 'audio/webm' });

                try {
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = async () => {
                        const rawBase64data = reader.result as string;
                        const base64dataComponents = rawBase64data.split(",");
                        var base64data = base64dataComponents[base64dataComponents.length - 1];
                        /* if (base64data[0] == "+") {
                            base64data = base64data.substring(1);
                        } */
                        //base64data = headers + base64data;
                        const deck = await getDeck(base64data, true);
                        console.log("Setting cards...");
                        setCards((oldCards) => [...oldCards, ...deck.cards]);
                    }

                } catch (err) {
                    console.log(err);
                }
            }

            mediaRecorder.current.onstop = async () => {
                console.log('Stopped recording');
            }
        });

    }, [])

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
        <>
            <button className="flex flex-col justify-center items-center" onClick={isRecording ? stopRecording : startRecording}>
                { isRecording ? <Record size={28} color="#ba1717" weight="fill" className="animate-pulse"/> : <Pause size={28} color="#57534e" weight="fill" /> }
                <p className="text-stone-600 text-lg">{isRecording ? "Listening" : "Listening paused"}</p>
            </button>
            { (cards.length > 0) ? <CardBrowser cards={cards} liveMode={true}/> : <></> }
        </>
    )

}