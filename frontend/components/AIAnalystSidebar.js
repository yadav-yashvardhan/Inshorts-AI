// "use client";
// import { useEffect, useMemo, useRef, useState } from "react";

// export default function AIAnalystSidebar({ article, onClose }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [usedVoice, setUsedVoice] = useState(false);
//   const [speaking, setSpeaking] = useState(false);
//   const containerRef = useRef(null);
//   const listRef = useRef(null);

//   const contextText = useMemo(() => {
//     if (!article) return "";
//     return (
//       article.content || article.text || article.description || article.title || ""
//     );
//   }, [article]);

//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.classList.remove("translate-x-full");
//     }
//   }, []);

//   useEffect(() => {
//     if (listRef.current) {
//       listRef.current.scrollTop = listRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const speak = (text) => {
//     if (!text) return;
//     const synth = window.speechSynthesis;
//     if (!synth) return;
//     const utter = new SpeechSynthesisUtterance(text);
//     utter.onend = () => setSpeaking(false);
//     setSpeaking(true);
//     synth.cancel();
//     synth.speak(utter);
//   };

//   const stopSpeaking = () => {
//     const synth = window.speechSynthesis;
//     if (!synth) return;
//     synth.cancel();
//     setSpeaking(false);
//   };

//   const send = async (question, mode = "default") => {
//     const q = (question || input).trim();
//     if (!q && mode === "default") return;
//     const nextMessages = [...messages, { role: "user", content: q || mode }];
//     setMessages(nextMessages);
//     setInput("");
//     try {
//       const res = await fetch("http://localhost:4000/api/chat/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question: q, context: contextText, mode }),
//       });
//       const data = await res.json();
//       let aiText = "";
//       if (mode === "bias") {
//         aiText = `Bias Score: ${data.score} (${data.label})\n${data.rationale || data.analysis || ""}`;
//       } else {
//         aiText = data.answer || "";
//       }
//       setMessages((prev) => [...prev, { role: "ai", content: aiText }]);
//       if (usedVoice && aiText) speak(aiText);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { role: "ai", content: "Error contacting AI Analyst server." },
//       ]);
//     }
//   };

//   const startListening = () => {
//     const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SR) return;
//     const rec = new SR();
//     rec.lang = "en-US";
//     rec.continuous = false;
//     rec.interimResults = false;
//     setIsListening(true);
//     setUsedVoice(true);
//     rec.onresult = (e) => {
//       const t = Array.from(e.results)
//         .map((r) => r[0].transcript)
//         .join(" ");
//       setInput(t);
//     };
//     rec.onend = () => {
//       setIsListening(false);
//       send(input, "voice");
//     };
//     rec.onerror = () => setIsListening(false);
//     rec.start();
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="fixed top-0 right-0 h-screen w-full md:w-1/2 bg-background shadow-xl border-l border-neutral-200 z-50 transform translate-x-full transition-transform duration-300"
//     >
//       <div className="flex items-center justify-between p-4 border-b">
//         <div className="flex gap-2">
//           <button
//             onClick={() => send("Bias Check", "bias")}
//             className="px-3 py-1 rounded bg-neutral-100 hover:bg-neutral-200"
//           >
//             📉 Bias Check
//           </button>
//           <button
//             onClick={() => send("Explain Like I’m 5", "eli5")}
//             className="px-3 py-1 rounded bg-neutral-100 hover:bg-neutral-200"
//           >
//             👶 Explain Like I’m 5
//           </button>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={startListening}
//             className={`px-3 py-1 rounded ${isListening ? "bg-red-500 text-white" : "bg-neutral-100 hover:bg-neutral-200"}`}
//           >
//             🎙 Mic
//           </button>
//           {speaking && (
//             <button
//               onClick={stopSpeaking}
//               className="px-3 py-1 rounded bg-neutral-100 hover:bg-neutral-200"
//             >
//               ⏹ Stop Speaking
//             </button>
//           )}
//           <button
//             onClick={onClose}
//             className="px-3 py-1 rounded bg-neutral-100 hover:bg-neutral-200"
//           >
//             ✖
//           </button>
//         </div>
//       </div>

