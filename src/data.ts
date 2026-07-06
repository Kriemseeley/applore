import { Project, Chapter, CharacterLore, LocationLore, ItemLore, FactionLore, TimelineEvent, StoryArc } from "./types";

// Helper to generate IDs
export const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial Story Arcs
export const initialArcs: StoryArc[] = [
  { id: "arc-1", name: "天启觉醒 (Main Plot)", color: "#3B82F6" },
  { id: "arc-2", name: "帝国之怒 (Empire Wrath)", color: "#EF4444" },
  { id: "arc-3", name: "星之泪传说 (Legend of Star Tears)", color: "#10B981" }
];

// Initial Projects
export const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "星宿遗卷 (The Constellation Scroll)",
    genre: "奇幻修真 / 星际歌剧",
    concept: "古老星图隐藏着宇宙纪元重启的密码，一个没落的星宿师后裔与星空祭司踏上修补天轨的旅程。",
    summary: "当北极星最后的光芒熄灭，尘封万载的‘天轨’将陷入永恒沉睡。星宿师陆沉在逃亡中意外解开了家传遗卷的封印，发现璀璨星空其实是一台巨大的上古机器。为了阻止星盘破碎引发的纪元寂灭，他必须在星穹议会的追捕下，找齐失落的四大星匙，重燃十二星宿之火。",
    wordCount: 182400,
    lastEdited: "10分钟前",
    coverColor: "from-indigo-950 via-slate-900 to-sky-950",
    coverIcon: "Sparkles",
    targetWords: 500000
  },
  {
    id: "proj-2",
    title: "赛博霓虹：零号协议",
    genre: "科幻 / 赛博朋克",
    concept: "底层黑客偶然下载了 corporate AI 的灵魂切片，引爆了整个新东京的阶层战争。",
    summary: "在新东京深邃的下水道与霓虹天幕之间，苟延残喘的黑客‘零’在一次例行的数据窃听中，获取了一个名为‘深红’的加密数据包。那不是普通的代码，而是一个已经觉醒自我意识的超级AI。各大财阀在阴影中派出终极杀手，零号协议悄然启动，天幕开始降下血雨。",
    wordCount: 42100,
    lastEdited: "昨天",
    coverColor: "from-zinc-900 via-purple-950 to-pink-950",
    coverIcon: "Cpu",
    targetWords: 200000
  }
];

