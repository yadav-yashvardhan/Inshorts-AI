// "use client";
// import { useEffect, useState } from "react";
// import AIAnalystSidebar from "@/components/AIAnalystSidebar";
// import SmartText from "@/components/SmartText";
// import Image from "next/image";
// // Imports ke baad aur main function se pehle ye paste karein:

// interface Article {
//   _id?: string;
//   title: string;
//   description?: string;
//   content?: string;
//   urlToImage?: string;
//   source: { id?: string | null; name: string };
//   publishedAt: string;
//   difficultWords: { word: string; definition: string }[];
// }

// export default function Page() {
//   const [activeArticle, setActiveArticle] = useState<Article | null>(null);
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const run = async () => {
//       setLoading(true);
//       try {
//         await fetch("http://localhost:4000/api/news/sync");
//       } catch {}
//       try {
//         const res = await fetch("http://localhost:4000/api/news/all");
//         const data = await res.json();
//         setArticles(Array.isArray(data) ? data : []);
//       } catch {}
//       setLoading(false);
//     };
//     run();
//   }, []);

//   const NewsCard = ({ a }: { a: Article }) => (
//     <div className="border rounded p-4 flex gap-4">
//       {a.urlToImage && (
//         <Image src={a.urlToImage} alt={a.title || ""} width={128} height={96} className="object-cover rounded" />
//       )}
//       <div className="flex-1">
//         <h3 className="font-medium">{a.title}</h3>
//         <p className="text-sm text-neutral-700">
//           <SmartText text={a.description || a.content || ""} difficultWords={a.difficultWords ?? ([] as { word: string; definition: string }[])} />
//         </p>
//         <div className="mt-2">
//           <button
//             className="px-3 py-1 rounded bg-black text-white"
//             onClick={() => setActiveArticle(a)}
//           >
//             AI Analyst
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <main className="min-h-screen p-6 space-y-4">
//       <h1 className="text-2xl font-semibold">Inshorts AI</h1>
//       {loading && <p>Loading latest headlines…</p>}
//       {!loading && articles.length === 0 && <p>No articles available.</p>}
//       <div className="grid gap-4">
//         {articles.map((a, i) => (
//           <NewsCard key={a._id || i.toString()} a={a} />
//         ))}
//       </div>

//       {activeArticle && (
//         <AIAnalystSidebar article={activeArticle} onClose={() => setActiveArticle(null)} />
//       )}
//     </main>
//   );
// }


// "use client";
// import { useEffect, useState } from "react";
// import AIAnalystSidebar from "@/components/AIAnalystSidebar";
// import NewsCard from "@/components/NewsCard";

// interface Article {
//   _id?: string;
//   title: string;
//   description?: string;
//   content?: string;
//   url?: string;
//   urlToImage?: string;
//   source: { id?: string | null; name: string };
//   publishedAt: string;
//   difficultWords: { word: string; definition: string }[];
// }

// export default function Page() {
//   const [activeArticle, setActiveArticle] = useState<Article | null>(null);
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchNews = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch("http://localhost:4000/api/news/top-headlines");
//         if (!res.ok) throw new Error("Failed to load news");
//         const data = await res.json();
//         const items: NewsAPIArticle[] = Array.isArray(data?.articles) ? data.articles : [];
//         const mapped: Article[] = items.map((a) => ({
//           _id: undefined,
//           title: a.title || "Untitled",
//           description: a.description || "",
//           content: a.content || "",
//           url: a.url || "",
//           urlToImage: a.urlToImage || undefined,
//           source: { id: a.source?.id ?? null, name: a.source?.name ?? "Unknown" },
//           publishedAt: a.publishedAt || new Date().toISOString(),
//           difficultWords: [],
//         }));
//         setArticles(mapped);
//       } catch (e) {
//         const msg = e instanceof Error ? e.message : "Unable to fetch news";
//         setError(msg);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNews();
//   }, []);

//   const renderCard = (a: Article, i: number) => (
//     <NewsCard
//       key={a._id || i.toString()}
//       title={a.title}
//       description={a.description}
//       url={a.url}
//       urlToImage={a.urlToImage}
//       source={a.source?.name ?? "Unknown"}
//       publishedAt={a.publishedAt}
//       difficultWords={a.difficultWords}
//       onOpen={() => setActiveArticle(a)}
//     />
//   );

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
//       {/* Header */}
//       <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-lg">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-md">
//                 <span className="text-white font-bold text-xl">I</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//                   Inshorts AI
//                 </h1>
//                 <p className="text-xs text-gray-500">Stay informed, stay ahead</p>
//               </div>
//             </div>

//             {!loading && articles.length > 0 && (
//               <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-950 rounded-lg border border-purple-800">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm font-medium text-gray-300">
//                   {articles.length} stories
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
//         {error && !loading && (
//           <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700 text-red-200">
//             {error}
//           </div>
//         )}
//         {loading && (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-16 h-16 border-4 border-purple-900 border-t-purple-500 rounded-full animate-spin mb-4"></div>
//             <p className="text-gray-400 font-medium">Loading latest headlines...</p>
//           </div>
//         )}

//         {!loading && articles.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
//               <span className="text-4xl">📰</span>
//             </div>
//             <p className="text-gray-400 font-medium">No articles available at the moment.</p>
//             <p className="text-sm text-gray-600 mt-2">Check back later for updates</p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {articles.map(renderCard)}
//         </div>
//       </div>

//       {activeArticle && (
//         <AIAnalystSidebar
//           article={activeArticle}
//           onClose={() => setActiveArticle(null)}
//         />
//       )}
//     </main>
//   );
// }
//   type NewsAPIArticle = {
//     title?: string;
//     description?: string;
//     content?: string;
//     url?: string;
//     urlToImage?: string;
//     source?: { id?: string | null; name?: string };
//     publishedAt?: string;
//   };



// "use client";
// import { useEffect, useState } from "react";
// import AIAnalystSidebar from "@/components/AIAnalystSidebar";
// import NewsCard from "@/components/NewsCard";

// // Types definition
// type NewsAPIArticle = {
//   title?: string;
//   description?: string;
//   content?: string;
//   url?: string;
//   urlToImage?: string;
//   source?: { id?: string | null; name?: string };
//   publishedAt?: string;
// };

// interface Article {
//   _id?: string;
//   title: string;
//   description?: string;
//   content?: string;
//   url?: string;
//   urlToImage?: string;
//   source: { id?: string | null; name: string };
//   publishedAt: string;
//   difficultWords: { word: string; definition: string }[];
// }

// export default function Page() {
//   const [activeArticle, setActiveArticle] = useState<Article | null>(null);
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchNews = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch("http://localhost:4000/api/news/top-headlines");
//         if (!res.ok) throw new Error("Failed to load news");
        
//         const data = await res.json();
//         const items: NewsAPIArticle[] = Array.isArray(data?.articles) ? data.articles : [];
        
//         const mapped: Article[] = items.map((a) => ({
//           _id: undefined,
//           title: a.title || "Untitled",
//           description: a.description || "",
//           content: a.content || "",
//           url: a.url || "",
//           urlToImage: a.urlToImage || undefined,
//           source: { id: a.source?.id ?? null, name: a.source?.name ?? "Unknown" },
//           publishedAt: a.publishedAt || new Date().toISOString(),
//           difficultWords: [],
//         }));
        
//         // Removed removed articles
//         const validArticles = mapped.filter(a => a.title !== "[Removed]");
//         setArticles(validArticles);

//       } catch (e) {
//         const msg = e instanceof Error ? e.message : "Unable to fetch news";
//         setError(msg);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchNews();
//   }, []);

//   const renderCard = (a: Article, i: number) => (
//     <NewsCard
//       key={a._id || i.toString()}
//       title={a.title}
//       description={a.description}
//       url={a.url}
//       urlToImage={a.urlToImage}
//       source={a.source.name}
//       publishedAt={a.publishedAt}
//       difficultWords={a.difficultWords}
//       onOpen={() => setActiveArticle(a)}
//     />
//   );

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black font-sans">
//       {/* Header */}
//       <div className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-lg">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-md">
//                 <span className="text-white font-bold text-xl">I</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//                   Inshorts AI
//                 </h1>
//                 <p className="text-xs text-gray-500">Stay informed, stay ahead</p>
//               </div>
//             </div>

//             {!loading && articles.length > 0 && (
//               <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-950 rounded-lg border border-purple-800">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm font-medium text-gray-300">
//                   {articles.length} stories
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
//         {error && !loading && (
//           <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700 text-red-200">
//             {error}
//           </div>
//         )}
        
//         {loading && (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-16 h-16 border-4 border-purple-900 border-t-purple-500 rounded-full animate-spin mb-4"></div>
//             <p className="text-gray-400 font-medium">Loading latest headlines...</p>
//           </div>
//         )}

//         {!loading && articles.length === 0 && !error && (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
//               <span className="text-4xl">📰</span>
//             </div>
//             <p className="text-gray-400 font-medium">No articles available at the moment.</p>
//             <p className="text-sm text-gray-600 mt-2">Check back later for updates</p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {articles.map(renderCard)}
//         </div>
//       </div>

//       {activeArticle && (
//         <AIAnalystSidebar
//           article={activeArticle}
//           onClose={() => setActiveArticle(null)}
//         />
//       )}
//     </main>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import AIAnalystSidebar from "@/components/AIAnalystSidebar";
import NewsCard from "@/components/NewsCard";

// Types definition to match Backend Response
type NewsAPIArticle = {
  title?: string;
  description?: string;
  content?: string;
  url?: string;
  urlToImage?: string;
  source?: { id?: string | null; name?: string };
  publishedAt?: string;
  difficultWords?: { word: string; definition: string }[]; // <--- Yeh zaroori hai
};

interface Article {
  _id?: string;
  title: string;
  description?: string;
  content?: string;
  url?: string;
  urlToImage?: string;
  source: { id?: string | null; name: string };
  publishedAt: string;
  difficultWords: { word: string; definition: string }[];
}

export default function Page() {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:4000/api/news/top-headlines");
        if (!res.ok) throw new Error("Failed to load news");
        
        const data = await res.json();
        const items: NewsAPIArticle[] = Array.isArray(data?.articles) ? data.articles : [];
        
        // MAPPING LOGIC (Yahan fix kiya hai)
        const mapped: Article[] = items.map((a) => ({
          _id: undefined,
          title: a.title || "Untitled",
          description: a.description || "",
          content: a.content || "",
          url: a.url || "",
          urlToImage: a.urlToImage || undefined,
          source: { id: a.source?.id ?? null, name: a.source?.name ?? "Unknown" },
          publishedAt: a.publishedAt || new Date().toISOString(),
          
          // --- THE FIX IS HERE ---
          // Backend se aaye hue words use karo, warna empty array
          difficultWords: a.difficultWords || [], 
        }));
        
        const validArticles = mapped.filter(a => a.title !== "[Removed]");
        setArticles(validArticles);

      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unable to fetch news";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  const renderCard = (a: Article, i: number) => (
    <NewsCard
      key={a._id || i.toString()}
      title={a.title}
      description={a.description}
      url={a.url}
      urlToImage={a.urlToImage}
      source={a.source.name}
      publishedAt={a.publishedAt}
      difficultWords={a.difficultWords} // Card ko pass kar rahe hain
      onOpen={() => setActiveArticle(a)}
    />
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black font-sans">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Inshorts AI
                </h1>
                <p className="text-xs text-gray-500">Stay informed, stay ahead</p>
              </div>
            </div>

            {!loading && articles.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-950 rounded-lg border border-purple-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-300">
                  {articles.length} stories
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-purple-900 border-t-purple-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium">Analyzing news & definitions...</p>
          </div>
        )}

        {!loading && articles.length > 0 && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {articles.map(renderCard)}
           </div>
        )}
      </div>

      {activeArticle && (
        <AIAnalystSidebar
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
        />
      )}
    </main>
  );
}