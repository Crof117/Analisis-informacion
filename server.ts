import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not configured in environment");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Endpoint to load full municipal intelligence database
app.get("/api/municipalities", (_req, res) => {
  try {
    const dataPath = path.join(__dirname, "src", "data", "municipalities.json");
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      return res.json({ count: data.length, data });
    }
    return res.status(404).json({ error: "Municipalities file not found" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Server-side Gemini AI Intelligence Analyst endpoint
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    console.log("[AI Endpoint] Received prompt:", prompt?.slice(0, 50));

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Eres el Analista Principal de Inteligencia y Seguridad Nacional del "Observatorio Geopolítico y Electoral de Colombia".
Tu función es proporcionar evaluaciones estratégicas, operacionales y geopolíticas de alto nivel, fundamentadas en evidencia empírica (Alertas Tempranas de la Defensoría del Pueblo, datos oficiales de escrutinio E-26 de la Registraduría Nacional, informes de inteligencia militar e información de orden público).

Principios clave de tu análisis:
1. Precisión táctica: Reconoce la presencia territorial exacta de grupos armados ilegales (Clan del Golfo/AGC, Disidencias FARC - Bloque Occidental Jacobo Arenas de Iván Mordisco, Disidencias de Calarcá / Jorge Suárez Briceño, Segunda Marquetalia, ELN, Comandos de Frontera CDF, Comuneros del Sur, GDOs urbanos como Costeños, Pepes, La Inmaculada, Los Flacos).
2. Correlación geo-electoral: Analiza cómo el control territorial armado (confinamientos, paros armados, minería ilegal, tráfico fluvial, extorsión, uso de drones kamikaze) coacciona a comunidades e influye en la participación electoral y porcentajes atípicos (del 70% al 98% de concentración de votos).
3. Estilo: Riguroso, analítico, objetivo, estructurado con subtítulos militares (SITUACIÓN GEOESTRATÉGICA, ACTORES Y MODALIDADES TÁCTICAS, IMPACTO Y ANOMALÍAS ELECTORALES, PROYECCIÓN DE AMENAZA / MITIGACIÓN).
4. No hagas proselitismo político ni tomes partido; analiza la seguridad del Estado, la protección de la población civil y la preservación democrática institucional.`;

    const fullPrompt = `CONTEXTO TERRITORIAL Y MILITAR DISPONIBLE:
${context ? JSON.stringify(context, null, 2) : "Dossier nacional del Observatorio con 156 municipios y 19 departamentos."}

CONSULTA DE INTELIGENCIA ESTRATÉGICA:
${prompt}

Elabora un informe analítico estructurado y conciso para el Estado Mayor y analistas del observatorio.`;

    // Call Gemini API using modern @google/genai SDK
    let outputText = "";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        }
      });
      outputText = response.text || "No se generó respuesta.";
    } catch (modelErr) {
      // Fallback to gemini-flash-latest or gemini-3.8-flash
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        }
      });
      outputText = fallbackResponse.text || "No se generó respuesta.";
    }

    return res.json({
      analysis: outputText,
      modelUsed: "gemini-3.6-flash",
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Error in /api/ai/analyze:", err);
    return res.status(500).json({
      error: err.message || "Error al procesar el análisis de inteligencia con Gemini."
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor de Inteligencia activo en http://0.0.0.0:${PORT}`);
  });
}

startServer();