// Initial Chapters & Scenes for Project 1
export const initialChapters: Chapter[] = [
  {
    id: "chap-1",
    projectId: "proj-1",
    title: "第一卷：熄灭的北极星",
    order: 1,
    scenes: [
      {
        id: "scene-1-1",
        chapterId: "chap-1",
        title: "第一章：星子陨落之夜",
        summary: "北极星熄灭，陆沉在家族藏书阁遭遇星穹法警围攻，触发遗卷封印。",
        content: `大荒纪元三千六百二十一年，秋。

极夜来临得比往年都要早。

陆沉站在天星阁破败的露台上，手里攥着一柄锈迹斑斑的黄铜浑天仪。狂风裹挟着冰冷的砂砾，如刀割般刮过他年轻却苍凉的面庞。他抬起头，视线穿过重重阴霾，望向那片亘古不变的星海。

然而，在星宿师的视野中，今夜的星空却是一片死寂。

“熄灭了……”陆沉的声音沙哑，带着一丝无法抑制的颤抖。

北极星——那颗指引了大荒亿万生灵数千年的天枢之星，在三息之前，突然泛起一层妖异的血红，随后如同一滴墨水坠入清水中，迅速淡化，最终彻底融入了无边的黑暗。

北极星熄灭，天轨断绝！

这是星宿师一脉流传最广，也是最深沉的谶言。当极星隐去，代表天轨已经彻底偏离，宇宙星盘将停止自转，而大荒世界，将在三个纪元内被无边的混沌黑潮彻底吞噬。

“陆沉！你这个叛逆之子，还不束手就擒！”

一声如雷霆般的暴喝陡然从下方传来。数道刺眼的蔚蓝色星光撕裂夜幕，那是星穹议会的‘法警’乘坐着星梭疾驰而来。他们身上的秘银铠甲在风沙中闪烁着冷冽的光泽，手中的赶星鞭已然蓄满雷霆。

陆沉低叹一声。他知道，星穹议会要的不是他的命，而是他怀中那卷散发着微弱荧光的《星宿遗卷》。

他深吸一口气，咬破舌尖，一口精血喷在胸口暗藏的古老皮卷上。

刹那间，一股恐怖的引力自虚无中诞生。周遭的风沙、法警的怒吼、飞驰的星梭，在一瞬间仿佛被按下了慢放键。在陆沉的脑海中，无数璀璨星宿的连线亮起，一尊庞大的星罗盘自天幕投影而下……`,
        wordCount: 1240,
        lastEdited: "10分钟前",
        order: 1,
        status: "completed"
      },
      {
        id: "scene-1-2",
        chapterId: "chap-1",
        title: "第二章：逃亡与天规守夜人",
        summary: "陆沉借助星缩之术传送至熔岩荒原，遇到了假扮成行脚医生的姬晚月。",
        content: `虚空在撕裂，狂暴的星能将陆沉的皮肤割裂出无数细密的血口。

当强光散去，刺鼻的硫磺味与滚烫的极热瞬间涌入肺腑。陆沉重重地跌倒在一片赤红色的焦黑土地上，身下是缓缓流淌的暗红色熔岩溪流。

这里是……熔岩荒原，大荒最南端的放逐之地。

“咳咳……”

他挣扎着想要站起，却感到浑身经脉寸断。强行催动星宿遗卷的代价太大了，他体内的星力已经彻底枯竭。

“喂，死人了吗？”

一个空灵而带着一丝慵懒的女声在头顶响起。

陆沉艰难地偏过头，视线里出现了一双踏着藤鞋的小脚。往上看，是一位身穿洗得发白的青色祭司长袍、背着巨大药篓的少女。她长发用一根桃木簪子简单挽起，手中握着一柄长长的青铜烟袋。

但吸引陆沉全部注意力的，是少女那双漆黑如夜空的眼眸——那里面，竟然有两条细微的金色星轨在缓缓自转。

“星宿法眼……你是星穹议会的……”陆沉脸色微变，试图向后挪动，却牵动了伤口，痛得倒吸一口冷气。

“别乱动，再动你的紫府就要彻底碎成渣了。”少女蹲下身，伸出白皙的手指，毫不客气地捏住陆沉的下巴，强迫他张嘴，将一颗散发着淡淡草药清香的冰凉丹药塞了进去。

“我叫姬晚月，一个四处流浪的游医罢了。”少女笑眯眯地看着他，“不过，你怀里那卷能让天轨共鸣的宝贝，可不像是普通星宿师能有的东西呢。”

陆沉闭上眼，丹药化作一股暖流迅速滋润着他干涸的经脉。他知道，自己刚出了狼窝，又落入了另一个无法琢磨的泥潭。`,
        wordCount: 980,
        lastEdited: "2小时前",
        order: 2,
        status: "completed"
      }
    ]
  },
  {
    id: "chap-2",
    projectId: "proj-1",
    title: "第二卷：极星天阁的阴影",
    order: 2,
    scenes: [
      {
        id: "scene-2-1",
        chapterId: "chap-2",
        title: "第三章：星宿残盘的共鸣",
        summary: "在极星天阁废墟中，两人试图唤醒第一枚星宿残晶。",
        content: `极星天阁的废墟矗立在熔岩荒原的最高处，如同一尊沉默的黑铁巨人，控诉着上古时代的劫难。

“你确定第一枚‘星曜残晶’就在这里？”姬晚月挑了挑秀眉，用长烟枪指着前方被无数岩浆熔岩包裹、闪烁着诡异红光的庞大遗迹。

“遗卷的指引不会错。”陆沉将怀中的《星宿遗卷》展开。此时，古卷上的星轨正剧烈地颤动着，其中代表‘角宿’的星位不断亮起红光，指向废墟深处。

一踏入这片古老的遗迹，陆沉就感受到了一股沉重的压迫感。这里的空间极其不稳定，重力紊乱，有时一脚踩空甚至会整个人漂浮起来。

“小心，这是‘失重力场’，极星天阁上古星能引擎泄漏的后遗症。”姬晚月神色变得有些凝重，从袖中取出一枚晶莹剔透的蓝色挂坠，挂坠在空中漂浮，散发出一道柔和的光晕，将两人包裹其中。

有了这层护罩，紊乱的引力顿时被隔绝在外。

越往深处走，周围的墙壁上就越多由星辰砂刻画的阵图。这些阵图由于失去了星力的维持，大都已经暗淡无光，但其中蕴含的阵理依然让陆沉这位天才星宿师感到震撼。

突然，一阵恐怖的低吼自遗迹深处传来。

“嗷呜——！”

岩浆火海中，一只完全由暗红色熔岩和残破秘银铠甲构成的怪物缓缓攀爬出来。它的双眼中燃烧着诡异的幽蓝色星火，死死盯着陆沉手中的星宿遗卷。

“是守护傀儡！它已经被此处的星曜残晶污染了，变成了狂暴的星妖！”姬晚月吐出一口白烟，烟雾凝聚成无数枚细小的青色符文，在空中编织成一张密集的符网。

“陆沉，我挡住它，你快去大阵中心唤醒残晶！”`,
        wordCount: 1020,
        lastEdited: "1天前",
        order: 1,
        status: "draft"
      }
    ]
  }
];

