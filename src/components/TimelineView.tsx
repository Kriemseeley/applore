import React, { useState } from "react";
import { TimelineEvent, StoryArc, CharacterLore } from "../types";
import { 
  Clock, Plus, Filter, Users, MapPin, Tag, Trash2, 
  ChevronDown, ArrowUpRight, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TimelineViewProps {
  timeline: TimelineEvent[];
  arcs: StoryArc[];
  characters: CharacterLore[];
  onAddEvent: (event: Omit<TimelineEvent, "id">) => void;
  onDeleteEvent: (id: string) => void;
}

export default function TimelineView({
  timeline,
  arcs,
  characters,
  onAddEvent,
  onDeleteEvent
}: TimelineViewProps) {
  const [selectedArcFilter, setSelectedArcFilter] = useState<string>("all");
  const [selectedCharacterFilter, setSelectedCharacterFilter] = useState<string>("all");
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLabel, setTimeLabel] = useState("");
  const [arcId, setArcId] = useState("arc-1");
  const [importance, setImportance] = useState<"high" | "medium" | "low">("high");
  const [associatedCharId, setAssociatedCharId] = useState<string>("");

  // Filters
  const filteredEvents = timeline.filter((event) => {
    const matchesArc = selectedArcFilter === "all" || event.arcId === selectedArcFilter;
    const matchesChar = selectedCharacterFilter === "all" || event.associatedLoreIds.includes(selectedCharacterFilter);
    return matchesArc && matchesChar;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !timeLabel.trim()) return;
    
    onAddEvent({
      title,
      description,
      timeLabel,
      arcId,
      importance,
      associatedLoreIds: associatedCharId ? [associatedCharId] : []
    });

    // Reset
    setTitle("");
    setDescription("");
    setTimeLabel("");
    setArcId("arc-1");
    setImportance("high");
    setAssociatedCharId("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono tracking-widest text-blue-600 uppercase font-bold">Story Chronology</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 mt-1">故事时间线</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-full font-medium shadow-sm cursor-pointer transition-all"
        >
          <Plus size={14} />
          <span>事件卡片</span>
        </motion.button>
      </div>

      {/* Filter Options */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Filter size={10} />
            时间线过滤器
          </span>
          <button 
            onClick={() => { setSelectedArcFilter("all"); setSelectedCharacterFilter("all"); }}
            className="text-[10px] text-blue-600 font-bold hover:text-blue-800 transition-all cursor-pointer"
          >
            重置
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Arc Filter */}
          <div className="space-y-1">
            <label className="text-[9px] text-slate-500 font-semibold">按故事主支线过滤</label>
            <select
              value={selectedArcFilter}
              onChange={(e) => setSelectedArcFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="all">所有故事线</option>
              {arcs.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Character Filter */}
          <div className="space-y-1">
            <label className="text-[9px] text-slate-500 font-semibold">按参演角色过滤</label>
            <select
              value={selectedCharacterFilter}
              onChange={(e) => setSelectedCharacterFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="all">所有角色参演</option>
              {characters.map(c => (
                <option key={c.id} value={c.id}>{c.name.split(" (")[0]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Tree */}
      <div className="relative pl-6 border-l border-slate-200 space-y-6 pt-2 pb-10">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 border border-slate-100 rounded-2xl -ml-6 pl-6">
            <p className="text-xs text-slate-500 italic font-sans">在此过滤条件下没有事件卡片。</p>
          </div>
        ) : (
          filteredEvents.map((event, idx) => {
            const arc = arcs.find(a => a.id === event.arcId);
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative"
              >
                {/* Timeline Dot Indicator */}
                <div 
                  className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-4 border-white shadow-xs flex items-center justify-center"
                  style={{ backgroundColor: arc?.color || "#3B82F6" }}
                />

                {/* Event Card */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-2.5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-medium">
                      {event.timeLabel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                        event.importance === "high" ? "bg-red-50 text-red-600 border border-red-100" :
                        event.importance === "medium" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                        "bg-slate-50 text-slate-500 border border-slate-100"
                      }`}>
                        {event.importance === "high" ? "至关重要" : event.importance === "medium" ? "普通主线" : "细碎日常"}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm("确定要删除这个事件节点吗？")) onDeleteEvent(event.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-md cursor-pointer"
                        title="删除事件"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{event.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">{event.description}</p>
                  </div>

                  {/* Association Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <span 
                      className="text-[8px] font-semibold px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${arc?.color}15`, border: `1px solid ${arc?.color}35`, color: arc?.color }}
                    >
                      {arc?.name}
                    </span>

                    {event.associatedLoreIds.map((loreId) => {
                      const char = characters.find(c => c.id === loreId);
                      if (!char) return null;
                      return (
                        <span key={char.id} className="text-[8px] bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono font-medium">
                          <Users size={8} className="text-slate-400" />
                          {char.name.split(" (")[0]}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Timeline Event Modal */}
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
                <h3 className="font-bold text-slate-900 text-base">添加大纲时间线事件</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-mono text-xs cursor-pointer">关闭</button>
              </div>

              <form onSubmit={handleCreate} className="p-4 space-y-4 overflow-y-auto flex-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">时间标识 (故事纪元/天数)</label>
                  <input
                    type="text"
                    required
                    value={timeLabel}
                    onChange={(e) => setTimeLabel(e.target.value)}
                    placeholder="例如：天启元年·第七天下午"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">事件名称</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="输入该事件的核心冲突动作"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">具体内容细节描述</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="描述该事件的发生、经过与结果，对后续剧情产生了什么牵引作用..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">关联的核心故事线</label>
                    <select
                      value={arcId}
                      onChange={(e) => setArcId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                    >
                      {arcs.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">事件重要程度</label>
                    <select
                      value={importance}
                      onChange={(e) => setImportance(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="high">至关重要 (High)</option>
                      <option value="medium">普通主线 (Medium)</option>
                      <option value="low">细碎日常 (Low)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">关联参演主要人物 (可选)</label>
                  <select
                    value={associatedCharId}
                    onChange={(e) => setAssociatedCharId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="">不关联人物</option>
                    {characters.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition-all cursor-pointer mt-2"
                >
                  确认加入大纲时间线
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
