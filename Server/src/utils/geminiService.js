import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


const getAiResponse = async ({title, notes, code}) => {
  const prompt = 
`You are a DSA mentor giving quick, direct feedback to a student.

Problem: ${title}
Student's approach: ${notes}

Code:
${code}

Be concise. Address the student as "you". No essays.

Respond in this JSON format only, no markdown, no extra text:

{
  "patternAnalysis": "One sentence — did you use the correct pattern or brute force?",
  "timeComplexity": "O(?)",
  "spaceComplexity": "O(?)",
  "readability": "One sentence on code quality.",
  "optimization": "One sentence — can it be improved or is it optimal?",
  "overallFeedback": "2-3 lines max. Encouraging but honest.",
  "score": 1-10
}`;


  const result = await model.generateContent(prompt);
  const textRes = result.response.text();
  const cleaned = textRes.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned)
};
export { getAiResponse };

// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// main();
