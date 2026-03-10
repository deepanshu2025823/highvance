// app/agents/test/page.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMicrophone, faStop, faWaveSquare, faServer, 
  faWifi, faEraser
} from "@fortawesome/free-solid-svg-icons";

export default function VoiceTestPage() {
  const [connectionState, setConnectionState] = useState<"disconnected" | "connecting" | "active">("disconnected");
  const [transcript, setTranscript] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const playAudioChunk = (base64Data: string) => {
    if (!audioContextRef.current) return;
    try {
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }
      
      const audioBuffer = audioContextRef.current.createBuffer(1, float32Array.length, 16000);
      audioBuffer.getChannelData(0).set(float32Array);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      const currentTime = audioContextRef.current.currentTime;
      if (currentTime < nextPlayTimeRef.current) {
        source.start(nextPlayTimeRef.current);
        nextPlayTimeRef.current += audioBuffer.duration;
      } else {
        source.start(currentTime);
        nextPlayTimeRef.current = currentTime + audioBuffer.duration;
      }
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  };

  const startListening = async () => {
    try {
      setConnectionState("connecting");
      setTranscript(prev => prev + "\n[SYSTEM]: Requesting microphone access...");

      const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
          } 
      });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      nextPlayTimeRef.current = audioContextRef.current.currentTime;
      
      setTranscript(prev => prev + "\n[SYSTEM]: Syncing with Deepgram, Gemini & Cartesia...");
      
      const socket = new WebSocket('ws://localhost:3001');
      socket.binaryType = "arraybuffer"; 

      socket.onopen = () => {
      };

      socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === "system" && message.message === "ready") {
          setConnectionState("active");
          setTranscript(prev => prev + "\n[SYSTEM]: Uplink Established. AI Engine Active. Speak now...\n");
          
          let mimeType = 'audio/webm';
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
               mimeType = 'audio/webm;codecs=opus';
          }
          
          mediaRecorder.current = new MediaRecorder(stream, { mimeType: mimeType });
          
          mediaRecorder.current.ondataavailable = async (e) => {
            if (e.data.size > 0 && socket.readyState === WebSocket.OPEN) {
              console.log("🎤 Audio chunk generated:", e.data.size, "bytes");
              const arrayBuffer = await e.data.arrayBuffer();
              socket.send(arrayBuffer); 
            }
          };
          mediaRecorder.current.start(250); 
        }
        else if (message.type === "transcript") {
          const prefix = message.role === "ai" ? "🤖 [AGENT]:" : "👤 [LEAD]:";
          setTranscript(prev => prev + `\n${prefix} ${message.text}\n`);
        } 
        else if (message.type === "audio") {
          playAudioChunk(message.audioBase64);
        }
      };

      socket.onclose = () => {
        setConnectionState("disconnected");
        setTranscript(prev => prev + "\n\n[SYSTEM]: Uplink Terminated.");
      };

      socket.onerror = (error) => {
        setConnectionState("disconnected");
        setTranscript(prev => prev + "\n[ERROR]: Connection failed.");
      };

      socketRef.current = socket;

    } catch (err) {
      setConnectionState("disconnected");
      setTranscript(prev => prev + "\n[ERROR]: Microphone access denied by Windows/Chrome.");
    }
  };

  const stopListening = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setConnectionState("disconnected");
    mediaRecorder.current?.stream.getTracks().forEach(track => track.stop());
  };

  const clearTranscript = () => setTranscript("");

  return (
    <div className="min-h-screen flex bg-[#0f172a] font-sans relative overflow-hidden flex-col md:flex-row text-slate-300">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8 relative z-10 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full space-y-6">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-2xl">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                <FontAwesomeIcon icon={faServer} className="text-blue-500" />
                Live AI Orchestration
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Full-Duplex Voice Engine</p>
            </div>
            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest border ${
              connectionState === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
              connectionState === "connecting" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
              "bg-slate-800 text-slate-500 border-slate-700"
            }`}>
              <FontAwesomeIcon icon={faWifi} className={connectionState === "connecting" ? "animate-pulse" : ""} />
              {connectionState}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col h-[400px]">
            <div className="bg-slate-950 px-6 py-4 flex justify-between items-center border-b border-slate-800">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <button onClick={clearTranscript} className="text-[10px] text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                <FontAwesomeIcon icon={faEraser} /> Clear Console
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap custom-scrollbar">
              {transcript || "Waiting for orchestration initialization..."}
              {connectionState === "active" && (
                <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse align-middle"></span>
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={connectionState === "active" || connectionState === "connecting" ? stopListening : startListening}
              className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 text-sm ${
                connectionState === "active" || connectionState === "connecting" 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
                : 'bg-blue-600 text-white shadow-xl hover:bg-blue-500 shadow-blue-600/20 border border-blue-500'
              }`}
            >
              <FontAwesomeIcon icon={connectionState === "active" ? faStop : faMicrophone} className={connectionState === "active" ? "animate-pulse" : ""} />
              {connectionState === "active" ? "Terminate Uplink" : connectionState === "connecting" ? "Connecting..." : "Initialize Voice Link"}
            </button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
}