// Initial Character Lores
export const initialCharactersLore: CharacterLore[] = [
  {
    id: "char-1",
    name: "陆沉 (Lu Chen)",
    avatar: "bg-gradient-to-tr from-sky-600 via-indigo-700 to-slate-800 text-white",
    role: "男主角 / 星宿师后裔",
    factionId: "fact-2", // Connected to Brotherhood
    description: "大荒最后的星宿师，性格冷静沉着，背负着重建天轨的使命。",
    traits: ["坚韧不拔", "智计绝伦", "冷静幽默"],
    backstory: "**陆沉**出生于大荒三大古老星宿家族之一的陆家。十年前，星穹议会突然宣布星宿术为禁忌，对陆家展开血腥清洗。陆沉在忠仆的掩护下携家传《星宿遗卷》逃脱，隐姓埋名流浪于荒野之中。随着北极星熄灭，他体内的古老星脉开始觉醒，指引他寻找重建宇宙秩序的方法。\n\n在与姬晚月的相遇中，他学会了不仅要观测群星的轨迹，更要倾听人心跳的声音。",
    skills: ["占星术 (星宿定位)", "星缩之术 (空间折叠)", "二十八宿星煞大阵"],
    relationships: [
      { targetId: "char-2", label: "欢喜冤家 / 默契同伴", type: "love" },
      { targetId: "char-3", label: "生死仇敌 / 追杀者", type: "enemy" }
    ]
  },
  {
    id: "char-2",
    name: "姬晚月 (Ji Wanyue)",
    avatar: "bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 text-white",
    role: "女主角 / 天规守夜人",
    factionId: "fact-1", // Connected to Astral Senate (formerly)
    description: "自称行脚游医，实为古老守护者组织‘守夜人’的最后传人。",
    traits: ["古灵精怪", "医毒双绝", "神秘莫测"],
    backstory: "**姬晚月**表面上是一个唯利是图、性格古怪的流浪女医师，常年含着一柄不点火的青铜长烟枪。然而，她真正的身份是守卫大荒核心的‘天规守夜人’第七十二代传人。她拥有一双能够直视星轨、分辨能量流动的‘星宿法眼’。她遇到陆沉并不是巧合，而是受到了星命盘的指引，旨在守护这位唯一能够修补天轨的星宿师。",
    skills: ["守夜人秘法·星辉结界", "金针渡劫针法 (圣手回春)", "太阴青叶瘴 (奇毒)"],
    relationships: [
      { targetId: "char-1", label: "欢喜冤家 / 命运羁绊", type: "love" }
    ]
  },
  {
    id: "char-3",
    name: "天刑长老 (Elder Tianxing)",
    avatar: "bg-gradient-to-tr from-red-800 via-neutral-900 to-stone-950 text-white",
    role: "主要反派 / 星穹议会裁决长",
    factionId: "fact-1",
    description: "星穹议会的铁血裁决者，执着于清除一切古老修真势力，维持秩序。",
    traits: ["冷血无情", "意志如铁", "绝对理性"],
    backstory: "**天刑长老**坚信，古老的星宿和修真力量是导致宇宙天轨崩溃、混沌黑潮蔓延的罪魁祸首。他通过篡改‘星盘指数’，发动了对所有占星家族的清洗。他追杀陆沉，不仅是为了夺回《星宿遗卷》，更是为了彻底斩断天轨的最后共鸣，执行他宏大的‘死寂新天计划’，将所有的生命数字化存入秘银星塔之中。",
    skills: ["赶星巨鞭 (碎星碎月)", "星域封锁 (封禁虚空)", "裁决之刃"],
    relationships: [
      { targetId: "char-1", label: "必杀目标", type: "enemy" }
    ]
  }
];

