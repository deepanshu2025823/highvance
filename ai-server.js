// ai-server.js
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenerativeAI } from '@google/generative-ai'; 
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const PORT = 3001; 
const wss = new WebSocketServer({ port: PORT });
const prisma = new PrismaClient(); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", 
    systemInstruction: "You are a highly efficient, conversational AI Assistant for Highvance CRM. Keep your answers under 2 sentences. Speak naturally, without markdown, emojis, or lists. Your goal is to see if they want to book an appointment."
});

console.log(`\n🚀 HIGHVANCE Enterprise AI Engine (GEMINI FLASH) running on ws://localhost:${PORT}\n`);

wss.on('connection', (clientWs) => {
    console.log('📡 Highvance Enterprise AI Engine: New Browser Client Connected.');
    const callStartTime = Date.now();

    const deepgramUrl = `wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&endpointing=500&interim_results=true&vad_events=true`;
    
    const deepgramWs = new WebSocket(deepgramUrl, {
        headers: { Authorization: `Token ${process.env.DEEPGRAM_API_KEY}` } 
    });

    const cartesiaUrl = `wss://api.cartesia.ai/tts/websocket?api_key=${process.env.CARTESIA_API_KEY}&cartesia_version=2024-06-10`;
    const cartesiaWs = new WebSocket(cartesiaUrl);

    let chatSession = aiModel.startChat({ history: [] });
    let conversationHistory = []; 

    let isDeepgramReady = false;
    let isCartesiaReady = false;

    const deepgramKeepAlive = setInterval(() => {
        if (deepgramWs.readyState === WebSocket.OPEN) {
            deepgramWs.send(JSON.stringify({ type: 'KeepAlive' }));
        }
    }, 5000);

    const checkReadyStatus = () => {
        if (isDeepgramReady && isCartesiaReady && clientWs.readyState === WebSocket.OPEN) {
            console.log('✅ ALL SYSTEMS GO! Sending ready signal to browser...');
            clientWs.send(JSON.stringify({ type: "system", message: "ready" }));
        }
    };

    deepgramWs.on('open', () => {
        console.log('✅ DEEPGRAM: Listening...');
        isDeepgramReady = true;
        checkReadyStatus();
    });

    cartesiaWs.on('open', () => {
        console.log('✅ CARTESIA: Ready to Speak...');
        isCartesiaReady = true;
        checkReadyStatus();
    });

    deepgramWs.on('error', (error) => console.error('\n❌ DEEPGRAM ERROR:', error.message));

    clientWs.on('message', (data, isBinary) => {
        if (isBinary && deepgramWs.readyState === WebSocket.OPEN) {
            deepgramWs.send(data); 
        }
    });

    deepgramWs.on('message', async (data) => {
        try {
            const rawString = data.toString();
            const response = JSON.parse(rawString);
            
            if (response.type === "Metadata") {
                console.log(`🔊 [DEEPGRAM]: Stream metadata accepted.`);
            } else if (response.type === "SpeechStarted") {
                console.log(`\n🗣️ [VAD]: Human speech detected!`);
            } else if (response.type === "Error") {
                console.error(`❌ [DEEPGRAM API ERROR]:`, response);
            }

            const transcript = response.channel?.alternatives?.[0]?.transcript;

            if (transcript && !response.is_final) {
                process.stdout.write(`\r🎙️ Hearing: ${transcript}`); 
            }

            if (transcript && transcript.trim().length > 0 && response.is_final) {
                console.log(`\n\n👤 [LEAD]: ${transcript}`);
                conversationHistory.push(`Lead: ${transcript}`);

                if (clientWs.readyState === WebSocket.OPEN) {
                    clientWs.send(JSON.stringify({ type: "transcript", role: "user", text: transcript }));
                }

                console.log(`🧠 [GEMINI]: Processing...`);
                
                try {
                    const aiResponse = await chatSession.sendMessage(transcript);
                    const aiText = aiResponse.response.text();
                    
                    console.log(`🤖 [AGENT]: ${aiText}`);
                    conversationHistory.push(`Agent: ${aiText}`);

                    if (clientWs.readyState === WebSocket.OPEN) {
                        clientWs.send(JSON.stringify({ type: "transcript", role: "ai", text: aiText }));
                    }

                    if (cartesiaWs.readyState === WebSocket.OPEN) {
                        const cartesiaRequest = {
                            model_id: "sonic-english",
                            transcript: aiText,
                            voice: { mode: "id", id: "a0e99841-438c-4a64-b6a9-ae082236224c" },
                            output_format: { container: "raw", encoding: "pcm_f32le", sample_rate: 16000 }
                        };
                        cartesiaWs.send(JSON.stringify(cartesiaRequest));
                    }
                } catch (geminiError) {
                    console.error("\n❌ [GEMINI ERROR]:", geminiError);
                }
            }
        } catch (error) {
        }
    });

    cartesiaWs.on('message', (data) => {
        try {
            const response = JSON.parse(data.toString());
            if (response.type === "chunk" && response.data) {
                if (clientWs.readyState === WebSocket.OPEN) {
                    clientWs.send(JSON.stringify({ type: "audio", audioBase64: response.data }));
                }
            }
        } catch (error) {
        }
    });

    clientWs.on('close', async () => {
        console.log('\n\n🔌 Highvance Enterprise AI Engine: Call Terminated.');
        clearInterval(deepgramKeepAlive);
        if (deepgramWs.readyState === WebSocket.OPEN) deepgramWs.close();
        if (cartesiaWs.readyState === WebSocket.OPEN) cartesiaWs.close();

        if (conversationHistory.length > 0) { 
            console.log(`⏱️ Commencing Post-Call Analysis via Gemini...`);
            try {
                const analysisModel = genAI.getGenerativeModel({ 
                    model: "gemini-2.5-flash",
                    generationConfig: { responseMimeType: "application/json" }
                });

                const prompt = `Analyze this conversation. Return a strict JSON object. Structure: {"result": "appointment_booked" | "not_interested" | "follow_up_required", "reason": "Brief summary", "tags": ["tag1", "tag2"], "memory_context": "Details to remember"}\n\nConversation:\n${conversationHistory.join('\n')}`;

                const analysisResponse = await analysisModel.generateContent(prompt);
                const analysisData = JSON.parse(analysisResponse.response.text());
                
                console.log(`📊 Analysis Complete:`, analysisData);

            } catch (err) {
                console.error(`\n❌ Post-Call Analysis Failed:`, err);
            }
        } else {
             console.log(`ℹ️ Call was too short to analyze.`);
        }
    });
});