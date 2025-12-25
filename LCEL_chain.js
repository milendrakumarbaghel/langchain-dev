import { config } from "dotenv";

config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

const { GOOGLE_API_KEY, GOOGLE_MODEL_NAME, MODEL_TEMPERATURE, MODEL_MAX_OUTPUT_TOKENS } = process.env;

if (!GOOGLE_API_KEY) {
    console.error("Missing GOOGLE_API_KEY. Add it to your environment or .env file before running the chain.");
    process.exit(1);
}

const model = new ChatGoogleGenerativeAI({
    apiKey: GOOGLE_API_KEY,
    model: GOOGLE_MODEL_NAME || "gemini-2.5-flash",
    temperature: MODEL_TEMPERATURE ? Number(MODEL_TEMPERATURE) : 0.7,
    maxOutputTokens: MODEL_MAX_OUTPUT_TOKENS ? Number(MODEL_MAX_OUTPUT_TOKENS) : 2048,
});


async function run() {
    const userQuestion = process.argv.slice(2).join(" ") || "What is LangChain?";
    try {
        const formattedPrompt = await prompt.format({ input: userQuestion });
        const response = await model.invoke(formattedPrompt);
        const output = normalizeResponse(response);
        console.log(output || "No response text returned.");
    } catch (error) {
        console.error("Model call failed:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

function normalizeResponse(response) {
    if (!response) return "";
    if (typeof response === "string") return response.trim();
    if (typeof response.content === "string") return response.content.trim();
    if (Array.isArray(response.content)) {
        const text = response.content
            .map((part) => {
                if (typeof part === "string") return part;
                if (part?.text) return part.text;
                return "";
            })
            .join(" ");
        return text.trim();
    }
    if (typeof response.text === "string") return response.text.trim();
    return "";
}

run();
