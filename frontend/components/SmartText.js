// import React from 'react';

// /**
//  * @param {Object} props
//  * @param {string} props.text
//  * @param {Array<{word: string, definition: string}>} [props.difficultWords]
//  */
// export default function SmartText({ text, difficultWords }) {
//   // Fallback: Agar difficultWords undefined ho toh empty array use karein
//   const words = difficultWords || [];

//   if (!words.length) return <>{text}</>;

//   // Regex banayein matching words ke liye
//   const regex = new RegExp(`\\b(${words.map(w => w.word).join('|')})\\b`, 'gi');
//   const parts = text.split(regex);

//   return (
//     <>
//       {parts.map((part, i) => {
//         const match = words.find(w => w.word.toLowerCase() === part.toLowerCase());
//         if (match) {
//           return (
//             <span key={i} className="relative group cursor-help border-b-2 border-dashed border-gray-400">
//               {part}
//               {/* Tooltip */}
//               <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
//                 {match.definition}
//               </span>
//             </span>
//           );
//         }
//         return part;
//       })}
//     </>
//   );
// }

// import React from 'react';

// /**
//  * @param {Object} props
//  * @param {string} props.text
//  * @param {Array<{word: string, definition: string}>} [props.difficultWords]
//  */
// export default function SmartText({ text, difficultWords }) {
//   const words = difficultWords || [];

//   if (!words.length) return <>{text}</>;

//   const regex = new RegExp(`\\b(${words.map(w => w.word).join('|')})\\b`, 'gi');
//   const parts = text.split(regex);

//   return (
//     <>
//       {parts.map((part, i) => {
//         const match = words.find(w => w.word.toLowerCase() === part.toLowerCase());
//         if (match) {
//           return (
//             <span key={i} className="relative group cursor-help border-b-2 border-dashed border-purple-400 text-purple-200">
//               {part}
              
//               {/* TOOLTIP FIX: Added !bg-white and !text-black to force visibility */}
//               <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 !bg-white !text-black text-sm font-medium rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999] border border-gray-200 block text-left leading-normal">
                
//                 {/* Little Arrow */}
//                 <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white"></span>
                
//                 <span className="block mb-1 text-purple-700 font-bold text-xs uppercase tracking-wider">
//                   Meaning:
//                 </span>
//                 {match.definition}
//               </span>
//             </span>
//           );
//         }
//         return part;
//       })}
//     </>
//   );
// }


"use client";
import React, { useMemo } from "react";

export default function SmartText({ text, difficultWords }) {
  if (!text) return null;

  const activeWords = useMemo(() => {
    // Backend words priority
    if (difficultWords && difficultWords.length > 0) return difficultWords;

    // Fallback Frontend words
    const words = text.split(/\s+/);
    const longWords = words
      .map((w) => w.replace(/[^a-zA-Z]/g, ""))
      .filter((w) => w.length > 6)
      .slice(0, 3);

    return [...new Set(longWords)].map((w) => ({
      word: w,
      definition: "Key concept found in this context.",
    }));
  }, [text, difficultWords]);

  if (!activeWords || activeWords.length === 0) return <span>{text}</span>;

  const pattern = new RegExp(
    `\\b(${activeWords.map((w) => w.word).join("|")})\\b`,
    "gi"
  );
  
  const parts = text.split(pattern);

  return (
    <span>
      {parts.map((part, index) => {
        const matchedDef = activeWords.find(
          (w) => w.word.toLowerCase() === part.toLowerCase()
        );

        if (matchedDef) {
          return (
            <span
              key={index}
              className="relative group/word cursor-help text-purple-400 font-bold border-b-2 border-dotted border-purple-500 hover:text-purple-300 transition-colors inline-block mx-1"
            >
              {part}

              {/* TOOLTIP BOX */}
              {/* bottom-full: Word ke Upar khulega */}
              {/* mb-1: Thoda gap */}
              {/* w-48: Fixed width taaki card se bahar na bhage */}
              <span className="invisible group-hover/word:visible opacity-0 group-hover/word:opacity-100 transition-all duration-200 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-48 bg-white p-3 rounded-lg shadow-2xl border border-gray-200 z-[999] text-left">
                
                {/* Heading (Black Text) */}
                <span className="block text-purple-700 font-bold text-sm mb-1 capitalize border-b border-gray-200 pb-1">
                  {matchedDef.word}
                </span>
                
                {/* Definition (Black Text - Forced) */}
                <span className="block text-xs text-black leading-snug font-medium">
                  {matchedDef.definition || "Definition loading..."}
                </span>

                {/* Arrow */}
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-t-white"></span>
              </span>
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}