//       <div ref={listRef} className="p-4 overflow-y-auto h-[calc(100vh-200px)] space-y-3">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={
//               m.role === "user"
//                 ? "max-w-[80%] ml-auto rounded-lg bg-blue-100 text-blue-900 p-3"
//                 : "max-w-[80%] mr-auto rounded-lg bg-neutral-100 text-neutral-900 p-3"
//             }
//           >
//             {m.content}
//           </div>
//         ))}
//       </div>

//       <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
//         <div className="flex gap-2">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask a question about this article..."
//             className="flex-1 px-3 py-2 rounded border"
//           />
//           <button
//             onClick={() => send(input, "default")}
//             className="px-4 py-2 rounded bg-black text-white"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useMemo, useRef, useState } from "react";

export default function AIAnalystSidebar({ article, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [usedVoice, setUsedVoice] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const contextText = useMemo(() => {
    if (!article) return "";
    return article.url || article.content || article.text || article.description || article.title || "";
  }, [article]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.remove("translate-x-full");
    }
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = (text) => {
    if (!text) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => setSpeaking(false);
    setSpeaking(true);
    synth.cancel();
    synth.speak(utter);
  };

  const stopSpeaking = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    setSpeaking(false);
  };

  const send = async (question, mode = "default") => {
    const q = (question || input).trim();
    if (!q && mode === "default") return;
    const nextMessages = [...messages, { role: "user", content: q || mode }];
    setMessages(nextMessages);
    setInput("");
    try {
      const res = await fetch("http://localhost:4000/api/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context: contextText, mode, title: article?.title || "", description: article?.description || "" }),
      });
      const data = await res.json();
      let aiText = "";
      if (mode === "bias") {
        aiText = `Bias Score: ${data.score} (${data.label})\n${data.rationale || data.analysis || ""}`;
      } else {
        aiText = data.answer || "";
      }
      setMessages((prev) => [...prev, { role: "ai", content: aiText }]);
      if (usedVoice && aiText) speak(aiText);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error contacting AI Analyst server." },
      ]);
    }
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    setIsListening(true);
    setUsedVoice(true);
    rec.onresult = (e) => {
      const t = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setInput(t);
    };
    rec.onend = () => {
      setIsListening(false);
      send(input, "voice");
    };
    rec.onerror = () => setIsListening(false);
    rec.start();
  };

  return (
    <div
      ref={containerRef}
      className="fixed top-0 right-0 h-screen w-full md:w-1/2 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 backdrop-blur-sm shadow-2xl border-l border-purple-200 z-50 transform translate-x-full transition-transform duration-300"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 p-5 border-b border-purple-200/50 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🤖</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">AI Analyst</h2>
              <p className="text-xs text-gray-500">Powered by Claude</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <span className="text-gray-600 text-lg">✕</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => send("Bias Check", "bias")}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 hover:from-orange-200 hover:to-orange-100 text-orange-700 font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <span className="text-base">📉</span>
            Bias Check
          </button>
          <button
            onClick={() => send("Explain Like I'm 5", "eli5")}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-100 to-green-50 hover:from-green-200 hover:to-green-100 text-green-700 font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <span className="text-base">👶</span>
            ELI5
          </button>
          <button
            onClick={startListening}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 ${
              isListening 
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse" 
                : "bg-gradient-to-r from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 text-blue-700"
            }`}
          >
            <span className="text-base">🎙</span>
            {isListening ? "Listening..." : "Voice"}
          </button>
          {speaking && (
            <button
              onClick={stopSpeaking}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 text-purple-700 font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span className="text-base">⏹</span>
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={listRef} 
        className="p-5 overflow-y-auto h-[calc(100vh-250px)] space-y-4 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
              <span className="text-4xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Start a Conversation
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Ask me anything about this article, or try one of the quick actions above
            </p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                m.role === "user"
                  ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              {m.role === "ai" && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">🤖</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">AI Analyst</span>
                </div>
              )}
              <div className={`text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "text-white" : "text-gray-700"}`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-purple-200/50 bg-white/80 backdrop-blur-md">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && send(input, "default")}
            placeholder="Ask anything about this article..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors text-sm bg-white shadow-sm"
          />
          <button
            onClick={() => send(input, "default")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>Send</span>
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
