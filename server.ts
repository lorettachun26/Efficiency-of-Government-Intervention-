import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { ESSAY_QUESTIONS } from "./src/data.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client to prevent startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please add it via Settings > Secrets in the AI Studio UI.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Essay Grading API endpoint using Gemini structured JSON response
app.post("/api/grade-essay", async (req, res) => {
  try {
    const { questionId, studentAnswer } = req.body;

    if (!questionId || !studentAnswer) {
      res.status(400).json({ error: "Missing questionId or studentAnswer" });
      return;
    }

    const question = ESSAY_QUESTIONS.find((q) => q.id === questionId);
    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    // Try initializing Gemini client
    let ai;
    try {
      ai = getGenAIClient();
    } catch (e: any) {
      res.status(500).json({
        error: "Gemini API key is not configured.",
        details: e.message || String(e)
      });
      return;
    }

    const promptText = `
      You are an expert examiner for the HKDSE Economics public examination in Hong Kong.
      Your task is to grade the student's short essay explanation based on the official question guidelines and rubric.
      Be rigorous, professional, and constructive, matching the precise grading style of HKDSE economics papers.

      === Question Info ===
      Title: ${question.title}
      Max Marks: ${question.maxMarks}
      Question Prompt: ${question.prompt}

      === Official Suggested Keywords ===
      ${question.suggestedKeywords.join(", ")}

      === Official Grading Rubric Points ===
      ${question.rubric.map((r, i) => `${i + 1}. ${r}`).join("\n")}

      === Official Model Explanation Points ===
      ${question.officialModelPoints.map((p, i) => `- ${p}`).join("\n")}

      === Student's Answer ===
      "${studentAnswer}"

      === Instructions ===
      1. Carefully compare the student's answer against the "Official Grading Rubric Points". Award 1 mark for each point that the student successfully covers or demonstrates in their explanation. If they completely missed it or wrote something logically incorrect, do NOT award that point.
      2. Sum up the awarded points to calculate the "score" (0 to ${question.maxMarks}). The score must not exceed ${question.maxMarks}.
      3. For each rubric point, provide a short explanation explaining whether the student got the point and why.
      4. Suggest a clean, structured "modelAnswer" written in precise HKDSE economics terminology that would earn full marks.
      5. Provide "generalFeedback" pointing out structural errors, misconceptions (e.g., confusing demand and quantity demanded, or asserting price ceilings create a surplus), and advice on drawing the necessary diagram.
      6. Identify "keyTermsUsed" by the student, and "keyTermsMissed" that would strengthen their answer.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are an official HKDSE Economics marker. Always respond strictly in the requested JSON structure.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { 
              type: Type.INTEGER, 
              description: "Total marks awarded, from 0 to max marks." 
            },
            maxScore: { 
              type: Type.INTEGER, 
              description: "Maximum marks possible for this question." 
            },
            gradingBreakdown: {
              type: Type.ARRAY,
              description: "Item-by-item rubric evaluation.",
              items: {
                type: Type.OBJECT,
                properties: {
                  point: { type: Type.STRING, description: "The rubric item description." },
                  awarded: { type: Type.BOOLEAN, description: "True if the student gets the mark, false otherwise." },
                  explanation: { type: Type.STRING, description: "Feedback on how the student handled this rubric point." }
                },
                required: ["point", "awarded", "explanation"]
              }
            },
            modelAnswer: { 
              type: Type.STRING, 
              description: "An exemplary answer that would earn perfect marks in the HKDSE." 
            },
            generalFeedback: { 
              type: Type.STRING, 
              description: "Constructive summary feedback, correcting mistakes and advising on DSE conventions." 
            },
            keyTermsUsed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Economics terms correctly employed by the student."
            },
            keyTermsMissed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Important economics terms the student failed to use."
            }
          },
          required: [
            "score", 
            "maxScore", 
            "gradingBreakdown", 
            "modelAnswer", 
            "generalFeedback", 
            "keyTermsUsed", 
            "keyTermsMissed"
          ]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response text received from Gemini API");
    }

    const gradingResult = JSON.parse(textOutput.trim());
    res.json(gradingResult);
  } catch (error: any) {
    console.error("Grading endpoint error:", error);
    res.status(500).json({ 
      error: "An error occurred during grading.", 
      details: error.message || String(error) 
    });
  }
});

// Configure Vite or Static files depending on environment
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
