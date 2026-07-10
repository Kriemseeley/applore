import React, { useState } from "react";
import { 
  Mail, Lock, Eye, EyeOff, Sparkles, User, ArrowLeft, Check, 
  HelpCircle, ShieldCheck, Terminal, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LoginPageProps {
  onLoginSuccess: (user: { name: string; avatarColor: string; role: string; email: string }) => void;
  onBack: () => void;
}

const PRESET_AUTHORS = [
  {
    name: "莫言雨",
    email: "moyanyu@loreflow.com",
    role: "白金玄幻大神",
    avatarColor: "bg-indigo-600",
    badge: "👑 白金签约",
    recentProject: "星宿遗卷"
  },
  {
    name: "星野",
    email: "xingye@loreflow.com",
    role: "悬疑科幻新锐",
    avatarColor: "bg-purple-600",
    badge: "✨ 核心创作者",
    recentProject: "零号协议"
  }
];

export default function LoginPage({ onLoginSuccess, onBack }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Interactive feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLog, setLoadingLog] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShake, setIsShake] = useState(false);
  const [successUser, setSuccessUser] = useState<string | null>(null);

  const triggerShake = () => {
    setIsShake(true);
    setTimeout(() => setIsShake(false), 500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic custom validations
    if (!email) {
      setErrorMsg("请输入电子邮箱或用户名！");
      triggerShake();
      return;
    }
    if (activeTab === "register" && !username) {
      setErrorMsg("用户昵称不能为空！");
      triggerShake();
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg("密码格式不正确，且长度不能少于 6 位！");
      triggerShake();
      return;
    }

    // Pass valid check, simulate modern cloud ledger authentication
    startSimulatedAuth(
      activeTab === "register" ? username : email.split("@")[0],
      email,
      activeTab === "register" ? "签约创作者" : "资深架构师"
    );
  };

  const startSimulatedAuth = (name: string, mail: string, role: string) => {
    setIsLoading(true);
    setLoadingLog("正在建立安全星轨加密信道...");
    
    setTimeout(() => {
      setLoadingLog("核验数字创作密钥 (SHA-256)...");
      setTimeout(() => {
        setLoadingLog("加载该作家的 LocalStorage 笔录世界...");
        setTimeout(() => {
          setIsLoading(false);
          setSuccessUser(name);
          
          // Trigger actual login callback
          setTimeout(() => {
            onLoginSuccess({
              name,
              email: mail,
              avatarColor: name === "星野" ? "bg-purple-600" : "bg-indigo-600",
              role: role
            });
          }, 1000);
        }, 500);
      }, 500);
    }, 500);
  };

  const handlePresetLogin = (author: typeof PRESET_AUTHORS[0]) => {
    setEmail(author.email);
    setPassword("preset-secure-pass");
    startSimulatedAuth(author.name, author.email, author.role);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Bar with Go Back */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer text-xs font-semibold"
        >
          <ArrowLeft size={13} />
          <span>返回大厅</span>
        </button>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-full">
          Cloud Secure
        </span>
      </div>

      {/* Main Container / Glowing card */}
      <motion.div 
        animate={isShake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden"
      >
        <div className="text-center space-y-1">
          <div className="inline-flex w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 items-center justify-center text-indigo-600">
            <ShieldCheck size={20} />
          </div>
          <h2 className="text-sm font-bold text-slate-800">登录 LoreFlow 创作云</h2>
          <p className="text-[10px] text-slate-400">登入您的专属星轨通道，多端备份、实时防丢</p>
        </div>

        {/* Tab selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => { setActiveTab("login"); setErrorMsg(null); }}
            className={`flex-1 py-1.5 rounded-lg text-center text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === "login" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            登录账号
          </button>
          <button
            onClick={() => { setActiveTab("register"); setErrorMsg(null); }}
            className={`flex-1 py-1.5 rounded-lg text-center text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === "register" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            注册新作者
          </button>
        </div>

        {/* Form area */}
        <form onSubmit={handleCustomSubmit} className="space-y-3.5 pt-1">
          {errorMsg && (
            <div className="bg-red-55 p-2.5 rounded-xl border border-red-200/60 text-[10px] text-red-600 flex items-start gap-1.5">
              <AlertCircle size={12} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === "register" && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 block">作者昵称 (笔名)</label>
              <div className="relative">
                <User size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="如：墨香铜臭、我吃西红柿"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-[11px] rounded-xl pl-9 pr-3 py-2.5 outline-none transition-all text-slate-800"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 block">登录邮箱</label>
            <div className="relative">
              <Mail size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="writer@loreflow.com"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-[11px] rounded-xl pl-9 pr-3 py-2.5 outline-none transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-[10px] font-bold text-slate-500 block">授权密钥 (密码)</label>
              <span className="text-[8px] text-indigo-500 hover:underline cursor-pointer font-semibold">忘记密码？</span>
            </div>
            <div className="relative">
              <Lock size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-[11px] rounded-xl pl-9 pr-10 py-2.5 outline-none transition-all text-slate-800"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !!successUser}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
          >
            <span>{activeTab === "login" ? "核验通道并登录" : "立即创建作家账号"}</span>
          </button>
        </form>

        {/* Loading log simulator overlays */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 text-slate-300 flex flex-col justify-center items-center p-5 space-y-4 z-40"
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-t-indigo-500 rounded-full animate-spin" />
              </div>
              <div className="space-y-1 text-center max-w-[80%]">
                <p className="text-xs font-bold text-white tracking-wide">核验中...</p>
                <div className="flex items-center gap-1.5 justify-center text-[9px] font-mono text-indigo-400 bg-indigo-950/40 p-1.5 px-2.5 rounded border border-indigo-900/40">
                  <Terminal size={10} />
                  <span>{loadingLog}</span>
                </div>
              </div>
            </motion.div>
          )}

          {successUser && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-white flex flex-col justify-center items-center p-5 space-y-3 z-40"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-md">
                <Check size={22} className="stroke-[3]" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-xs font-bold text-slate-800">登入成功！欢迎回来</h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  作家 <span className="text-indigo-600 font-bold">@{successUser}</span>，星轨世界已载入。
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Preset Authors Quick Bypass Login Area */}
      <div className="bg-slate-100/70 border border-slate-200/60 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={10} className="text-indigo-500" />
            演示特权：创作者一键免密体验
          </span>
          <HelpCircle size={10} className="text-slate-400" title="点击下方角色，模拟真正的云端作家快捷授权登入" />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {PRESET_AUTHORS.map(author => (
            <div 
              key={author.name}
              onClick={() => handlePresetLogin(author)}
              className="bg-white border border-slate-200/80 hover:border-indigo-400 p-2.5 rounded-xl cursor-pointer text-left transition-all hover:shadow-2xs group relative overflow-hidden"
            >
              <div className="absolute top-1.5 right-1.5 text-[7px] font-mono bg-indigo-50 text-indigo-600 px-1 rounded-sm border border-indigo-100">
                {author.badge.split(" ")[1] || author.badge}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-6 h-6 rounded-full ${author.avatarColor} text-white flex items-center justify-center text-[10px] font-bold shadow-xs`}>
                  {author.name.charAt(0)}
                </div>
                <div className="leading-tight">
                  <h4 className="text-[10px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{author.name}</h4>
                  <p className="text-[8px] text-slate-400">{author.role}</p>
                </div>
              </div>
              <p className="text-[8px] text-slate-400 mt-2 border-t border-slate-100 pt-1">
                最新草稿: <span className="text-slate-600 font-bold">《{author.recentProject}》</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
