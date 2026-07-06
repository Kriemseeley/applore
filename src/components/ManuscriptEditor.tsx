import React, { useState, useEffect } from "react";
import { Chapter, Scene, CharacterLore, LocationLore, Project } from "../types";
import { 
  Plus, FileText, ChevronRight, ChevronDown, Check, Sparkles, BookOpen, 
  Trash2, Sliders, ArrowUpRight, AlignLeft, Send, CheckCircle2, Copy 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ManuscriptEditorProps {
  project: Project;
  chapters: Chapter[];
  characters: CharacterLore[];
  locations: LocationLore[];
  onAddChapter: (title: string) => void;
  onAddScene: (chapterId: string, title: string, summary: string) => void;
  onUpdateScene: (sceneId: string, updates: Partial<Scene>) => void;
  onDeleteScene: (sceneId: string) => void;
}

export default function ManuscriptEditor({
  project,
  chapters,
  characters,
  locations,
  onAddChapter,
  onAddScene,
  onUpdateScene,
  onDeleteScene
}: ManuscriptEditorProps) {
  // Navigation & Tree
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    "chap-1": true
  });
  const [activeSceneId, setActiveSceneId] = useState<string>("");
  const [showExplorer, setShowExplorer] = useState(true);

  // New item states
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [showAddScene, setShowAddScene] = useState<string | null>(null);
  const [newSceneTitle, setNewSceneTitle] = useState("");
  const [newSceneSummary, setNewSceneSummary] = useState("");

  // Editor states
  const [editorContent, setEditorContent] = useState("");
  const [editorTitle, setEditorTitle] = useState("");
  const [editorSummary, setEditorSummary] = useState("");
  const [lastSaved, setLastSaved] = useState<string>("");

  // Quick references and AI Assistant Panel
  const [showQuickInsert, setShowQuickInsert] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [selectedTask, setSelectedTask] = useState<"continue" | "polish" | "custom">("continue");

  // Get active scene
  const allScenes = chapters.flatMap(c => c.scenes);
  const activeScene = allScenes.find(s => s.id === activeSceneId) || allScenes[0];

  // Initialize editor with active scene
  useEffect(() => {
    if (activeScene) {
      setActiveSceneId(activeScene.id);
      setEditorContent(activeScene.content);
      setEditorTitle(activeScene.title);
      setEditorSummary(activeScene.summary);
      setLastSaved("");
    } else {
      setActiveSceneId("");
      setEditorContent("");
      setEditorTitle("");
      setEditorSummary("");
    }
  }, [activeScene?.id]);

  // Handle Manual Save
  const handleSave = () => {
    if (!activeSceneId) return;
    const currentCount = editorContent.replace(/\s+/g, "").length;
    onUpdateScene(activeSceneId, {
      content: editorContent,
      title: editorTitle,
      summary: editorSummary,
      wordCount: currentCount,
      lastEdited: "刚刚"
    });
    
    const now = new Date();
    setLastSaved(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`);
  };

  // Toggle chapter expansion
  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Quick insert character or location
  const handleInsertTag = (name: string, type: string) => {
    const textarea = document.getElementById("scene-textarea") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const tag = `[${type === "char" ? "角色" : "场景"}: ${name}]`;
    const newContent = editorContent.substring(0, start) + tag + editorContent.substring(end);
    setEditorContent(newContent);
    setShowQuickInsert(false);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 50);
  };

  // Call Express API for Gemini assistance
  const handleAIAssist = async () => {
    if (aiGenerating) return;
    setAiGenerating(true);
    setAiOutput("");
    setAiError("");

    try {
      const activeChapter = chapters.find(c => c.scenes.some(s => s.id === activeSceneId));
      
      let endpointType = "scene-assistant";
      let contextPayload: any = {
        projectSummary: project.summary,
        chapterTitle: activeChapter?.title || "未命名章节",
        sceneTitle: editorTitle,
        sceneSummary: editorSummary,
        content: editorContent
      };

      if (selectedTask === "continue") {
        endpointType = "scene-assistant";
        contextPayload.instruction = aiPrompt || "请根据场景概述和已写正文，流畅地续写下一个情节，突出环境烘托和心理活动。";
      } else if (selectedTask === "polish") {
        endpointType = "polish";
        contextPayload.content = editorContent;
        contextPayload.requirement = aiPrompt || "增强动作细节和感官描写，使文笔更加凝练和优美。";
      } else {
        endpointType = "custom";
        contextPayload.prompt = `我的小说叫《${project.title}》，这是一篇大纲如下：${project.summary}。目前在写：${editorTitle}。
        当前内容：
        """
        ${editorContent}
        """
        作者需求：${aiPrompt}`;
      }

      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: endpointType, context: contextPayload }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiOutput(data.text);
      } else {
        setAiError(data.error || "调用 AI 助手失败");
      }
    } catch (err: any) {
      setAiError("无法连接到服务端 AI 模块: " + err.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleApplyAIResult = () => {
    if (!aiOutput) return;
    if (selectedTask === "polish") {
      setEditorContent(aiOutput);
    } else {
      // Append for continue
      setEditorContent(prev => prev + "\n\n" + aiOutput);
    }
    setShowAIPanel(false);
    setAiOutput("");
    setAiPrompt("");
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;
    onAddChapter(newChapterTitle);
    setNewChapterTitle("");
    setShowAddChapter(false);
  };

  const handleCreateScene = (e: React.FormEvent, chapterId: string) => {
    e.preventDefault();
    if (!newSceneTitle.trim()) return;
    onAddScene(chapterId, newSceneTitle, newSceneSummary);
    setNewSceneTitle("");
    setNewSceneSummary("");
    setShowAddScene(null);
  };

  return (
    <div className="relative flex flex-col h-[82vh] border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
      {/* Upper Navigation Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50 p-1 justify-between items-center shrink-0">
        <div className="flex gap-1">
          <button
            onClick={() => setShowExplorer(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              showExplorer 
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/40" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            大纲目录
          </button>
          <button
            onClick={() => {
              if (activeScene) {
                setShowExplorer(false);
              }
            }}
            disabled={!activeScene}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !showExplorer 
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/40" 
                : "text-slate-500 hover:text-slate-800"
            } disabled:opacity-40`}
          >
            编辑正文
          </button>
        </div>

        {activeScene && (
          <div className="flex items-center gap-2 pr-2">
            <span className="text-[10px] font-mono text-slate-400">
              {lastSaved ? `已保存于 ${lastSaved}` : "有修改未保存"}
            </span>
            <button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold shadow-xs cursor-pointer"
            >
              保存正文
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden relative bg-white">
        {/* VIEW 1: Directory Explorer */}
        {showExplorer ? (
          <div className="w-full flex flex-col p-4 space-y-4 overflow-y-auto">
            {/* Project Header details */}
            <div className="p-3.5 bg-indigo-50/50 border border-indigo-100/60 rounded-xl flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{project.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">目标: {project.targetWords.toLocaleString()} 字</p>
              </div>
              <button
                onClick={() => setShowAddChapter(true)}
                className="flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-700 font-bold bg-indigo-100/50 border border-indigo-200/40 px-2.5 py-1 rounded-lg cursor-pointer transition-all"
              >
                <Plus size={10} />
                <span>分卷</span>
              </button>
            </div>

            {/* Tree */}
            <div className="space-y-3 flex-1 pb-16">
              {chapters.map((chapter) => {
                const isExpanded = expandedChapters[chapter.id];
                return (
                  <div key={chapter.id} className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/20">
                    {/* Chapter Header */}
                    <div 
                      onClick={() => toggleChapter(chapter.id)}
                      className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronDown size={14} className="text-indigo-600" /> : <ChevronRight size={14} className="text-slate-400" />}
                        <span className="text-xs font-bold text-slate-700">{chapter.title}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddScene(chapter.id);
                        }}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all"
                        title="添加场景"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Scene list */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-slate-100 bg-white"
                        >
                          <div className="p-1.5 space-y-1">
                            {chapter.scenes.length === 0 ? (
                               <p className="text-[10px] text-slate-400 p-2.5 text-center italic">暂无场景，点击右上角加号创建</p>
                            ) : (
                              chapter.scenes.map((scene) => {
                                const isSelected = scene.id === activeSceneId;
                                return (
                                  <div
                                    key={scene.id}
                                    onClick={() => {
                                      setActiveSceneId(scene.id);
                                      setShowExplorer(false);
                                    }}
                                    className={`flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer ${
                                      isSelected 
                                        ? "bg-indigo-50 border border-indigo-100/60 text-indigo-700 font-medium" 
                                        : "hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-transparent"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FileText size={12} className={isSelected ? "text-indigo-600" : "text-slate-400"} />
                                      <div className="truncate">
                                        <p className="text-xs font-semibold truncate">{scene.title}</p>
                                        <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{scene.summary || "无概述..."}</p>
                                      </div>
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-400 shrink-0 ml-2">
                                      {scene.wordCount} 字
                                    </span>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* VIEW 2: Distraction-free Scene Editor with serif layout */
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-white p-4 space-y-3 pb-20">
            {/* Header: Scene title inputs */}
            <div className="flex flex-col space-y-2 border-b border-slate-100 pb-3 shrink-0">
              <input
                type="text"
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
                placeholder="场景标题（例如：第一章：风暴前夕）"
                className="bg-transparent text-base font-bold text-slate-800 focus:outline-none placeholder:text-slate-300"
              />
              <input
                type="text"
                value={editorSummary}
                onChange={(e) => setEditorSummary(e.target.value)}
                placeholder="场景简短大纲概述（有利于 AI 进行剧情续写参考）..."
                className="bg-transparent text-xs text-slate-400 focus:outline-none placeholder:text-slate-300 line-clamp-1"
              />
            </div>

            {/* Core writing canvas - styled beautifully with Lora serif italic font */}
            <textarea
              id="scene-textarea"
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              placeholder="在这里落笔，撰写您的旷世巨作...支持快捷引用和 AI 创作辅助。"
              className="flex-1 bg-transparent text-[15px] leading-relaxed text-slate-800 focus:outline-none resize-none font-serif placeholder:text-slate-300 overflow-y-auto"
            />

            {/* Float helper toolbar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-400 text-xs shrink-0 bg-white">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium">
                  字数: {editorContent.replace(/\s+/g, "").length} 字
                </span>
                <span className="text-[9px] text-slate-400">
                  (500字起落提示)
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                {/* Quick Insert button */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowQuickInsert(!showQuickInsert);
                      setShowAIPanel(false);
                    }}
                    className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      showQuickInsert 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-medium" 
                        : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 shadow-3xs"
                    }`}
                  >
                    <span>快捷引用</span>
                  </button>

                  <AnimatePresence>
                    {showQuickInsert && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-10 right-0 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20"
                      >
                        <div className="p-2 border-b border-slate-100 bg-slate-50">
                          <p className="text-[10px] font-bold text-slate-500">点击在光标处插入标签</p>
                        </div>
                        <div className="max-h-48 overflow-y-auto p-1 space-y-1">
                          <div className="px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 uppercase tracking-wider">角色</div>
                          {characters.map(c => (
                            <button
                              key={c.id}
                              onClick={() => handleInsertTag(c.name.split(" (")[0], "char")}
                              className="w-full text-left px-2 py-1 text-xs hover:bg-slate-50 rounded text-slate-700 truncate cursor-pointer transition-all"
                            >
                              @{c.name.split(" (")[0]}
                            </button>
                          ))}
                          <div className="px-1.5 py-0.5 text-[9px] font-bold text-teal-600 uppercase tracking-wider mt-1">场景</div>
                          {locations.map(l => (
                            <button
                              key={l.id}
                              onClick={() => handleInsertTag(l.name.split(" (")[0], "loc")}
                              className="w-full text-left px-2 py-1 text-xs hover:bg-slate-50 rounded text-slate-700 truncate cursor-pointer transition-all"
                            >
                              #{l.name.split(" (")[0]}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* AI Assistant button */}
                <button
                  onClick={() => {
                    setShowAIPanel(!showAIPanel);
                    setShowQuickInsert(false);
                  }}
                  className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                    showAIPanel 
                      ? "bg-indigo-600 border-indigo-700 text-white shadow-xs" 
                      : "bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 shadow-3xs"
                  }`}
                >
                  <Sparkles size={11} className={showAIPanel ? "animate-spin" : "animate-pulse"} />
                  <span>AI 助手</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Add Chapter Modal */}
      <AnimatePresence>
        {showAddChapter && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 w-full max-w-xs rounded-2xl p-5 space-y-4 shadow-xl"
            >
              <h3 className="font-bold text-slate-800 text-sm">创建新分卷 / 卷章</h3>
              <form onSubmit={handleCreateChapter} className="space-y-3">
                <input
                  type="text"
                  required
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="例如：第一卷：熄灭的北极星"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddChapter(false)}
                    className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-600 transition-all"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-xs transition-all"
                  >
                    确认创建
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Add Scene Modal */}
      <AnimatePresence>
        {showAddScene && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 w-full max-w-xs rounded-2xl p-5 space-y-4 shadow-xl"
            >
              <h3 className="font-bold text-slate-800 text-sm">在该卷下创建新场景</h3>
              <form onSubmit={(e) => handleCreateScene(e, showAddScene)} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-semibold">章节名称</label>
                  <input
                    type="text"
                    required
                    value={newSceneTitle}
                    onChange={(e) => setNewSceneTitle(e.target.value)}
                    placeholder="第一章：星子陨落之夜"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-semibold">情节梗概/提纲 (AI辅助依据)</label>
                  <textarea
                    rows={2}
                    value={newSceneSummary}
                    onChange={(e) => setNewSceneSummary(e.target.value)}
                    placeholder="在此描述这一章主角要发生的事..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddScene(null)}
                    className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-600 transition-all"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-xs transition-all"
                  >
                    创建章节
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slide-out AI Panel Drawer */}
      <AnimatePresence>
        {showAIPanel && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] z-30 flex flex-col rounded-t-3xl max-h-[75%]"
          >
            {/* Grab handle bar */}
            <div className="w-full flex justify-center py-2 shrink-0">
              <div className="w-12 h-1 bg-slate-200 rounded-full" />
            </div>

            <div className="px-4 pb-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm">Loreflow AI 写作协同</h3>
              </div>
              <button
                onClick={() => setShowAIPanel(false)}
                className="text-slate-400 hover:text-slate-600 font-mono text-xs cursor-pointer"
              >
                关闭
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1 pb-20">
              {/* Task Tabs */}
              <div className="flex bg-slate-100 border border-slate-200/40 rounded-xl p-1 text-center text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTask("continue");
                    setAiOutput("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${
                    selectedTask === "continue" ? "bg-white text-indigo-600 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  续写下文
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTask("polish");
                    setAiOutput("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${
                    selectedTask === "polish" ? "bg-white text-indigo-600 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  精修润色
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTask("custom");
                    setAiOutput("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${
                    selectedTask === "custom" ? "bg-white text-indigo-600 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  自由发散
                </button>
              </div>

              {/* Requirements prompt */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-semibold">
                  {selectedTask === "continue" && "写作者意志（告诉 AI 接下来怎么发展，或留空让 AI 自由发挥）"}
                  {selectedTask === "polish" && "润色风格（华丽动作描写、情感细腻渲染、环境烘托、悬疑冷酷）"}
                  {selectedTask === "custom" && "问问 AI 该如何丰富这个场景的冲突？"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder={
                      selectedTask === "continue" 
                        ? "例：主角使用星能抵抗强风，法警围攻..." 
                        : selectedTask === "polish"
                        ? "例：提升文字感官描写，突出岩浆荒原的极度干燥"
                        : "例：请提出3个让姬晚月与陆沉关系加速升温的小细节"
                    }
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white placeholder:text-slate-300"
                  />
                  <button
                    onClick={handleAIAssist}
                    disabled={aiGenerating}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1 shrink-0 disabled:opacity-40 cursor-pointer transition-all"
                  >
                    {aiGenerating ? "生成中..." : "生成"}
                    <Send size={10} />
                  </button>
                </div>
              </div>

              {/* Error block */}
              {aiError && (
                <div className="p-3 bg-red-50 border border-red-100 text-[11px] text-red-600 rounded-lg leading-normal">
                  {aiError}
                </div>
              )}

              {/* Output area */}
              {aiOutput && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl shadow-inner"
                >
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2">
                    <span className="text-[10px] text-indigo-600 font-bold tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      AI 协同生成完毕
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(aiOutput)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="复制到剪贴板"
                    >
                      <Copy size={11} />
                    </button>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap font-sans">
                    {aiOutput}
                  </div>
                  <button
                    onClick={handleApplyAIResult}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition-all mt-2 cursor-pointer shadow-xs"
                  >
                    {selectedTask === "polish" ? "直接替换原文" : "追加插入正文末尾"}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