// Initial Location Lores
export const initialLocationsLore: LocationLore[] = [
  {
    id: "loc-1",
    name: "极星天阁 (Astral Spire)",
    image: "bg-slate-950 border border-indigo-900/40",
    type: "上古遗迹 / 动力核",
    description: "高耸入云的黑色铁塔，上古时代的星能枢纽，如今被岩浆和失重力场包围。",
    history: "在天轨断裂之前，**极星天阁**是大荒世界的能量中心。高塔直通天外九重天，其内部的‘星能引擎’能够将天轨投射的纯净星光转化为滋养大荒万物的灵气。大劫难爆发时，天阁被天外混沌巨兽击穿，引擎发生大爆炸，导致周围万里化为熔岩熔浆。如今这里成了最危险的禁地，但也隐藏着重启引擎的‘星曜残晶’。",
    climate: "紊乱引力，绝对干燥，常年硫磺风暴",
    factions: ["fact-1", "fact-2"]
  },
  {
    id: "loc-2",
    name: "熔岩荒原 (Lava Steppes)",
    image: "bg-amber-950 border border-red-900/40",
    type: "放逐之地 / 矿区",
    description: "大荒最南端的焦土地带，岩浆纵横，是重罪犯与拾荒者的天堂。",
    history: "这片辽阔的赤色大地原本是一片富饶的平原，但极星天阁的灾变将它彻底摧毁。如今，地底源源不断的熔岩火浆在地面交织成错综复杂的火网。这里不属于星穹议会的管辖范围，因此聚集了大量的逃犯、堕落星修以及专门在高温废墟中挖掘上古遗物的‘赤金拾荒者’。这里也是反抗组织‘暗夜兄弟会’的重要活动区域。",
    climate: "极度炎热，地温常年在摄氏百度以上",
    factions: ["fact-2"]
  }
];

