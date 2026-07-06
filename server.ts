import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Initialize Google Gen AI
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getAIClient();

// API Route: AI Worldbuilding and Writing Assistant
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { type, context } = req.body;
    
    if (!ai) {
      return res.status(500).json({ 
        error: "AI 助手未配置。请在‘设置 > 密钥’中配置您的 GEMINI_API_KEY。" 
      });
    }

    let systemInstruction = "你是一个专业的网络小说作家和世界设定架构师。你的目标是提供极具创意、细节丰富且富有逻辑性的内容。";
    let prompt = "";

    switch (type) {
      case "character":
        systemInstruction += " 专门负责设计生动有趣、性格丰满的角色设定。请用精美的 Markdown 格式输出。";
        prompt = `基于以下信息，生成一个详细且富有深度的角色设定（包括基本信息、性格特质、外貌特征、背景故事、能力或特殊技能、角色冲突或动机等）：
        - 名字: ${context.name || "未命名"}
        - 角色定位/身份: ${context.role || "未指定"}
        - 简短描述/标签: ${context.description || "一个神秘的人物"}
        - 附加背景信息: ${context.extra || "无"}`;
        break;

      case "location":
        systemInstruction += " 专门负责构建宏大且细节丰富的世界地理和场景设定。请用精美的 Markdown 格式输出。";
        prompt = `基于以下信息，生成一个详细的地理/场景设定（包括地理位置、景观外貌、历史背景、风土人情、特殊规则/自然法则、关联的势力等）：
        - 地点名字: ${context.name || "未命名"}
        - 景观类型/属性: ${context.type || "未指定"}
        - 基础描述: ${context.description || "神秘的未探索之地"}
        - 附加细节: ${context.extra || "无"}`;
        break;

      case "scene-assistant":
        systemInstruction += " 专门负责辅助正文写作、情节续写、承上启下。请用精美的 Markdown 格式输出，排版简洁优雅，只返回续写或优化后的正文段落，不要包含过多的旁白解释。";
        prompt = `你正在协助作者撰写小说正文。
        故事大纲：${context.projectSummary || "无"}
        当前章节：${context.chapterTitle || "未命名章节"}
        场景名称：${context.sceneTitle || "未命名场景"}
        场景概述：${context.sceneSummary || "未指定"}
        
        当前场景已写内容（若为空，请你根据概述开始新写一段）：
        """
        ${context.content || ""}
        """
        
        写作指令: ${context.instruction || "续写故事，让情节发展更自然，增加感官细节和心理活动。"}
        请输出生成的段落（直接返回小说正文段落，采用美观的小说段落排版）：`;
        break;

      case "outline-generate":
        systemInstruction += " 专门负责小说大纲策划、剧情起伏设计。请用精美的 Markdown 格式输出，提供清晰的结构、高潮设计和主线推进。";
        prompt = `请根据以下构想，生成一份完整的小说故事大纲和分卷/分章设想：
        - 暂定书名: ${context.title || "未命名故事"}
        - 题材/类型: ${context.genre || "未指定"}
        - 核心构想: ${context.concept || "一个有趣的起点"}
        - 主要角色/冲突: ${context.conflict || "无"}
        请输出一份富有张力、商业感和文学感并存的 3 阶段大纲，并提出前 3 章的剧情要点。`;
        break;

      case "polish":
        systemInstruction += " 专门负责润色和精修小说文笔。你的任务是提升文字质感，加强环境烘托，细腻心理描写。请只返回修改润色后的段落，不含多余的废话和评论。";
        prompt = `请润色和精修以下段落：
        """
        ${context.content || ""}
        """
        润色要求: ${context.requirement || "提升文字的感官描写、词汇华丽度与环境细节烘托。"}
        只返回优化后的段落文本：`;
        break;

      default:
        prompt = context.prompt || "你好，请自我介绍一下。";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: error.message || "调用 Gemini API 时发生内部错误。" });
  }
});

// Configure Vite or Static Files
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Loreflow Mobile Server is running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
