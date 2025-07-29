import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";


dotenv.config()

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

export async function extract(text) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:`
        Extract the following JSON fields from this line:
        - "date" (YYYY-MM-DD)
        - "amount" (number)
        - "type" ("expense" or "income")
        - "description" (string)

        decide a suitable category from description this category essentially defines purpose of payment it should be one of the following :  groceries: ["supermart", "grocery", "kirana", "market"],food,utilities,salary,transport,shopping,entertainment.

        Ensure that description is in 10 words. 

        Line:
        """${text}"""

        Respond **ONLY** with the JSON object.
        `   
  });
 // console.log(response.candidates?.[0]?.content?.parts?.[0]?.text);
     try {
        //console.log(response.candidates?.[0]?.content?.parts?.[0]?.text);
        const raw = response.candidates?.[0]?.content?.parts?.[0]?.text;
        const cleaned = raw.replace(/```json|```/g, "").trim();
        return JSON.parse(cleaned); 
    } catch (e) {
        console.error("Gemini JSON parse error:", e.message);
        throw new Error("Invalid response from Gemini: " + raw);
    }
}