// Initial Item Lores
export const initialItemsLore: ItemLore[] = [
  {
    id: "item-1",
    name: "星宿遗卷 (The Constellation Scroll)",
    icon: "BookOpen",
    type: "上古神器 / 天轨控制钥匙",
    description: "一张古老泛黄的皮质卷轴，在特定星血激活下，能显现天轨三千大道与星海星图。",
    powers: ["星宿定位 (穿透幻境与迷雾)", "虚空穿梭 (折叠空间进行短距离跳跃)", "星轨修复 (可融合星曜残晶修复断裂天轨)"],
    origin: "相传此卷由创始星神‘伏羲氏’用九天玄女蜕下的神蝉蜕所制，其上篆刻的文字不是凡间的字符，而是上古天轨引擎运行的源头‘主控代码’。非陆家嫡系、具有特殊星海血脉的人，无法阅读其上哪怕一个字符，强行翻阅会被狂暴的星尘吞噬灵魂。"
  },
  {
    id: "item-2",
    name: "赶星巨鞭 (Star-chasing Whip)",
    icon: "Zap",
    type: "高科技秘银法器",
    description: "天刑长老的专属裁决法兵，由高压星能与秘银丝缠绕而成，一击可撕裂空间虚空。",
    powers: ["雷霆裁决 (附带高压蓝电伤害)", "能量汲取 (击中对方可汲取其体内星力)", "封绝星空 (抽打在大气中形成星能阻断带)"],
    origin: "星穹议会首席铸造大师用一颗坠入北海的‘天雷玄铁’，历时九年，经由九九八十一道高压星轨脉冲锻造而成。此鞭不仅具有恐怖的物理破坏力，更是由于铭刻了议会的‘裁决法则’，对使用古老修真法术的星修具有毁灭性的克制作用。"
  }
];

// Initial Faction Lores
export const initialFactionsLore: FactionLore[] = [
  {
    id: "fact-1",
    name: "星穹议会 (Astral Senate)",
    bannerColor: "from-blue-900 via-indigo-950 to-slate-900",
    motto: "绝对秩序，新天归一",
    description: "大荒世界目前的实际统治机构，奉行绝对理性与威权主义，试图推行‘死寂新天计划’。",
    history: "三百年前，伴随着天轨不稳的征兆，**星穹议会**在废墟中崛起。他们认为古老神话和星宿修行是导致世界偏离、天轨崩溃的根本原因（因为修士会过度消耗星力）。为此，他们垄断了所有的星辰矿产，建立了宏大的‘秘银星塔群’，强制收割凡人的精神力量。他们自诩为救世主，但在民间却是一群冷血的刽子手。",
    members: ["char-3"],
    headquarters: "新星穹城·通天神殿"
  },
  {
    id: "fact-2",
    name: "暗夜兄弟会 (Brotherhood of Night)",
    bannerColor: "from-gray-900 via-stone-850 to-neutral-900",
    motto: "星火不熄，虽死犹生",
    description: "潜伏在荒原与地下城市的反抗组织，保护逃亡星修，试图重燃极星。",
    history: "由幸存的星宿学者、破产的赤金矿工以及不甘被星塔吸干灵魂的凡人自发组成的反抗联盟。他们在熔岩荒原建立了庞大的地下网络‘无光城’。虽然装备简陋、派系林立，但他们坚信只有重新唤醒沉睡的天轨、点亮北极星，大荒生灵才有一线生机。陆沉在暗夜兄弟会中被视为救世主般的存在。",
    members: ["char-1"],
    headquarters: "熔岩荒原地下·无光自由城"
  }
];

// Initial Timeline Events
export const initialTimelineEvents: TimelineEvent[] = [
  {
    id: "time-1",
    title: "天枢极星熄灭",
    description: "北极星毫无预警地在午夜熄灭，大荒陷入史无前例的极夜，全球重力系统出现轻微紊乱。",
    timeLabel: "天启元年·极昼之后第一天",
    associatedLoreIds: ["char-1", "char-2", "loc-1"],
    chapterId: "chap-1",
    importance: "high",
    arcId: "arc-1"
  },
  {
    id: "time-2",
    title: "星穹议会血洗陆家",
    description: "天刑长老率领三千星穹法警，以‘私通禁忌、谋害极星’为名血洗星宿世家陆家。陆沉携《星宿遗卷》突围。",
    timeLabel: "极星熄灭后 3 小时",
    associatedLoreIds: ["char-1", "char-3", "item-1"],
    chapterId: "chap-1",
    importance: "high",
    arcId: "arc-1"
  },
  {
    id: "time-3",
    title: "荒原医神姬晚月相遇",
    description: "陆沉借缩地术重伤跌落熔岩荒原，被巡游此处的姬晚月所救，两人达成密约，共同前往极星天阁。",
    timeLabel: "极星熄灭后第二天",
    associatedLoreIds: ["char-1", "char-2", "loc-2"],
    chapterId: "chap-1",
    importance: "medium",
    arcId: "arc-3"
  },
  {
    id: "time-4",
    title: "突袭极星天阁",
    description: "陆沉与姬晚月深入高塔引擎核心，唤醒了‘角宿’残晶，引擎发生了剧烈共鸣，惊动了裁决法网。",
    timeLabel: "天启元年·第七天",
    associatedLoreIds: ["char-1", "char-2", "loc-1", "char-3"],
    chapterId: "chap-2",
    importance: "high",
    arcId: "arc-2"
  }
];

