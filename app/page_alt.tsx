"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import Spline, { SplineEvent } from '@splinetool/react-spline';
import { Application } from "@splinetool/runtime";

export default function Home() {
  const [text, setText] = useState("");
  const spline = useRef<Application>();

  function onLoad(sApp: Application) {
    spline.current = sApp;
  }

  function triggerAnimation() {
    spline.current?.emitEvent('keyDown', 'primary left');
  }


  return (
    <main className="flex min-h-screen flex-col p-24">
      <div>
        <Spline scene="https://prod.spline.design/WqXlO6Dy6yFlXu04/scene.splinecode" 
        onLoad={onLoad}
        />
        <button onClick={() => triggerAnimation()}>Click me</button>
      </div>
    </main>
  );
}