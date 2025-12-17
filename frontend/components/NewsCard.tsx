// "use client";
// import Image from "next/image";
// import SmartText from "@/components/SmartText";

// export interface NewsCardProps {
//   title: string;
//   description?: string;
//   url?: string;
//   urlToImage?: string;
//   source: string;
//   publishedAt?: string;
//   difficultWords?: { word: string; definition: string }[];
//   onOpen?: () => void;
// }

// export default function NewsCard({ title, description, urlToImage, source, publishedAt, difficultWords = [], onOpen }: NewsCardProps) {
//   const formattedDate = (() => {
//     if (!publishedAt) return "";
//     const date = new Date(publishedAt);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
//     if (diffHrs < 1) return "Just now";
//     if (diffHrs < 24) return `${diffHrs}h ago`;
//     const diffDays = Math.floor(diffHrs / 24);
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString();
//   })();

//   return (
//     <div className="bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-blue-500/40 relative hover:z-50 hover:scale-[1.01]">
//       <div className="flex flex-col">
//         {urlToImage ? (
//           <div className="relative w-full h-56 bg-gray-800 rounded-t-xl overflow-hidden">
//             <Image src={urlToImage} alt={title} fill className="object-cover" />
//           </div>
//         ) : (
//           <div className="w-full h-14 bg-gray-800 rounded-t-xl" />
//         )}
//         <div className="p-5">
//           <div className="flex items-center gap-2 mb-3">
//             <span className="text-xs font-semibold text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
//               {source || "Unknown Source"}
//             </span>
//             {formattedDate && <span className="text-xs text-gray-500">{formattedDate}</span>}
//           </div>
//           <h3 className="text-xl font-bold text-white mb-3 leading-tight">{title}</h3>
//           {(description || difficultWords.length > 0) && (
//             <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
//               <SmartText text={description || ""} difficultWords={difficultWords} />
//             </p>
//           )}
//           <button
//             className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
//             onClick={onOpen}
//           >
//             Read with AI
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";
// import Image from "next/image";
// import SmartText from "@/components/SmartText";

// export interface NewsCardProps {
//   title: string;
//   description?: string;
//   url?: string;
//   urlToImage?: string;
//   source: string;
//   publishedAt?: string;
//   difficultWords?: { word: string; definition: string }[];
//   onOpen?: () => void;
// }

// export default function NewsCard({ 
//   title, 
//   description, 
//   urlToImage, 
//   source, 
//   publishedAt, 
//   difficultWords = [], 
//   onOpen 
// }: NewsCardProps) {
  
//   const formattedDate = (() => {
//     if (!publishedAt) return "";
//     const date = new Date(publishedAt);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
//     if (diffHrs < 1) return "Just now";
//     if (diffHrs < 24) return `${diffHrs}h ago`;
    
//     const diffDays = Math.floor(diffHrs / 24);
//     if (diffDays < 7) return `${diffDays}d ago`;
    
//     return date.toLocaleDateString();
//   })();

//   return (
//     <div className="bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-blue-500/40 relative hover:z-50 hover:scale-[1.01]">
//       <div className="flex flex-col h-full">
//         {urlToImage ? (
//           <div className="relative w-full h-56 bg-gray-800 rounded-t-xl overflow-hidden">
//             <Image 
//               src={urlToImage} 
//               alt={title} 
//               fill 
//               className="object-cover" 
//               unoptimized // Added to prevent external image optimization errors
//             />
//           </div>
//         ) : (
//           <div className="w-full h-14 bg-gray-800 rounded-t-xl" />
//         )}
        
//         <div className="p-5 flex flex-col flex-grow">
//           <div className="flex items-center gap-2 mb-3">
//             <span className="text-xs font-semibold text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
//               {source || "Unknown Source"}
//             </span>
//             {formattedDate && <span className="text-xs text-gray-500">{formattedDate}</span>}
//           </div>
          
//           <h3 className="text-xl font-bold text-white mb-3 leading-tight">{title}</h3>
          
//           {(description || difficultWords.length > 0) && (
//             <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3 flex-grow">
//               <SmartText text={description || ""} difficultWords={difficultWords} />
//             </p>
//           )}
          
//           <button
//             className="mt-auto w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
//             onClick={onOpen}
//           >
//             Read with AI
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";
import Image from "next/image";
import { useState } from "react";
import SmartText from "@/components/SmartText";

export interface NewsCardProps {
  title: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  source: string;
  publishedAt?: string;
  difficultWords?: { word: string; definition: string }[];
  onOpen?: () => void;
}

export default function NewsCard({ 
  title, 
  description, 
  urlToImage, 
  source, 
  publishedAt, 
  difficultWords = [], 
  onOpen 
}: NewsCardProps) {
  
  const [imgSrc, setImgSrc] = useState(urlToImage);
  const [imgError, setImgError] = useState(false);

  const formattedDate = (() => {
    if (!publishedAt) return "";
    const date = new Date(publishedAt);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  })();

  return (
    // FIX: overflow-visible + relative to allow absolute tooltips to escape
    <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 flex flex-col h-full hover:border-blue-500/50 transition-all duration-300 relative group overflow-visible">
      
      {/* Image Section */}
      <div className="relative w-full h-48 bg-gray-800 rounded-t-xl overflow-hidden z-0">
        {!imgError && imgSrc ? (
          <Image 
            src={imgSrc} 
            alt={title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
            onError={() => { setImgError(true); }} 
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
            <span className="text-4xl">📰</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow relative">
        
        {/* Header (Date/Source) - Layer 0 */}
        <div className="flex items-center justify-between mb-3 relative z-0">
          <span className="text-xs font-bold text-blue-400 bg-blue-950/50 px-2 py-1 rounded border border-blue-900/50">
            {source || "News"}
          </span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>

        {/* Title - Layer 10 */}
        <h3 className="text-lg font-bold text-white mb-3 leading-snug line-clamp-2 relative z-10">
          {title}
        </h3>

        {/* Description - SABSE UPAR KA LAYER (z-50 se bhi zyada safe) */}
        {/* Tooltips ko guarantee se upar aane ke liye z-index badhaya + relative */}
        <div className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3 flex-grow relative z-50">
          {description && description !== "null" ? (
             <SmartText text={description} difficultWords={difficultWords} />
          ) : (
             <span className="italic text-gray-600">Preview unavailable.</span>
          )}
        </div>

        {/* Button - Layer 0 */}
        <button
          className="mt-auto w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-sm flex items-center justify-center gap-2 relative z-0"
          onClick={onOpen}
        >
          Read with AI
        </button>
      </div>
    </div>
  );
}