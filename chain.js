import { config } from "dotenv";

config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LLMChain } from "langchain/chains"; // Old, now deprecated
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

const prompt = PromptTemplate.fromTemplate(
    "You are a concise assistant. Answer the user question briefly. Question: {input}"
);

const chain = new LLMChain({
    llm: model,
    prompt,
});

async function run() {
    const userQuestion = process.argv.slice(2).join(" ") || "What is LangChain?";
    try {
        const response = await chain.call({ input: userQuestion });
        console.log(response?.text?.trim() || "No response text returned.");
    } catch (error) {
        console.error("Model call failed:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

run();
