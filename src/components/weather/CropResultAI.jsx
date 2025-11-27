
// import React, { useEffect, useState } from "react";
// import Header from "../common/Header";

// export default function CropResultAI() {
//   const [lang, setLang] = useState("en");
//   const [location, setLocation] = useState(null);
//   const [english, setEnglish] = useState("");
//   const [nepali, setNepali] = useState("");

//   useEffect(() => {
//     setEnglish(sessionStorage.getItem("crop_EN"));
//     setNepali(sessionStorage.getItem("crop_NP"));

//     const loc = sessionStorage.getItem("location");
//     if (loc) setLocation(JSON.parse(loc));
//   }, []);

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6 mt-16">
//         <div className="max-w-3xl mx-auto">
          
//           <h1 className="text-3xl font-bold mb-4">AI Crop Assessment Result</h1>

//           {location && (
//             <p className="text-gray-700 mb-4">
//               <strong>Location:</strong> {location.name}
//             </p>
//           )}

//           {/* Language Toggle */}
//           <div className="flex gap-3 mb-4">
//             <button
//               onClick={() => setLang("en")}
//               className={`px-4 py-2 rounded-lg border ${
//                 lang === "en" ? "bg-green-600 text-white" : "bg-white"
//               }`}
//             >
//               English
//             </button>
//             <button
//               onClick={() => setLang("np")}
//               className={`px-4 py-2 rounded-lg border ${
//                 lang === "np" ? "bg-green-600 text-white" : "bg-white"
//               }`}
//             >
//               नेपाली
//             </button>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow border whitespace-pre-line">
//             {lang === "en" ? english : nepali}
//           </div>

//           <a
//             href="/weather-prediction"
//             className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded-lg"
//           >
//             Back
//           </a>
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import { Loader } from "lucide-react";

/**
 * Simple markdown-ish renderer:
 * - Lines starting with "### " → <h3>
 * - Lines starting with "-" or "*" → unordered list items
 * - Lines starting with "1." or "2." etc → ordered list items
 * - Blank-line separated paragraphs preserved
 * - Preserves inline bold/italic if present (simple **bold** handling)
 */
function renderModelText(text) {
  if (!text) return null;

  // Normalize line endings
  const normalized = text.replace(/\r\n/g, "\n").trim();

  // Split into blocks by two-or-more newlines (paragraph / block separator)
  const blocks = normalized.split(/\n{2,}/);

  return blocks.map((block, i) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return null;

    // Heading (###)
    if (/^#{3}\s+/.test(lines[0])) {
      const heading = lines[0].replace(/^#{3}\s+/, "");
      // the rest of the lines in this block could be a paragraph or list
      const rest = lines.slice(1).join("\n");
      return (
        <div key={i} className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{heading}</h3>
          {rest ? <div className="text-gray-700">{renderInlineAndLists(rest)}</div> : null}
        </div>
      );
    }

    // If the block looks like a list (starts with - or * or digits.)
    if (/^[-*]\s+/.test(lines[0]) || /^\d+\.\s+/.test(lines[0])) {
      // detect if it's ordered
      const isOrdered = /^\d+\.\s+/.test(lines[0]);
      const items = lines.map((ln) => ln.replace(/^[-*]\s+|^\d+\.\s+/, ""));
      return (
        <div key={i} className="mb-3">
          {isOrdered ? (
            <ol className="list-decimal list-inside text-gray-700">
              {items.map((it, idx) => (
                <li key={idx} className="mb-1">{renderInlineAndLists(it)}</li>
              ))}
            </ol>
          ) : (
            <ul className="list-disc list-inside text-gray-700">
              {items.map((it, idx) => (
                <li key={idx} className="mb-1">{renderInlineAndLists(it)}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    // Default: paragraph block (may contain multiple lines, join with space)
    const paragraph = lines.join(" ");
    return (
      <p key={i} className="text-gray-700 mb-3">
        {renderInlineAndLists(paragraph)}
      </p>
    );
  });
}

/** Simple inline formatter: replace **bold** with <strong> and `-` quotes unchanged */
function renderInlineAndLists(text) {
  if (!text) return null;
  // handle **bold** (simple)
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, idx) => {
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      return <strong key={idx} className="font-semibold">{boldMatch[1]}</strong>;
    }
    // preserve line breaks in inline segments (rare)
    return <span key={idx}>{part}</span>;
  });
}

export default function CropResultAI() {
  const [lang, setLang] = useState("en");
  const [location, setLocation] = useState(null);
  const [english, setEnglish] = useState("");
  const [nepali, setNepali] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const en = sessionStorage.getItem("crop_EN");
    const np = sessionStorage.getItem("crop_NP");
    const loc = sessionStorage.getItem("location");

    setEnglish(en ?? "");
    setNepali(np ?? "");
    if (loc) setLocation(JSON.parse(loc));

    // small UX: show spinner for at least 300ms so user sees action
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const displayText = lang === "en" ? english : nepali;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6 mt-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">AI Crop Assessment Result</h1>

          {location && (
            <p className="text-gray-700 mb-4">
              <strong>Location:</strong> {location.name}
            </p>
          )}

          {/* Language Toggle */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setLang("en")}
              className={`px-4 py-2 rounded-lg border ${lang === "en" ? "bg-green-600 text-white" : "bg-white"}`}
            >
              English
            </button>
            <button
              onClick={() => setLang("np")}
              className={`px-4 py-2 rounded-lg border ${lang === "np" ? "bg-green-600 text-white" : "bg-white"}`}
            >
              नेपाली
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader className="animate-spin" />
                <div className="text-gray-600">Loading result…</div>
              </div>
            ) : !displayText ? (
              <div className="text-gray-500">No AI result found. Please run the assessment again.</div>
            ) : (
              <div className="prose max-w-none">
                {renderModelText(displayText)}
              </div>
            )}
          </div>

          <a
            href="/weather"
            className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded-lg"
          >
            Back
          </a>
        </div>
      </div>
    </>
  );
}
