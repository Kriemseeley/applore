import React, { useState } from "react";
import { CharacterLore, FactionLore } from "../types";
import { 
  Users, Plus, Trash2, Heart, Skull, Smile, ShieldAlert,
  HelpCircle, RefreshCw, ChevronRight, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RelationsViewProps {
  characters: CharacterLore[];
  factions: FactionLore[];
  onAddRelationship: (sourceId: string, targetId: string, label: string, type: "ally" | "enemy" | "love" | "neutral") => void;
  onDeleteRelationship: (sourceId: string, targetId: string) => void;
}

export default function RelationsView({
  characters,
  factions,
  onAddRelationship,
  onDeleteRelationship
}: RelationsViewProps) {
  // Focus character traversal state
  const [focusId, setFocusId] = useState<string>(characters[0]?.id || "");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [targetId, setTargetId] = useState("");
  const [label, setLabel] = useState("");
  const [type, setType] = useState<"ally" | "enemy" | "love" | "neutral">("love");

  const focusCharacter = characters.find(c => c.id === focusId) || characters[0];

  if (!focusCharacter) {
    return (
      <div className="text-center py-10 bg-slate-50 border border-slate-150 rounded-2xl font-sans">
        <p className="text-xs text-slate-500 italic">请先在设定集新建至少一名角色。</p>
      </div>
    );
  }

  // Relations mapping for focus character
  const connectedRelations = focusCharacter.relationships || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!focusId || !targetId || !label.trim()) return;
    
    onAddRelationship(focusId, targetId, label, type);
    
    // Reset
    setTargetId("");
    setLabel("");
    setType("love");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono tracking-widest text-pink-600 uppercase font-bold">Lore Flow Map</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 mt-1">人物关系网</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs px-4 py-2 rounded-full font-medium shadow-sm cursor-pointer transition-all"
        >
          <Plus size={14} />
          <span>添加羁绊</span>
        </motion.button>
      </div>

      {/* Guide label */}
      <p className="text-[10px] text-pink-750 bg-pink-50 border border-pink-100 p-3 rounded-xl leading-normal font-sans">
        💡 手机端专享<b>‘星环式拓扑图’</b>：点击下方雷达圈外的任何角色，核心焦点将自动穿梭至该角色，让您以第一视角极速审视复杂故事线人际张力。
      </p>

      {/* Traversal Radar View (Ring structure) */}
      <div className="relative bg-slate-50 border border-slate-200/85 rounded-3xl h-64 overflow-hidden flex items-center justify-center shadow-inner">
        {/* Radar concentric circular grid */}
        <div className="absolute w-52 h-52 rounded-full border border-pink-500/10 animate-pulse" />
        <div className="absolute w-36 h-36 rounded-full border border-pink-500/20" />

        {/* Outer orbital nodes (connections) */}
        {connectedRelations.map((rel, idx) => {
          const targetChar = characters.find(c => c.id === rel.targetId);
          if (!targetChar) return null;

          // Calculate node coordinates on a ring
          const total = connectedRelations.length;
          const angle = (idx * 2 * Math.PI) / total - Math.PI / 2;
          const radius = 90; // offset in pixels
          const x = Math.round(radius * Math.cos(angle));
          const y = Math.round(radius * Math.sin(angle));

          return (
            <motion.div
              key={rel.targetId}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={{ x, y, scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 140, 
                damping: 18, 
                mass: 1,
                delay: idx * 0.04 
              }}
              whileHover={{ scale: 1.15, zIndex: 30 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFocusId(rel.targetId)}
              className="absolute group z-20 cursor-pointer"
            >
              {/* Outer item circle avatar with badge status */}
              <div className="relative flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full ${targetChar.avatar} border-2 border-white flex items-center justify-center font-bold text-xs shadow-md`}>
                  {targetChar.name.charAt(0)}
                </div>

                {/* Relation tag */}
                <div className="absolute -bottom-5 bg-white border border-slate-200 text-[8px] px-1 py-0.5 rounded font-bold font-mono text-slate-700 whitespace-nowrap shadow-xs">
                  {rel.label}
                </div>

                {/* Hover/Tap icon indicator */}
                <div className="absolute -top-1.5 -right-1 z-20">
                  {rel.type === "love" && <Heart size={10} className="text-pink-400 fill-pink-500" />}
                  {rel.type === "enemy" && <Skull size={10} className="text-red-400 fill-red-500" />}
                  {rel.type === "ally" && <Smile size={10} className="text-emerald-400 fill-emerald-500" />}
                  {rel.type === "neutral" && <HelpCircle size={10} className="text-slate-400" />}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Central Focus Node */}
        <motion.div
          key={focusCharacter.id}
          initial={{ scale: 0.85, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="relative flex flex-col items-center z-10 bg-white p-2.5 rounded-full border-4 border-pink-100 shadow-xl"
        >
          <div className={`w-14 h-14 rounded-full ${focusCharacter.avatar} flex items-center justify-center font-bold text-sm shadow-md`}>
            {focusCharacter.name.charAt(0)}
          </div>
          <div className="absolute -bottom-6 bg-pink-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-sm whitespace-nowrap">
            {focusCharacter.name.split(" (")[0]}
          </div>
        </motion.div>
      </div>

      {/* Relations List Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          羁绊档案：{focusCharacter.name} 的社会关系
        </h3>

        <div className="space-y-2">
          {connectedRelations.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-[10px] text-slate-500 italic font-sans">该角色目前孤身一人，尚未建立剧情宿命。点击上方添加羁绊！</p>
            </div>
          ) : (
            connectedRelations.map((rel) => {
              const targetChar = characters.find(c => c.id === rel.targetId);
              if (!targetChar) return null;

              return (
                <div 
                  key={rel.targetId} 
                  className="bg-white border border-slate-200/80 p-3 rounded-xl flex items-center justify-between shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${targetChar.avatar} flex items-center justify-center font-bold text-xs shrink-0`}>
                      {targetChar.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{targetChar.name}</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5 font-sans">{targetChar.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${
                        rel.type === "love" ? "bg-pink-50 border-pink-100 text-pink-600" :
                        rel.type === "enemy" ? "bg-red-50 border-red-100 text-red-600" :
                        rel.type === "ally" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                        "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {rel.label}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteRelationship(focusCharacter.id, rel.targetId)}
                      className="p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-150 rounded-lg transition-all cursor-pointer"
                      title="撤销羁绊"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Select Grid to Focus on other characters */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">选择另一个核心角色进行视角审视</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {characters.map(c => {
            const isFocus = c.id === focusId;
            return (
              <button
                key={c.id}
                onClick={() => setFocusId(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
                  isFocus 
                    ? "bg-pink-50 border-pink-200 text-pink-600 font-bold shadow-xs" 
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${c.avatar} text-[8px] font-bold flex items-center justify-center`}>
                  {c.name.charAt(0)}
                </div>
                <span>{c.name.split(" (")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add relationship Modal */}
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
              className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl overflow-hidden shadow-xl flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-900 text-base">建立两界剧情宿命羁绊</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-mono text-xs cursor-pointer">关闭</button>
              </div>

              <form onSubmit={handleCreate} className="p-4 space-y-4">
                <div className="p-3 bg-pink-50 border border-pink-100 rounded-xl text-[10px] text-pink-700 leading-normal font-sans">
                  建立后，将在两个角色的背景详情和人物轨迹中自动互通关联。
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">关系源头（核心主体）</label>
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-semibold flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full ${focusCharacter.avatar} text-[10px] font-bold flex items-center justify-center`}>
                      {focusCharacter.name.charAt(0)}
                    </div>
                    <span>{focusCharacter.name}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">关联对象（客体人物）</label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-pink-500 focus:bg-white"
                  >
                    <option value="">-- 请选择关联人物 --</option>
                    {characters.filter(c => c.id !== focusId).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">羁绊称谓 (关系标签)</label>
                    <input
                      type="text"
                      required
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="例如：师徒、生死仇敌、宿怨"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">宿命倾向类型</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
                    >
                      <option value="love">❤️ 爱慕 / 挚友 (Love/Bond)</option>
                      <option value="ally">🤝 誓言盟友 (Ally)</option>
                      <option value="enemy">☠️ 生死仇怨 (Enemy)</option>
                      <option value="neutral">⚖️ 命运相交 (Neutral)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition-all cursor-pointer mt-2"
                >
                  确认烙印宿命羁绊
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
