import React, { useState, useEffect } from "react";
import { 
  Project, Chapter, Scene, CharacterLore, LocationLore, ItemLore, FactionLore, 
  TimelineEvent, StoryArc, LoreType 
} from "./types";
import { 
  getLoreflowData, saveAllLoreflowData, generateId 
} from "./data";
import Dashboard from "./components/Dashboard";
import ManuscriptEditor from "./components/ManuscriptEditor";
import LoreDatabase from "./components/LoreDatabase";
import TimelineView from "./components/TimelineView";
import RelationsView from "./components/RelationsView";
import FrameworkHub from "./components/FrameworkHub";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import { 
  Home, BookOpen, Sparkles, Clock, Link2, Sliders, 
  Moon, Sun, Compass, Smartphone, User, Star, LogIn, LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type TabType = "projects" | "write" | "lore" | "timeline" | "relations" | "framework";

export default function App() {
  // App state
  const [data, setData] = useState(() => getLoreflowData());
  const [activeProjectId, setActiveProjectId] = useState<string>("proj-1");
  const [activeTab, setActiveTab] = useState<TabType>("projects");

  // Navigation & Authentication states
  const [viewMode, setViewMode] = useState<"landing" | "login" | "workspace">( () => {
    const saved = localStorage.getItem("loreflow_view_mode");
    return (saved as "landing" | "login" | "workspace") || "landing";
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("loreflow_is_logged_in") === "true";
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; avatarColor: string; role: string; email: string } | null>(() => {
    const saved = localStorage.getItem("loreflow_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Device-Mock frame wrapper toggler (to look like an actual smartphone on desktop viewports)
  const [isMobilePreviewMode, setIsMobilePreviewMode] = useState(true);

  // Auto-save state to Local Storage whenever data updates
  useEffect(() => {
    saveAllLoreflowData(data);
  }, [data]);

  // Keep viewMode and auth synced in localStorage
  useEffect(() => {
    localStorage.setItem("loreflow_view_mode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem("loreflow_is_logged_in", String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("loreflow_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("loreflow_user");
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: { name: string; avatarColor: string; role: string; email: string }) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setViewMode("landing"); // back to landing with active login badge
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setViewMode("landing");
  };

  const activeProject = data.projects.find(p => p.id === activeProjectId) || data.projects[0];
  const projectChapters = data.chapters.filter(c => c.projectId === activeProjectId);

  // Handlers for Project/Novel Management
  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setActiveTab("projects");
  };

  const handleAddProject = (newProject: Omit<Project, "id" | "wordCount" | "lastEdited">) => {
    const id = generateId();
    const createdProject: Project = {
      ...newProject,
      id,
      wordCount: 0,
      lastEdited: "刚刚"
    };

    // Auto-create initial placeholder chapter and scene so the book is writeable
    const firstChapterId = "chap-" + generateId();
    const firstSceneId = "scene-" + generateId();
    const defaultChapter: Chapter = {
      id: firstChapterId,
      projectId: id,
      title: "第一卷：序章与起点",
      order: 1,
      scenes: [
        {
          id: firstSceneId,
          chapterId: firstChapterId,
          title: "第一章：无光之隙",
          summary: "主角在此处开始了他宏大的旅程。",
          content: "这是新小说开启的第一行文字。点击右下角的‘AI 助手’，输入构想让智能助手协助你撰写正文吧！",
          wordCount: 32,
          lastEdited: "刚刚",
          order: 1,
          status: "draft"
        }
      ]
    };

    setData(prev => ({
      ...prev,
      projects: [createdProject, ...prev.projects],
      chapters: [...prev.chapters, defaultChapter]
    }));
    setActiveProjectId(id);
    setActiveTab("write");
  };

  const handleDeleteProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      chapters: prev.chapters.filter(c => c.projectId !== id)
    }));
    if (activeProjectId === id) {
      const nextProj = data.projects.find(p => p.id !== id);
      setActiveProjectId(nextProj ? nextProj.id : "");
    }
  };

  // Handlers for Chapter & Scene (Writing area)
  const handleAddChapter = (title: string) => {
    const newChapter: Chapter = {
      id: "chap-" + generateId(),
      projectId: activeProjectId,
      title,
      order: projectChapters.length + 1,
      scenes: []
    };
    setData(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
  };

  const handleAddScene = (chapterId: string, title: string, summary: string) => {
    const newScene: Scene = {
      id: "scene-" + generateId(),
      chapterId,
      title,
      summary,
      content: `这是《${title}》的新草稿。你可以通过输入正文或使用右下角的 AI 写作助手快速启动你的场景描述。`,
      wordCount: 45,
      lastEdited: "刚刚",
      order: 1,
      status: "draft"
    };

    setData(prev => {
      const updatedChapters = prev.chapters.map(chap => {
        if (chap.id === chapterId) {
          return {
            ...chap,
            scenes: [...chap.scenes, newScene]
          };
        }
        return chap;
      });
      return { ...prev, chapters: updatedChapters };
    });
  };

  const handleUpdateScene = (sceneId: string, updates: Partial<Scene>) => {
    setData(prev => {
      let wordCountDelta = 0;
      const updatedChapters = prev.chapters.map(chap => {
        const hasScene = chap.scenes.some(s => s.id === sceneId);
        if (hasScene) {
          const updatedScenes = chap.scenes.map(sc => {
            if (sc.id === sceneId) {
              if (updates.wordCount !== undefined) {
                wordCountDelta = updates.wordCount - sc.wordCount;
              }
              return { ...sc, ...updates };
            }
            return sc;
          });
          return { ...chap, scenes: updatedScenes };
        }
        return chap;
      });

      // Update total words in active project as well
      const updatedProjects = prev.projects.map(proj => {
        if (proj.id === activeProjectId) {
          return {
            ...proj,
            wordCount: Math.max(0, proj.wordCount + wordCountDelta),
            lastEdited: "刚刚"
          };
        }
        return proj;
      });

      return {
        ...prev,
        chapters: updatedChapters,
        projects: updatedProjects
      };
    });
  };

  const handleDeleteScene = (sceneId: string) => {
    setData(prev => {
      const updatedChapters = prev.chapters.map(chap => {
        return {
          ...chap,
          scenes: chap.scenes.filter(s => s.id !== sceneId)
        };
      });
      return { ...prev, chapters: updatedChapters };
    });
  };

  // Handlers for Worldbuilding (Lore DB)
  const handleAddCharacter = (character: Omit<CharacterLore, "id">) => {
    const newChar: CharacterLore = {
      ...character,
      id: "char-" + generateId()
    };
    setData(prev => ({
      ...prev,
      characters: [...prev.characters, newChar]
    }));
  };

  const handleAddLocation = (location: Omit<LocationLore, "id">) => {
    const newLoc: LocationLore = {
      ...location,
      id: "loc-" + generateId()
    };
    setData(prev => ({
      ...prev,
      locations: [...prev.locations, newLoc]
    }));
  };

  const handleAddItem = (item: Omit<ItemLore, "id">) => {
    const newItem: ItemLore = {
      ...item,
      id: "item-" + generateId()
    };
    setData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleAddFaction = (faction: Omit<FactionLore, "id">) => {
    const newFact: FactionLore = {
      ...faction,
      id: "fact-" + generateId()
    };
    setData(prev => ({
      ...prev,
      factions: [...prev.factions, newFact]
    }));
  };

  const handleUpdateCharacterBackstory = (id: string, backstory: string) => {
    setData(prev => ({
      ...prev,
      characters: prev.characters.map(c => c.id === id ? { ...c, backstory } : c)
    }));
  };

  const handleUpdateLocationHistory = (id: string, history: string) => {
    setData(prev => ({
      ...prev,
      locations: prev.locations.map(l => l.id === id ? { ...l, history } : l)
    }));
  };

  const handleDeleteLore = (type: LoreType, id: string) => {
    setData(prev => {
      if (type === "character") {
        return { ...prev, characters: prev.characters.filter(c => c.id !== id) };
      } else if (type === "location") {
        return { ...prev, locations: prev.locations.filter(l => l.id !== id) };
      } else if (type === "item") {
        return { ...prev, items: prev.items.filter(i => i.id !== id) };
      } else {
        return { ...prev, factions: prev.factions.filter(f => f.id !== id) };
      }
    });
  };

  // Handlers for Timeline Events
  const handleAddTimelineEvent = (event: Omit<TimelineEvent, "id">) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: "time-" + generateId()
    };
    setData(prev => ({
      ...prev,
      timeline: [...prev.timeline, newEvent]
    }));
  };

  const handleDeleteTimelineEvent = (id: string) => {
    setData(prev => ({
      ...prev,
      timeline: prev.timeline.filter(t => t.id !== id)
    }));
  };

  // Handlers for Relationships
  const handleAddRelationship = (
    sourceId: string, 
    targetId: string, 
    label: string, 
    type: "ally" | "enemy" | "love" | "neutral"
  ) => {
    setData(prev => {
      // Find source character and add relationship
      const updatedCharacters = prev.characters.map(char => {
        if (char.id === sourceId) {
          const exists = char.relationships.some(r => r.targetId === targetId);
          if (exists) {
            // Update existing
            return {
              ...char,
              relationships: char.relationships.map(r => r.targetId === targetId ? { ...r, label, type } : r)
            };
          } else {
            // Add new
            return {
              ...char,
              relationships: [...char.relationships, { targetId, label, type }]
            };
          }
        }
        return char;
      });
      return { ...prev, characters: updatedCharacters };
    });
  };

  const handleDeleteRelationship = (sourceId: string, targetId: string) => {
    setData(prev => ({
      ...prev,
      characters: prev.characters.map(char => {
        if (char.id === sourceId) {
          return {
            ...char,
            relationships: char.relationships.filter(r => r.targetId !== targetId)
          };
        }
        return char;
      })
    }));
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-800 flex flex-col md:flex-row font-sans selection:bg-indigo-500/10 overflow-x-hidden antialiased">
      {/* Soft elegant radial background underlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/10 via-slate-100/50 to-[#F3F4F6] z-0" />

      {/* Desktop sidebar info panel with premium Geometric Balance styling */}
      <div className="hidden md:flex flex-col md:w-80 border-r border-slate-200/80 bg-white p-6 justify-between shrink-0 z-10 relative shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/10 text-base">
              LF
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-tight leading-tight">Loreflow Mobile</h2>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Writer's Mobile Companion</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Real-time Author Account Identity Card */}
            <div className="p-4 rounded-2xl border border-slate-150 bg-slate-50/80 space-y-2.5">
              <span className="text-[9px] font-bold text-indigo-600 tracking-wider uppercase block">云端创作通道</span>
              {isLoggedIn && currentUser ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${currentUser.avatarColor} text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0`}>
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                      <p className="text-[9px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setViewMode("workspace")} 
                      className="flex-1 py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold text-center cursor-pointer transition-all shadow-xs"
                    >
                      进入工作台
                    </button>
                    <button 
                      onClick={handleLogout} 
                      className="py-1.5 px-2 bg-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                    >
                      登出
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 leading-normal">
                    当前正以<b>游客身份</b>体验。登录创作者云可开启多端备份与协同创作功能。
                  </p>
                  <button 
                    onClick={() => setViewMode("login")} 
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-[10px] font-bold cursor-pointer transition-all shadow-xs"
                  >
                    <LogIn size={11} />
                    <span>立即登录创作者账号</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-4.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/40 space-y-2">
              <span className="text-[9px] font-bold text-indigo-600 tracking-wider uppercase">Virtual Simulator</span>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                这套原型专门适配<b>手机移动端</b>（竖向小屏布局）。您可以使用右侧虚拟手机体验流畅的移动化码字与卡片世界设定。
              </p>
            </div>

            {/* Native App Spec Fast Toggler */}
            <button
              onClick={() => {
                setViewMode("workspace");
                setActiveTab("framework");
              }}
              className={`w-full p-4 rounded-2xl border text-left transition-all hover:bg-slate-50/60 relative overflow-hidden group cursor-pointer ${
                viewMode === "workspace" && activeTab === "framework"
                  ? "bg-indigo-50/60 border-indigo-200 shadow-sm"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <Sliders className="text-indigo-600 shrink-0 mt-0.5 group-hover:rotate-12 transition-transform duration-300" size={16} />
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-indigo-600 tracking-wider uppercase">Native App Spec</span>
                  <h4 className="text-xs font-bold text-slate-800">查看原生架构与设计逻辑</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    内置 iOS/Android SwiftUI 与 Jetpack Compose 原生映射与交互。
                  </p>
                </div>
              </div>
            </button>

            {/* Simulated Specs */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] font-mono space-y-2 text-slate-500">
              <p className="flex justify-between"><span>设备模式：</span><span className="text-slate-800 font-medium">Responsive Phone</span></p>
              <p className="flex justify-between"><span>云端同步：</span><span className={isLoggedIn ? "text-emerald-600 font-bold" : "text-slate-400 font-medium"}>{isLoggedIn ? "Cloud Synchronized" : "Local Mode"}</span></p>
              <p className="flex justify-between"><span>AI 引擎：</span><span className="text-indigo-600 font-semibold">Gemini 3.5 Flash</span></p>
              <p className="flex justify-between"><span>本地缓存：</span><span className="text-emerald-600 font-semibold">LocalStorage Active</span></p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
            Loreflow-Writer 是一个面向网络文学创作者的世界设定、情节大纲以及智能写作协同工具。此版完美重塑其核心视觉层级。
          </p>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>© 2026 Loreflow</span>
            <span>v1.2.0-phone</span>
          </div>
        </div>
      </div>

      {/* CORE MOBILE SHELL FRAME (Centered, simulating an elegant smartphone experience) */}
      <div className="flex-1 flex justify-center items-center z-10 relative py-0 md:py-6 bg-slate-100/30">
        
        {/* Device Container */}
        <div className={`w-full max-w-md bg-white md:border-[8px] md:border-slate-900 rounded-none md:rounded-[44px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] relative overflow-hidden flex flex-col h-screen md:h-[90vh] ${
          isMobilePreviewMode ? "md:ring-1 md:ring-slate-900/10" : ""
        }`}>
          
          {/* Simulated Mobile Camera Notch on Desktop Viewport */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-slate-900 rounded-b-xl z-50 pointer-events-none" />

          {/* Simulated Mobile Status bar at the top on Desktop view */}
          <div className="hidden md:flex justify-between items-center px-6 pt-3.5 pb-2.5 bg-white border-b border-slate-100 text-[10px] text-slate-500 font-mono select-none shrink-0 z-20">
            <span className="font-semibold text-slate-700">09:41</span>
            <div className="flex items-center gap-1 font-bold text-[9px] text-indigo-600 tracking-wider">
              <span>● LOREFLOW COMPANION</span>
            </div>
            <div className="flex gap-1.5 items-center text-slate-600">
              <span>5G</span>
              <div className="w-5 h-2.5 rounded border border-slate-300 p-0.5 flex items-center">
                <div className="bg-indigo-600 h-full rounded-2xs w-3/4" />
              </div>
            </div>
          </div>

          {/* Main App Content Container with light aesthetic background */}
          <div className="flex-1 overflow-y-auto px-4 pt-5 pb-24 relative bg-slate-50/70 scrollbar-none">
            {viewMode === "workspace" && (
              <div className="absolute top-4 right-4 z-50">
                <button
                  onClick={() => setViewMode("landing")}
                  className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-white/95 hover:bg-white border border-slate-200/80 hover:border-indigo-200 text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-all cursor-pointer shadow-xs backdrop-blur-xs"
                >
                  <Home size={10} />
                  <span>返回大厅</span>
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {viewMode === "landing" ? (
                <motion.div
                  key="landing-page"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="h-full"
                >
                  <LandingPage
                    projects={data.projects}
                    characters={data.characters}
                    locations={data.locations}
                    items={data.items}
                    factions={data.factions}
                    isLoggedIn={isLoggedIn}
                    currentUser={currentUser}
                    onEnterWorkspace={() => setViewMode("workspace")}
                    onGoToLogin={() => setViewMode("login")}
                    onLogout={handleLogout}
                  />
                </motion.div>
              ) : viewMode === "login" ? (
                <motion.div
                  key="login-page"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="h-full"
                >
                  <LoginPage
                    onLoginSuccess={handleLoginSuccess}
                    onBack={() => setViewMode("landing")}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.99 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  {activeTab === "projects" && (
                    <Dashboard
                      projects={data.projects}
                      activeProjectId={activeProjectId}
                      onSelectProject={handleSelectProject}
                      onAddProject={handleAddProject}
                      onDeleteProject={handleDeleteProject}
                    />
                  )}

                  {activeTab === "write" && (
                    <ManuscriptEditor
                      project={activeProject}
                      chapters={projectChapters}
                      characters={data.characters}
                      locations={data.locations}
                      onAddChapter={handleAddChapter}
                      onAddScene={handleAddScene}
                      onUpdateScene={handleUpdateScene}
                      onDeleteScene={handleDeleteScene}
                    />
                  )}

                  {activeTab === "lore" && (
                    <LoreDatabase
                      characters={data.characters}
                      locations={data.locations}
                      items={data.items}
                      factions={data.factions}
                      onAddCharacter={handleAddCharacter}
                      onAddLocation={handleAddLocation}
                      onAddItem={handleAddItem}
                      onAddFaction={handleAddFaction}
                      onUpdateCharacterBackstory={handleUpdateCharacterBackstory}
                      onUpdateLocationHistory={handleUpdateLocationHistory}
                      onDeleteLore={handleDeleteLore}
                    />
                  )}

                  {activeTab === "timeline" && (
                    <TimelineView
                      timeline={data.timeline}
                      arcs={data.arcs}
                      characters={data.characters}
                      onAddEvent={handleAddTimelineEvent}
                      onDeleteEvent={handleDeleteTimelineEvent}
                    />
                  )}

                  {activeTab === "relations" && (
                    <RelationsView
                      characters={data.characters}
                      factions={data.factions}
                      onAddRelationship={handleAddRelationship}
                      onDeleteRelationship={handleDeleteRelationship}
                    />
                  )}

                  {activeTab === "framework" && (
                    <FrameworkHub />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOTTOM NAVIGATION TAB BAR (Optimized for light balance) */}
          {viewMode === "workspace" && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-slate-100 backdrop-blur-md flex justify-around items-center py-2.5 pb-4.5 md:pb-3.5 rounded-t-2xl z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.03)]">
              <button
                onClick={() => setActiveTab("projects")}
                className={`flex flex-col items-center justify-center w-12 transition-all cursor-pointer ${
                  activeTab === "projects" ? "text-indigo-600 scale-105" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Home size={18} />
                <span className="text-[9px] mt-1 font-semibold">书库</span>
              </button>

              <button
                onClick={() => {
                  if (activeProject) setActiveTab("write");
                }}
                disabled={!activeProject}
                className={`flex flex-col items-center justify-center w-12 transition-all cursor-pointer ${
                  activeTab === "write" ? "text-indigo-600 scale-105" : "text-slate-400 hover:text-slate-600"
                } disabled:opacity-30`}
              >
                <BookOpen size={18} />
                <span className="text-[9px] mt-1 font-semibold">正文</span>
              </button>

              <button
                onClick={() => setActiveTab("lore")}
                className={`flex flex-col items-center justify-center w-12 transition-all cursor-pointer ${
                  activeTab === "lore" ? "text-teal-600 scale-105" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Sparkles size={18} />
                <span className="text-[9px] mt-1 font-semibold">设定</span>
              </button>

              <button
                onClick={() => setActiveTab("timeline")}
                className={`flex flex-col items-center justify-center w-12 transition-all cursor-pointer ${
                  activeTab === "timeline" ? "text-blue-600 scale-105" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Clock size={18} />
                <span className="text-[9px] mt-1 font-semibold">脉络</span>
              </button>

              <button
                onClick={() => setActiveTab("relations")}
                className={`flex flex-col items-center justify-center w-12 transition-all cursor-pointer ${
                  activeTab === "relations" ? "text-pink-600 scale-105" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Link2 size={18} />
                <span className="text-[9px] mt-1 font-semibold">纽带</span>
              </button>

              <button
                onClick={() => setActiveTab("framework")}
                className={`flex flex-col items-center justify-center w-12 transition-all cursor-pointer ${
                  activeTab === "framework" ? "text-indigo-600 scale-105" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Sliders size={18} />
                <span className="text-[9px] mt-1 font-semibold">规范</span>
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
