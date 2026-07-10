import React, { useState } from "react";
import { Project } from "../types";
import { 
  Sparkles, Plus, TrendingUp, BarChart2, Award, BookOpen, Clock, 
  ArrowUpRight, Edit, Trash2, CheckCircle2, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onAddProject: (project: Omit<Project, "id" | "wordCount" | "lastEdited">) => void;
  onDeleteProject: (id: string) => void;
}

export default function Dashboard({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onDeleteProject
}: DashboardProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [concept, setConcept] = useState("");
  const [summary, setSummary] = useState("");
  const [targetWords, setTargetWords] = useState(200000);
  const [coverColor, setCoverColor] = useState("from-indigo-950 via-slate-900 to-sky-950");

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // Calculate stats
  const totalWords = projects.reduce((sum, p) => sum + p.wordCount, 0);
  const totalBooks = projects.length;

  const coverColors = [
    { name: "紫霄星河", value: "from-indigo-950 via-slate-900 to-sky-950" },
    { name: "霓虹黑客", value: "from-zinc-900 via-purple-950 to-pink-950" },
    { name: "熔岩余烬", value: "from-amber-950 via-stone-900 to-red-950" },
    { name: "翡翠森林", value: "from-teal-950 via-slate-900 to-emerald-950" },
    { name: "深海潮汐", value: "from-blue-950 via-slate-900 to-indigo-950" }
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddProject({
      title,
      genre,
      concept,
      summary,
      targetWords: Number(targetWords),
      coverColor,
      coverIcon: genre.includes("科幻") || genre.includes("未来") ? "Cpu" : "Sparkles"
    });
    // Reset
    setTitle("");
    setGenre("");
    setConcept("");
    setSummary("");
    setTargetWords(200000);
    setCoverColor("from-indigo-950 via-slate-900 to-sky-950");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono tracking-widest text-indigo-600 uppercase font-bold">Loreflow Studio</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 mt-1">创作主页</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-full font-medium shadow-sm transition-all cursor-pointer"
        >
          <Plus size={14} />
          <span>新建作品</span>
        </motion.button>
      </div>

      {/* Writing Stats Card */}
      {activeProject && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_18px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={18} />
              <h2 className="text-sm font-semibold text-slate-800">当前写作进度</h2>
            </div>
            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded border border-indigo-100">
              目标: {activeProject.targetWords.toLocaleString()} 字
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {activeProject.wordCount.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 ml-1">字已撰写</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {Math.min(100, Math.round((activeProject.wordCount / activeProject.targetWords) * 100))}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (activeProject.wordCount / activeProject.targetWords) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-full"
              />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center">
              <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium">作品数量</p>
                <p className="text-sm font-bold font-mono text-slate-800 mt-0.5">{totalBooks} 本</p>
              </div>
              <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium">总字数</p>
                <p className="text-sm font-bold font-mono text-indigo-600 mt-0.5">{(totalWords / 10000).toFixed(1)}万字</p>
              </div>
              <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium">最近更新</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">{activeProject.lastEdited}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects List Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5">
          <BookOpen size={16} className="text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">我的作品库</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {projects.map((project, idx) => {
              const isActive = project.id === activeProjectId;
              const percentage = Math.min(100, Math.round((project.wordCount / project.targetWords) * 100));
              
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.25, 
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{ y: -3, scale: 1.005, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectProject(project.id)}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? "bg-white border-2 border-indigo-600 shadow-[0_12px_24px_rgba(99,102,241,0.06)] animate-none" 
                      : "bg-white border-slate-200/80 hover:border-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md"
                  }`}
                >
                <div className="flex p-4 gap-4">
                  {/* Book Cover */}
                  <div className={`w-20 h-28 rounded-lg bg-gradient-to-b ${project.coverColor} flex flex-col justify-between p-2 shadow-md relative shrink-0 border border-white/5`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[7px] tracking-widest uppercase text-slate-300 font-bold font-mono">VOL.1</span>
                      <Sparkles size={10} className="text-indigo-300 animate-pulse" />
                    </div>
                    <div className="text-center font-bold text-[9px] text-slate-100 font-sans tracking-wide leading-tight line-clamp-3">
                      {project.title.split(" (")[0]}
                    </div>
                    <div className="text-[6px] text-slate-300 font-mono text-center truncate">
                      {project.genre}
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-indigo-600 font-semibold tracking-wide">
                          {project.genre}
                        </span>
                        {isActive && (
                          <span className="text-[8px] bg-indigo-50 text-indigo-600 font-semibold px-1.5 py-0.5 rounded border border-indigo-100">
                            正在创作
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {project.concept}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock size={10} />
                        {project.lastEdited}更新
                      </span>
                      <span className="text-xs font-bold font-mono text-slate-700">
                        {(project.wordCount / 10000).toFixed(1)}万字
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar overlay at bottom of card */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>
      </div>

      {/* Writing Tips & Quotes (Inspirational Bento) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-indigo-50/40 border border-indigo-100/60 p-4 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="bg-indigo-100/50 w-8 h-8 rounded-xl flex items-center justify-center border border-indigo-200/20">
            <Award className="text-indigo-600" size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">写作者成就</h4>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal">解锁称号：‘初窥天轨’。连续写了2天，累计产出2220字。</p>
          </div>
        </div>

        <div className="bg-teal-50/40 border border-teal-100/60 p-4 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="bg-teal-100/50 w-8 h-8 rounded-xl flex items-center justify-center border border-teal-200/20">
            <Sparkles className="text-teal-600" size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">AI 创作灵感</h4>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal">在设定集或正文中点击‘AI助手’，极速获取设定灵感或情节续写。</p>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl overflow-hidden shadow-xl flex flex-col max-h-[85vh]"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <BookOpen size={16} className="text-indigo-600" />
                  新建灵感书籍
                </h3>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-mono text-xs cursor-pointer"
                >
                  关闭
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-4 space-y-4 overflow-y-auto flex-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">书名</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="请输入小说书名"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">题材/标签</label>
                  <input
                    type="text"
                    required
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="例如：科幻 / 赛博朋克 / 奇幻"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">核心一句话构想</label>
                  <input
                    type="text"
                    required
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="例如：被命运抛弃的少年重建群星天轨"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">故事简介</label>
                  <textarea
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="简短描述作品的背景设定与主要故事冲突..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">目标字数 ({targetWords.toLocaleString()} 字)</label>
                  <input
                    type="range"
                    min={50000}
                    max={1000000}
                    step={50000}
                    value={targetWords}
                    onChange={(e) => setTargetWords(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">选择封面颜色</label>
                  <div className="flex gap-2">
                    {coverColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setCoverColor(color.value)}
                        className={`w-6 h-8 rounded border transition-all ${
                          coverColor === color.value ? "border-indigo-600 scale-110 shadow-md" : "border-transparent"
                        } bg-gradient-to-b ${color.value}`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition-all cursor-pointer mt-2"
                >
                  创建并进入写作
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
