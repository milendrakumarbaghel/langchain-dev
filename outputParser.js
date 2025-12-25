import { config } from "dotenv";

config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const outputParser = new StringOutputParser();

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

const chain = prompt.pipe(model).pipe(outputParser);

const response = await chain.invoke({ input: "What is LangChain and output parser?" });

console.log(response.trim() || "No response text returned.");
