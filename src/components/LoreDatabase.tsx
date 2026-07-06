import React, { useState } from "react";
import { CharacterLore, LocationLore, ItemLore, FactionLore, LoreType } from "../types";
import { 
  Users, MapPin, ShieldAlert, Sparkles, BookOpen, Search, Plus, Trash2, 
  ChevronRight, Sliders, CheckCircle2, RotateCcw, BrainCircuit, Heart, Skull, Link2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LoreDatabaseProps {
  characters: CharacterLore[];
  locations: LocationLore[];
  items: ItemLore[];
  factions: FactionLore[];
  onAddCharacter: (character: Omit<CharacterLore, "id">) => void;
  onAddLocation: (location: Omit<LocationLore, "id">) => void;
  onAddItem: (item: Omit<ItemLore, "id">) => void;
  onAddFaction: (faction: Omit<FactionLore, "id">) => void;
  onUpdateCharacterBackstory: (id: string, backstory: string) => void;
  onUpdateLocationHistory: (id: string, history: string) => void;
  onDeleteLore: (type: LoreType, id: string) => void;
}

export default function LoreDatabase({
  characters,
  locations,
  items,
  factions,
  onAddCharacter,
  onAddLocation,
  onAddItem,
  onAddFaction,
  onUpdateCharacterBackstory,
  onUpdateLocationHistory,
  onDeleteLore
}: LoreDatabaseProps) {
  // Category Tab
  const [activeTab, setActiveTab] = useState<LoreType>("character");
  const [searchQuery, setSearchQuery] = useState("");

  // Detailed view sheet
  const [selectedItem, setSelectedItem] = useState<{ type: LoreType; id: string } | null>(null);

  // Forms and modals
  const [showAddModal, setShowAddModal] = useState(false);

  // AI Generation details state
  const [generatingAI, setGeneratingAI] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");
  const [aiError, setAiError] = useState("");

  // Filter items based on tab and search query
  const filteredCharacters = characters.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredLocations = locations.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.type.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredItems = items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.type.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFactions = factions.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.motto.toLowerCase().includes(searchQuery.toLowerCase()));

  // Active item details lookup
  const getActiveItemDetails = () => {
    if (!selectedItem) return null;
    if (selectedItem.type === "character") {
      return characters.find(c => c.id === selectedItem.id);
    } else if (selectedItem.type === "location") {
      return locations.find(l => l.id === selectedItem.id);
    } else if (selectedItem.type === "item") {
      return items.find(i => i.id === selectedItem.id);
    } else {
      return factions.find(f => f.id === selectedItem.id);
    }
  };

  const activeDetails = getActiveItemDetails();

  // Create character backstory using Gemini
  const handleAIGenerateLore = async () => {
    if (!activeDetails || generatingAI) return;
    setGeneratingAI(true);
    setAiError("");
    setGeneratedResult("");

    try {
      const isChar = selectedItem?.type === "character";
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedItem?.type,
          context: isChar 
            ? {
                name: (activeDetails as CharacterLore).name,
                role: (activeDetails as CharacterLore).role,
                description: (activeDetails as CharacterLore).description,
                extra: `Traits: ${(activeDetails as CharacterLore).traits.join(", ")}. Skills: ${(activeDetails as CharacterLore).skills.join(", ")}.`
              }
            : {
                name: (activeDetails as LocationLore).name,
                type: (activeDetails as LocationLore).type,
                description: (activeDetails as LocationLore).description,
                extra: `Climate: ${(activeDetails as LocationLore).climate}`
              }
        })
      });

      const data = await res.json();
      if (res.ok) {
        setGeneratedResult(data.text);
      } else {
        setAiError(data.error || "AI 生成失败");
      }
    } catch (e: any) {
      setAiError("无法连接服务器: " + e.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSaveAILore = () => {
    if (!generatedResult || !selectedItem) return;
    if (selectedItem.type === "character") {
      onUpdateCharacterBackstory(selectedItem.id, generatedResult);
    } else if (selectedItem.type === "location") {
      onUpdateLocationHistory(selectedItem.id, generatedResult);
    }
    setGeneratedResult("");
  };

  // Form creation states
  const [newCharName, setNewCharName] = useState("");
  const [newCharRole, setNewCharRole] = useState("");
  const [newCharDesc, setNewCharDesc] = useState("");
  const [newCharTraits, setNewCharTraits] = useState("");
  const [newCharSkills, setNewCharSkills] = useState("");

  const handleAddCharacterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharName.trim()) return;
    onAddCharacter({
      name: newCharName,
      role: newCharRole || "路人",
      description: newCharDesc || "一个普通的大荒居民。",
      traits: newCharTraits ? newCharTraits.split(/[,，]/).map(t => t.trim()) : ["踏实"],
      skills: newCharSkills ? newCharSkills.split(/[,，]/).map(s => s.trim()) : ["耕作"],
      avatar: "bg-gradient-to-tr from-slate-700 to-indigo-900 text-white",
      backstory: "这是通过手机端创建的新角色设定草稿。请点击‘AI前尘’生成专属背景往事！",
      relationships: []
    });
    setNewCharName("");
    setNewCharRole("");
    setNewCharDesc("");
    setNewCharTraits("");
    setNewCharSkills("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header and Add button */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono tracking-widest text-teal-600 uppercase font-bold">Worldbuilding DB</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 mt-1">世界设定集</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs px-4 py-2 rounded-full font-medium shadow-sm cursor-pointer transition-all"
        >
          <Plus size={14} />
          <span>新建设定</span>
        </motion.button>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/40 overflow-x-auto text-xs whitespace-nowrap scrollbar-none scroll-smooth">
          <button
            onClick={() => { setActiveTab("character"); setSelectedItem(null); }}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === "character" ? "bg-teal-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users size={12} />
            <span>角色人物</span>
          </button>
          <button
            onClick={() => { setActiveTab("location"); setSelectedItem(null); }}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === "location" ? "bg-teal-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MapPin size={12} />
            <span>地理场景</span>
          </button>
          <button
            onClick={() => { setActiveTab("item"); setSelectedItem(null); }}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === "item" ? "bg-teal-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen size={12} />
            <span>道具神兵</span>
          </button>
          <button
            onClick={() => { setActiveTab("faction"); setSelectedItem(null); }}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === "faction" ? "bg-teal-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldAlert size={12} />
            <span>门派组织</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`搜索${activeTab === "character" ? "角色名字或定位" : activeTab === "location" ? "场景名称" : activeTab === "item" ? "武器属性" : "组织门派"}...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* CHARACTER TAB */}
        {activeTab === "character" && filteredCharacters.map((c) => (
          <motion.div
            key={c.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedItem({ type: "character", id: c.id })}
            className="bg-white border border-slate-200/80 rounded-xl p-3 flex flex-col items-center text-center space-y-2 relative group overflow-hidden cursor-pointer shadow-2xs hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 rounded-full ${c.avatar} flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-950/10`}>
              {c.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{c.name}</h3>
              <p className="text-[10px] text-teal-600 font-semibold truncate mt-0.5">{c.role}</p>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-2 leading-normal font-sans">{c.description}</p>
            
            {/* Delete handle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("确定要删除这个设定吗？")) onDeleteLore("character", c.id);
              }}
              className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 bg-slate-50 border border-slate-100 hover:bg-red-50 text-red-600 rounded-md transition-all cursor-pointer"
            >
              <Trash2 size={10} />
            </button>
          </motion.div>
        ))}

        {/* LOCATION TAB */}
        {activeTab === "location" && filteredLocations.map((l) => (
          <motion.div
            key={l.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedItem({ type: "location", id: l.id })}
            className="bg-white border border-slate-200/80 rounded-xl p-3 flex flex-col space-y-2 relative group overflow-hidden cursor-pointer shadow-2xs hover:shadow-md transition-all"
          >
            <div className="w-full h-16 rounded-lg bg-gradient-to-tr from-teal-500/20 to-indigo-500/10 border border-teal-100/10 flex items-center justify-center">
              <MapPin className="text-teal-600/80 animate-pulse" size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 truncate">{l.name}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5 font-medium">{l.type}</p>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-2 leading-normal font-sans">{l.description}</p>
          </motion.div>
        ))}

        {/* ITEM TAB */}
        {activeTab === "item" && filteredItems.map((item) => (
          <motion.div
            key={item.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedItem({ type: "item", id: item.id })}
            className="bg-white border border-slate-200/80 rounded-xl p-3 flex flex-col items-center text-center space-y-2 relative group overflow-hidden cursor-pointer shadow-2xs hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
              <Sparkles className="text-teal-600" size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 truncate">{item.name}</h3>
              <p className="text-[9px] text-teal-600 font-semibold truncate mt-0.5">{item.type}</p>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-2 leading-normal font-sans">{item.description}</p>
          </motion.div>
        ))}

        {/* FACTION TAB */}
        {activeTab === "faction" && filteredFactions.map((f) => (
          <motion.div
            key={f.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedItem({ type: "faction", id: f.id })}
            className="bg-white border border-slate-200/80 rounded-xl p-3 flex flex-col space-y-2 relative group overflow-hidden col-span-2 cursor-pointer shadow-2xs hover:shadow-md transition-all"
          >
            <div className={`h-1 w-full bg-gradient-to-r ${f.bannerColor} rounded-full`} />
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs font-bold text-slate-900">{f.name}</h3>
                <p className="text-[9px] text-teal-600 italic mt-0.5">“{f.motto}”</p>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-sans">{f.description}</p>
          </motion.div>
        ))}

        {/* Empty State */}
        {activeTab === "character" && filteredCharacters.length === 0 && (
          <div className="col-span-2 text-center py-10 bg-slate-50/50 border border-slate-100 rounded-2xl">
            <p className="text-xs text-slate-500 italic font-sans">未发现匹配角色，点击右上角加号创建。</p>
          </div>
        )}
      </div>

      {/* Slide-up Detail Drawer */}
      <AnimatePresence>
        {selectedItem && activeDetails && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 flex items-end justify-center">
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => setSelectedItem(null)} />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white border-t border-slate-200 rounded-t-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] z-10"
            >
              {/* Drag Handle */}
              <div className="w-full flex justify-center py-2.5 shrink-0 bg-slate-50/50">
                <div className="w-12 h-1 bg-slate-200 rounded-full" />
              </div>

              {/* Drawer Content */}
              <div className="p-5 overflow-y-auto space-y-5 flex-1 pb-16">
                {/* Header elements depending on type */}
                {selectedItem.type === "character" && (
                  <div className="flex gap-4 items-start pb-4 border-b border-slate-100">
                    <div className={`w-14 h-14 rounded-full ${(activeDetails as CharacterLore).avatar} flex items-center justify-center font-bold text-lg shrink-0 shadow-md shadow-indigo-950/10`}>
                      {(activeDetails as CharacterLore).name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{(activeDetails as CharacterLore).name}</h2>
                      <p className="text-xs text-teal-600 font-semibold mt-0.5">{(activeDetails as CharacterLore).role}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(activeDetails as CharacterLore).traits.map((t, idx) => (
                          <span key={idx} className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedItem.type === "location" && (
                  <div className="space-y-3 pb-4 border-b border-slate-100">
                    <div className="h-28 rounded-xl bg-gradient-to-tr from-teal-100 to-indigo-50 flex flex-col justify-between p-3 border border-teal-200/20">
                      <span className="text-[8px] bg-teal-500/10 text-teal-600 border border-teal-500/20 px-2 py-0.5 rounded-md font-bold max-w-fit uppercase tracking-widest font-mono">SCENE</span>
                      <MapPin className="text-teal-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{(activeDetails as LocationLore).name}</h2>
                      <p className="text-xs text-teal-600 font-semibold">{(activeDetails as LocationLore).type}</p>
                      <p className="text-xs text-slate-500 mt-2">气候风貌：{(activeDetails as LocationLore).climate}</p>
                    </div>
                  </div>
                )}

                {selectedItem.type === "item" && (
                  <div className="flex gap-4 items-start pb-4 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                      <Sparkles className="text-teal-600" size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{(activeDetails as ItemLore).name}</h2>
                      <p className="text-xs text-teal-600 font-semibold mt-0.5">{(activeDetails as ItemLore).type}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(activeDetails as ItemLore).powers.map((p, idx) => (
                          <span key={idx} className="text-[9px] bg-teal-50 border border-teal-100 text-teal-600 px-2 py-0.5 rounded-full font-semibold">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedItem.type === "faction" && (
                  <div className="space-y-3 pb-4 border-b border-slate-100">
                    <div className={`h-3 w-full bg-gradient-to-r ${(activeDetails as FactionLore).bannerColor} rounded-full`} />
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{(activeDetails as FactionLore).name}</h2>
                      <p className="text-xs text-teal-600 italic mt-0.5">“{(activeDetails as FactionLore).motto}”</p>
                      <p className="text-xs text-slate-500 mt-2">核心据点：{(activeDetails as FactionLore).headquarters}</p>
                    </div>
                  </div>
                )}

                {/* Body Details & Backstory with AI generator button */}
                <div className="space-y-4">
                  {/* Brief description */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">设定概述</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-sans">
                      {activeDetails.description}
                    </p>
                  </div>

                  {/* Powers / Skills */}
                  {selectedItem.type === "character" && (activeDetails as CharacterLore).skills.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">特殊技能 / 招式</h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(activeDetails as CharacterLore).skills.map((skill, idx) => (
                          <span key={idx} className="text-[10px] bg-indigo-50/50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-md font-mono font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Story Relations */}
                  {selectedItem.type === "character" && (activeDetails as CharacterLore).relationships.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Link2 size={12} className="text-teal-600" />
                        <span>人际羁绊关系</span>
                      </h3>
                      <div className="space-y-1.5 mt-2">
                        {(activeDetails as CharacterLore).relationships.map((rel, idx) => {
                          const targetChar = characters.find(c => c.id === rel.targetId);
                          return (
                            <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                              <span className="text-slate-700 font-medium">@{targetChar?.name.split(" (")[0]}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                                rel.type === "love" ? "bg-pink-50 border-pink-100 text-pink-600" :
                                rel.type === "enemy" ? "bg-red-50 border-red-100 text-red-600" : "bg-slate-100 text-slate-500"
                              }`}>
                                {rel.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Core Backstory History */}
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {selectedItem.type === "character" ? "前尘往事 / 背景履历" : "历史渊源 / 设定大纲"}
                      </h3>

                      {/* AI Generator Button inside Details */}
                      {(selectedItem.type === "character" || selectedItem.type === "location") && (
                        <button
                          onClick={handleAIGenerateLore}
                          disabled={generatingAI}
                          className="flex items-center gap-1 text-[10px] text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-150 px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                        >
                          <Sparkles size={10} className="animate-pulse" />
                          <span>AI 生成背景</span>
                        </button>
                      )}
                    </div>

                    {/* AI Generation Outputs inside slide */}
                    {generatingAI && (
                      <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 text-center text-xs text-teal-700 mt-2">
                        <BrainCircuit size={20} className="text-teal-600 animate-spin mx-auto mb-1.5" />
                        正在唤醒上古天轨，生成设定深度历史中，请稍候...
                      </div>
                    )}

                    {aiError && (
                      <div className="p-3 bg-red-50 border border-red-100 text-[10px] text-red-600 rounded-lg mt-2">
                        {aiError}
                      </div>
                    )}

                    {generatedResult && (
                      <div className="p-3.5 bg-teal-50/30 border border-teal-150 rounded-xl mt-2 space-y-3 shadow-inner">
                        <p className="text-[10px] text-teal-600 font-bold flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          AI 生成设定参考完毕
                        </p>
                        <div className="text-xs text-slate-700 leading-relaxed font-sans max-h-40 overflow-y-auto whitespace-pre-wrap">
                          {generatedResult}
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setGeneratedResult("")}
                            className="px-2.5 py-1 bg-slate-100 rounded text-[10px] text-slate-500 cursor-pointer"
                          >
                            不采用
                          </button>
                          <button
                            onClick={handleSaveAILore}
                            className="px-3 py-1 bg-teal-600 rounded text-[10px] text-white font-bold cursor-pointer"
                          >
                            保存到设定
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Show existing backstory */}
                    {!generatedResult && !generatingAI && (
                      <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2 max-h-48 overflow-y-auto font-sans whitespace-pre-wrap">
                        {selectedItem.type === "character" ? (activeDetails as CharacterLore).backstory :
                         selectedItem.type === "location" ? (activeDetails as LocationLore).history :
                         selectedItem.type === "item" ? (activeDetails as ItemLore).origin :
                         (activeDetails as FactionLore).history}
                      </div>
                    )}
                  </div>
                </div>

                {/* Close button bottom */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer mt-4 shadow-xs"
                >
                  关闭详情
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Lore Entry Dialog */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl overflow-hidden shadow-xl flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-900 text-base">新建世界设定</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-mono text-xs cursor-pointer">关闭</button>
              </div>

              {/* Character specific entry form (default for mobile) */}
              <form onSubmit={handleAddCharacterSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
                <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-[10px] text-teal-700 leading-normal font-sans">
                  💡 手机移动端当前仅支持便捷新建‘角色人物’设定。新建后可通过 AI 一键扩写并自动充实相关地理和道具细节。
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">角色名字</label>
                  <input
                    type="text"
                    required
                    value={newCharName}
                    onChange={(e) => setNewCharName(e.target.value)}
                    placeholder="例如：林惊羽"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">身份标签 / 定位</label>
                  <input
                    type="text"
                    required
                    value={newCharRole}
                    onChange={(e) => setNewCharRole(e.target.value)}
                    placeholder="例如：男配角 / 青云门弟子"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">一句话特征</label>
                  <input
                    type="text"
                    required
                    value={newCharDesc}
                    onChange={(e) => setNewCharDesc(e.target.value)}
                    placeholder="一句话描述性格，例如：性格温和，执着不屈"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">性格特质 (英文逗号隔开)</label>
                    <input
                      type="text"
                      value={newCharTraits}
                      onChange={(e) => setNewCharTraits(e.target.value)}
                      placeholder="温和, 勇敢, 倔强"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">功法技能 (英文逗号隔开)</label>
                    <input
                      type="text"
                      value={newCharSkills}
                      onChange={(e) => setNewCharSkills(e.target.value)}
                      placeholder="斩龙剑诀, 御剑飞天"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition-all cursor-pointer mt-2"
                >
                  确认创建设定
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
