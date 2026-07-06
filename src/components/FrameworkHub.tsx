import React, { useState } from "react";
import { 
  Smartphone, Sliders, Check, Layers, Code, Play, 
  ChevronRight, ArrowLeft, MessageSquare, Compass, 
  HelpCircle, Sparkles, BookOpen, Clock, Heart, 
  TrendingUp, RefreshCw, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FrameworkHub() {
  const [activeSubTab, setActiveSubTab] = useState<"principles" | "elements" | "state" | "native">("principles");
  
  // Interactive simulator states
  const [navStack, setNavStack] = useState<string[]>(["首页 (书库)"]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [simulatedPlatform, setSimulatedPlatform] = useState<"ios" | "android">("ios");
  const [selectedSpecCard, setSelectedSpecCard] = useState<string>("8pxGrid");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handlePushScreen = (screenName: string) => {
    if (navStack.length >= 4) {
      showToast("📱 模拟层级已达上限，请先返回！");
      return;
    }
    setNavStack([...navStack, screenName]);
    showToast(`➡️ 已导航至: ${screenName}`);
  };

  const handlePopScreen = () => {
    if (navStack.length <= 1) {
      showToast("🏠 已经处于最底层页面");
      return;
    }
    const newStack = [...navStack];
    const popped = newStack.pop();
    setNavStack(newStack);
    showToast(`⬅️ 已返回上级，销毁了: ${popped}`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Premium Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono tracking-widest text-indigo-600 uppercase font-bold">App Specification</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 mt-1">原生开发框架</h1>
        </div>
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/80">
          <button 
            onClick={() => { setSimulatedPlatform("ios"); showToast("🔄 已切换为 iOS Haptic 触觉与系统规范"); }}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
              simulatedPlatform === "ios" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            iOS (Apple)
          </button>
          <button 
            onClick={() => { setSimulatedPlatform("android"); showToast("🔄 已切换为 Android Material You 触觉与反馈"); }}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
              simulatedPlatform === "android" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Android
          </button>
        </div>
      </div>

      {/* Guide Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50/50 border border-indigo-100 p-4.5 rounded-2xl">
        <div className="flex items-start gap-3">
          <Smartphone className="text-indigo-600 shrink-0 mt-0.5" size={18} />
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-800">LoreFlow 跨平台设计系统规范</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              为了确保后续在 iOS (SwiftUI) 与 Android (Jetpack Compose) 平台填充具体业务模块时体验极致统一，本组件系统化梳理了<b>设计逻辑</b>、<b>状态机管理</b>与<b>原生组件规范</b>。
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Controller Tab Bar */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveSubTab("principles")}
          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
            activeSubTab === "principles" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders size={12} />
          <span>设计逻辑</span>
        </button>
        <button
          onClick={() => setActiveSubTab("elements")}
          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
            activeSubTab === "elements" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers size={12} />
          <span>交互沙盒</span>
        </button>
        <button
          onClick={() => setActiveSubTab("state")}
          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
            activeSubTab === "state" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Compass size={12} />
          <span>状态流动</span>
        </button>
        <button
          onClick={() => setActiveSubTab("native")}
          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
            activeSubTab === "native" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Code size={12} />
          <span>原生映射</span>
        </button>
      </div>

      {/* SUB TAB MAIN AREA */}
      <div className="min-h-[400px]">
        
        {/* SUB TAB 1: PRINCIPLES */}
        {activeSubTab === "principles" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">三大移动端交互原则</h3>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Rule 1 */}
              <div 
                onClick={() => setSelectedSpecCard("8pxGrid")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedSpecCard === "8pxGrid" 
                    ? "bg-white border-indigo-600 shadow-xs ring-1 ring-indigo-600/10" 
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 font-mono font-bold">01</span>
                    <h4 className="text-xs font-bold text-slate-800">8px 空间流动栅格 (Spatial Rhythm)</h4>
                  </div>
                  {selectedSpecCard === "8pxGrid" && <Check size={12} className="text-indigo-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  所有边距（Margin）、间距（Padding）、圆角（Border Radius）与节点尺寸必须为 <b>8px 的倍数</b> (如 8px, 16px, 24px, 32px)。这有利于在各种异形屏、刘海屏设备上实现完美的比例收缩，避免视效闪烁与布局断层。
                </p>
                {selectedSpecCard === "8pxGrid" && (
                  <div className="mt-3 bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10px] font-mono text-slate-500 space-y-1">
                    <p>• 容器外边距: <span className="text-slate-800 font-bold">px-4 (16px)</span> / 圆角: <span className="text-slate-800 font-bold">rounded-2xl (16px)</span></p>
                    <p>• 选项卡尺寸: <span className="text-slate-800 font-bold">h-11 (44px)</span> / 卡片内间距: <span className="text-slate-800 font-bold">p-5 (20px)</span></p>
                  </div>
                )}
              </div>

              {/* Rule 2 */}
              <div 
                onClick={() => setSelectedSpecCard("oneHand")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedSpecCard === "oneHand" 
                    ? "bg-white border-indigo-600 shadow-xs ring-1 ring-indigo-600/10" 
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 font-mono font-bold">02</span>
                    <h4 className="text-xs font-bold text-slate-800">大拇指热区与操作前置 (Thumb-Zone Priority)</h4>
                  </div>
                  {selectedSpecCard === "oneHand" && <Check size={12} className="text-indigo-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  大纲编辑、角色添加等高频冲突动作<b>绝不置于页面最顶端</b>。均采用下方常驻悬浮按钮 (FAB)、半屏底部抽屉（BottomSheet）承载。保证单手操控下，核心可点击区距离屏幕下部边缘小于 60% 屏幕高度。
                </p>
                {selectedSpecCard === "oneHand" && (
                  <div className="mt-3 bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10px] font-mono text-slate-500 space-y-1">
                    <p>• 底部导航栏: <span className="text-slate-800 font-bold">常驻 (Bottom Tab Bar)</span></p>
                    <p>• 创建与修改面板: <span className="text-slate-800 font-bold">BottomSheet / Dialog 弹出</span></p>
                  </div>
                )}
              </div>

              {/* Rule 3 */}
              <div 
                onClick={() => setSelectedSpecCard("microInteract")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedSpecCard === "microInteract" 
                    ? "bg-white border-indigo-600 shadow-xs ring-1 ring-indigo-600/10" 
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 font-mono font-bold">03</span>
                    <h4 className="text-xs font-bold text-slate-800">触感反馈与物理惯性 (Haptic & Physics)</h4>
                  </div>
                  {selectedSpecCard === "microInteract" && <Check size={12} className="text-indigo-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  在进行卡片删除、新事件提交、或者关联角色视角穿梭（RelationsView 星环图）时，必须匹配物理动效（如阻尼微弹跳、高斯模糊淡入出）和多维触感震动反馈，给创作者带来“指尖码字”的物理安全感。
                </p>
                {selectedSpecCard === "microInteract" && (
                  <div className="mt-3 bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10px] font-mono text-slate-500 space-y-1">
                    <p>• 触点反馈: <span className="text-slate-800 font-bold">Taptic Engine 轻振 / Android Key Vibrator</span></p>
                    <p>• 转场动效: <span className="text-slate-800 font-bold">Spring(0.18s, damp: 0.8) 缓动</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB 2: INTERACTIVE SANDBOX */}
        {activeSubTab === "elements" && (
          <div className="space-y-5">
            {/* Nav Stack Simulator */}
            <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Layers size={10} />
                  原生视图栈控制器 (Screen Stack Simulator)
                </span>
                <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 font-mono">
                  深度: {navStack.length} 层
                </span>
              </div>

              {/* Screen Breadcrumb / Flow */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none h-11">
                {navStack.map((name, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <ChevronRight size={10} className="text-slate-400 shrink-0" />}
                    <span className={`text-[10px] font-semibold whitespace-nowrap px-2 py-0.5 rounded ${
                      idx === navStack.length - 1 
                        ? "bg-indigo-600 text-white shadow-2xs font-bold" 
                        : "bg-slate-200 text-slate-600"
                    }`}>
                      {name}
                    </span>
                  </React.Fragment>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handlePushScreen(
                    navStack.length === 1 ? "正文列表" : navStack.length === 2 ? "章节详情" : "AI大纲续写器"
                  )}
                  className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 rounded-lg font-medium cursor-pointer transition-all"
                >
                  <Play size={10} />
                  <span>Push 进栈 (深入)</span>
                </button>
                <button 
                  onClick={handlePopScreen}
                  disabled={navStack.length <= 1}
                  className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2 rounded-lg font-medium cursor-pointer transition-all border border-slate-200/60 disabled:opacity-40"
                >
                  <ArrowLeft size={10} />
                  <span>Pop 出栈 (回退)</span>
                </button>
              </div>
            </div>

            {/* Bottom Sheet Drawer Simulator */}
            <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Smartphone size={10} />
                  单手底部抽屉弹窗 (Bottom Sheet Simulator)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                代替全屏页面或容易遮挡视线的中间对话框，在手机上承载 80% 的临时输入和配置。
              </p>
              
              <button 
                onClick={() => setIsBottomSheetOpen(true)}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                唤醒设定快速编辑抽屉
              </button>
            </div>

            {/* Haptic / Toast Notification Sandbox */}
            <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl space-y-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={10} />
                触控与提示规范 (Simulated Haptics & Toasts)
              </span>
              <p className="text-[11px] text-slate-500 leading-normal">
                触发操作或成功更新状态时，在顶端或指尖输出轻量且不打扰正文创作的 Toast：
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => showToast(simulatedPlatform === "ios" ? "⚡️ [Taptic] 触点震动：大纲添加成功" : "📳 [Vibrator] Android 触感：大纲已持久化")}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 cursor-pointer text-center"
                >
                  模拟 核心操作成功 触感
                </button>
                <button 
                  onClick={() => showToast("⚠️ 提示: 检测到网络文学‘伏笔异常’，建议修改")}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 cursor-pointer text-center"
                >
                  模拟 AI 警告 触感
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB 3: DATA FLOW STATE SCHEMATIC */}
        {activeSubTab === "state" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">数据节点联动机制 (Data Flow Map)</h3>
            
            <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl space-y-4">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                LoreFlow 的设计逻辑核心是：<b>多端高度自洽，单点修改，全网互通。</b> 当你在任意一处做出修改，状态机需通过以下链路极速流动：
              </p>

              {/* Reactive Flow Graph Visual */}
              <div className="space-y-2 pt-2">
                {/* Node 1 */}
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                      <Sparkles size={12} className="text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-800">1. 修改设定/角色</h4>
                      <p className="text-[8px] text-slate-400">LoreDatabase.tsx (如修改 `char-name`)</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </div>

                {/* Node 2 */}
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center">
                      <Heart size={12} className="text-pink-600" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-800">2. 纽带关系网重算</h4>
                      <p className="text-[8px] text-slate-400">RelationsView.tsx (重新索引宿命，映射头像与弧度)</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </div>

                {/* Node 3 */}
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                      <BookOpen size={12} className="text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-800">3. 写作联想与高亮</h4>
                      <p className="text-[8px] text-slate-400">ManuscriptEditor.tsx (正文快捷栏与智能提示库重载)</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded">
                    即时同步
                  </span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/40 border border-indigo-100/60 rounded-xl flex gap-2">
                <AlertCircle size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-[10px] text-slate-600 leading-normal">
                  <b>开发须知:</b> 在 Native 开发时，必须采用 <b>Single Source of Truth (单源数据集)</b> 架构。使用 SwiftUI 的 `@Published` 或 Android Jetpack Compose 的 `MutableStateFlow` 进行统一存储分发，杜绝因组件深度嵌套造成的数据不同步。
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB 4: NATIVE CODE MAPPING */}
        {activeSubTab === "native" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">原生代码映射手册 (SwiftUI / Jetpack Compose)</h3>
            
            <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl space-y-4">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                这里为后续工程师提供了精细的代码映射。当你需要将 LoreFlow 从当前的 Web 前端复刻为真正的移动原生应用时，可以直接参考以下框架搭建代码：
              </p>

              {/* Code selector toggler */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-150 flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-slate-700 flex items-center gap-1">
                    <Code size={11} />
                    {simulatedPlatform === "ios" ? "SwiftUI (iOS Native)" : "Jetpack Compose (Android)"}
                  </span>
                  <span className="text-[8px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                    {simulatedPlatform === "ios" ? "Swift 5.9" : "Kotlin 1.9"}
                  </span>
                </div>

                {simulatedPlatform === "ios" ? (
                  <pre className="p-3.5 text-[9px] font-mono text-slate-600 overflow-x-auto leading-relaxed max-h-[300px] bg-slate-950 text-slate-300">
{`// iOS Native Navigation & Tab Bar Container
struct LoreFlowAppView: View {
    @StateObject private var store = LoreflowStore()
    @State private var activeTab: TabType = .dashboard
    
    var body: some View {
        TabView(selection: $activeTab) {
            DashboardView(store: store)
                .tabItem {
                    Label("书库", systemImage: "house")
                }
                .tag(TabType.dashboard)
            
            ManuscriptEditorView(store: store)
                .tabItem {
                    Label("正文", systemImage: "book.pages")
                }
                .tag(TabType.write)
            
            LoreDatabaseView(store: store)
                .tabItem {
                    Label("设定", systemImage: "sparkles")
                }
                .tag(TabType.lore)
        }
        .accentColor(Color.indigo) // Standard Indigo tint
    }
}`}
                  </pre>
                ) : (
                  <pre className="p-3.5 text-[9px] font-mono text-slate-600 overflow-x-auto leading-relaxed max-h-[300px] bg-slate-950 text-slate-300">
{`// Android Material You Navigation Bar Setup
@Composable
fun LoreFlowMainScreen(viewModel: LoreflowViewModel = viewModel()) {
    val navController = rememberNavController()
    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surfaceVariant
            ) {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, "书库") },
                    label = { Text("书库") },
                    selected = currentTab == Screen.Dashboard,
                    onClick = { navController.navigate(Screen.Dashboard.route) }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Edit, "正文") },
                    label = { Text("正文") },
                    selected = currentTab == Screen.Write,
                    onClick = { navController.navigate(Screen.Write.route) }
                )
            }
        }
    ) { paddingValues ->
        NavHost(navController, startDestination = Screen.Dashboard.route) {
            composable(Screen.Dashboard.route) { DashboardScreen(paddingValues) }
            composable(Screen.Write.route) { WriteScreen(paddingValues) }
        }
    }
}`}
                  </pre>
                )}
              </div>
              
              <div className="text-[10px] text-slate-500 leading-normal bg-slate-50 p-3 rounded-xl border border-slate-100">
                💡 <b>完美转换提示：</b> 我们的 React H5 原生伴侣视图（使用 Tailwind 和 Framer Motion）的 CSS/动画和上面原生 SwiftUI/Compose 布局一一映射。后续在实现时能达到 100% 的像素级还原。
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Simulated Haptic Toast Overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-4 py-2.5 rounded-full text-[10px] font-semibold shadow-lg z-50 flex items-center gap-1.5 backdrop-blur-md border border-white/10"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulated Interactive Bottom Sheet */}
      <AnimatePresence>
        {isBottomSheetOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-end justify-center">
            {/* Dark background overlay */}
            <div className="absolute inset-0" onClick={() => setIsBottomSheetOpen(false)} />
            
            {/* Sheet Content */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-3xl border-t border-slate-200 w-full max-w-sm p-5 space-y-4 relative z-10 shadow-2xl"
            >
              {/* Top notch indicator bar */}
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto" />
              
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">快速编辑角色属性</h4>
                <button 
                  onClick={() => setIsBottomSheetOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  完成
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">角色角色地位</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => showToast("已标记为主角")} className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-[10px] font-bold text-indigo-700 text-center">主角</button>
                    <button onClick={() => showToast("已标记为反派")} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 text-center">宿敌/反派</button>
                    <button onClick={() => showToast("已标记为导师")} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 text-center">导师</button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">命运倾向</label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center text-[10px] text-slate-600">
                    <span>是否与主角存在宿命羁绊？</span>
                    <span className="font-bold text-pink-600">❤️ 誓死追随</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setIsBottomSheetOpen(false); showToast("✅ 设定卡片重算已就绪"); }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
              >
                保存修改并同步到其它模块
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