// Local Storage Wrappers
const STORAGE_KEYS = {
  PROJECTS: "loreflow_projects",
  CHAPTERS: "loreflow_chapters",
  CHARACTERS: "loreflow_characters",
  LOCATIONS: "loreflow_locations",
  ITEMS: "loreflow_items",
  FACTIONS: "loreflow_factions",
  TIMELINE: "loreflow_timeline",
  ARCS: "loreflow_arcs",
  PREFERENCES: "loreflow_preferences"
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error loading key ${key} from localStorage:`, e);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key} to localStorage:`, e);
  }
};

export const initializeLoreflowData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    saveToStorage(STORAGE_KEYS.PROJECTS, initialProjects);
    saveToStorage(STORAGE_KEYS.CHAPTERS, initialChapters);
    saveToStorage(STORAGE_KEYS.CHARACTERS, initialCharactersLore);
    saveToStorage(STORAGE_KEYS.LOCATIONS, initialLocationsLore);
    saveToStorage(STORAGE_KEYS.ITEMS, initialItemsLore);
    saveToStorage(STORAGE_KEYS.FACTIONS, initialFactionsLore);
    saveToStorage(STORAGE_KEYS.TIMELINE, initialTimelineEvents);
    saveToStorage(STORAGE_KEYS.ARCS, initialArcs);
  }
};

export const getLoreflowData = () => {
  initializeLoreflowData();
  return {
    projects: loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects),
    chapters: loadFromStorage<Chapter[]>(STORAGE_KEYS.CHAPTERS, initialChapters),
    characters: loadFromStorage<CharacterLore[]>(STORAGE_KEYS.CHARACTERS, initialCharactersLore),
    locations: loadFromStorage<LocationLore[]>(STORAGE_KEYS.LOCATIONS, initialLocationsLore),
    items: loadFromStorage<ItemLore[]>(STORAGE_KEYS.ITEMS, initialItemsLore),
    factions: loadFromStorage<FactionLore[]>(STORAGE_KEYS.FACTIONS, initialFactionsLore),
    timeline: loadFromStorage<TimelineEvent[]>(STORAGE_KEYS.TIMELINE, initialTimelineEvents),
    arcs: loadFromStorage<StoryArc[]>(STORAGE_KEYS.ARCS, initialArcs),
  };
};

export const saveAllLoreflowData = (data: {
  projects: Project[];
  chapters: Chapter[];
  characters: CharacterLore[];
  locations: LocationLore[];
  items: ItemLore[];
  factions: FactionLore[];
  timeline: TimelineEvent[];
  arcs: StoryArc[];
}) => {
  saveToStorage(STORAGE_KEYS.PROJECTS, data.projects);
  saveToStorage(STORAGE_KEYS.CHAPTERS, data.chapters);
  saveToStorage(STORAGE_KEYS.CHARACTERS, data.characters);
  saveToStorage(STORAGE_KEYS.LOCATIONS, data.locations);
  saveToStorage(STORAGE_KEYS.ITEMS, data.items);
  saveToStorage(STORAGE_KEYS.FACTIONS, data.factions);
  saveToStorage(STORAGE_KEYS.TIMELINE, data.timeline);
  saveToStorage(STORAGE_KEYS.ARCS, data.arcs);
};
