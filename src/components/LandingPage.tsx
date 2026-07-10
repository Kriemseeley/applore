import React, { useState, useEffect } from "react";
import { 
  Sparkles, BookOpen, Clock, Link2, Sliders, ChevronRight, 
  LogIn, User, LogOut, ArrowRight, Quote, RefreshCw, PenTool, Database
} from "lucide-react";
import { motion } from "motion/react";
import { Project, CharacterLore, LocationLore, ItemLore, FactionLore } from "../types";

interface LandingPageProps {
  projects: Project[];
  characters: CharacterLore[];
  locations: LocationLore[];
  items: ItemLore[];
  factions: FactionLore[];
  isLoggedIn: boolean;
  currentUser: { name: string; avatarColor: string; role: string; email: string } | null;
  onEnterWorkspace: () => void;
  onGoToLogin: () => void;
  onLogout: () => void;
}

// Famous inspirational writer quotes for extra flavor and charm
const WRITING_QUOTES = [
  { text: "每一个庞大的玄幻世界，都始于一个不经意的名字与惊鸿一瞥。", author: "LoreFlow 灵感漫步" },
  { text: "伏笔要像冬日藏于雪下的种子，在最不经意的春雨中惊雷般绽放。", author: "网文白金秘籍" },
  { text: "时空如网，人物为梭。织出的不仅是剧情，更是角色的宿命。", author: "大纲架构论" },
  { text: "好的设定是小说的骨骼，而流淌在字里行间的细节则是它的血肉。", author: "世界设定集" },
  { text: "写作者是文字的星宿师，在寂静的夜里，将零星的线索连缀成璀璨的星空。", author: "陆沉 · 星宿遗卷" }
];

export default function LandingPage({
  projects,
  characters,
  locations,
  items,
  factions,
  isLoggedIn,
  currentUser,
  onEnterWorkspace,
  onGoToLogin,
  onLogout
}: LandingPageProps) {
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Compute stats
  const totalProjects = projects.length;
  const totalWordCount = projects.reduce((sum, p) => sum + (p.wordCount || 0), 0);
  const totalLores = characters.length + locations.length + items.length + factions.length;

  // Auto rotate quote
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % WRITING_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNextQuote = () => {
    setQuoteIdx(prev => (prev + 1) % WRITING_QUOTES.length);
  };

  return (
    <div className="flex flex-col justify-center min-h-full space-y-7 pb-12 px-1 text-center">
      {/* Top Welcome / Profile Header - Balanced and Elegant */}
      <div className="flex flex-col items-center justify-center space-y-3 pt-2">
        <div className="flex items-center gap-2 justify-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-xs">
            LF
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-slate-700">LOREFLOW V1.2</span>
        </div>

        {isLoggedIn && currentUser ? (
          <div className="inline-flex items-center gap-2 bg-slate-100/90 py-1 px-3 rounded-full border border-slate-200 shadow-2xs">
            <div className={`w-5 h-5 rounded-full ${currentUser.avatarColor} text-white flex items-center justify-center text-[9px] font-bold`}>
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left shrink-0">
              <p className="text-[10px] font-bold text-slate-800 leading-none">{currentUser.name}</p>
            </div>
            <button 
              onClick={onLogout}
              className="text-slate-400 hover:text-red-500 transition-colors ml-1 p-0.5 cursor-pointer"
              title="登出账号"
            >
              <LogOut size={11} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onGoToLogin}
            className="inline-flex items-center justify-center gap-1.5 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100/60 text-indigo-700 px-4 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
          >
            <LogIn size={11} />
            <span>登录创作账号</span>
          </button>
        )}
      </div>

      {/* Hero Visual Card - Centered with Golden-ratio Balance */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 text-white p-6 shadow-xl border border-indigo-900/50 flex flex-col items-center text-center">
        {/* Subtle background cosmic decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl" />

        <div className="space-y-4 relative z-10 w-full max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/20 text-indigo-300 text-[9px] font-bold tracking-wider uppercase mx-auto">
            <Sparkles size={10} />
            <span>长篇网络文学重构工作台</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-serif font-bold tracking-wide leading-relaxed text-indigo-50">
              研墨造万象，<br />
              落笔定乾坤。
            </h1>
            <p className="text-[10px] text-indigo-200/85 leading-relaxed max-w-[90%] mx-auto font-sans">
              LoreFlow 专为长篇网络文学打造。将宏大的世界设定、交织的人物纽带与多线时空时序精妙串联，在沉浸式的指尖书案上，构筑属于你的万象宇宙。
            </p>
          </div>

          {/* CTA Area */}
          <div className="pt-2 flex flex-col gap-2.5 w-full max-w-[240px] mx-auto">
            <button
              onClick={onEnterWorkspace}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-950/40 hover:shadow-lg transition-all cursor-pointer group"
            >
              <span>{isLoggedIn ? "步入创作书案" : "无鉴权快速试笔"}</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Inspirational Quotes Carousel Widget - Centered Classic Parchment-Like dark space */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-indigo-900/30 shadow-md relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
        <div className="relative z-10 space-y-3 w-full">
          <div className="flex items-center justify-between w-full border-b border-white/5 pb-2">
            <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
              <Quote size={8} />
              作手斋心灵感
            </span>
            <button 
              onClick={handleNextQuote}
              className="text-indigo-400 hover:text-white transition-colors cursor-pointer p-0.5"
              title="叩问新句"
            >
              <RefreshCw size={10} />
            </button>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed font-serif italic max-w-[90%] mx-auto">
            “ {WRITING_QUOTES[quoteIdx].text} ”
          </p>
          <p className="text-[8px] text-slate-400 text-right pr-2">
            —— {WRITING_QUOTES[quoteIdx].author}
          </p>
        </div>
      </div>

      {/* Tech Specifications / Writing Motto */}
      <div className="pt-2 text-center w-full">
        <p className="text-[10px] text-slate-400 font-serif italic tracking-wider">
          “ 研墨执笔，构筑心中璀璨星河。 ”
        </p>
      </div>
    </div>
  );
}
