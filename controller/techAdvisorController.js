import OpenAI from 'openai';
import Product from '../models/Product.js';

// building my tech advisor
// logic: setting up the openai client using my secret key from the env file.
// https://github.com/razak571/turboGPT
// https://github.com/deepankkartikey/AI-Coding-Assistant
// https://www.youtube.com/watch?v=wrHTcjSZQ1Y

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const getAdvisorRecommendation = async (req, res, next) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            res.status(400);
            throw new Error("prompt is required to talk to the tech advisor");
        }

        // logic: fetching the live inventory from my collections. 
        // i am selecting only the important fields (and filtering out 0 stock)
        const inventory = await Product.find({ stock: { $gt: 0 } }).select('_id name price category description');

        // logic: formatting the db data into a simple string for the advisor to read.
        const inventoryContext = JSON.stringify(inventory);

        // logic: writing my message to advisor, giving strict rules on how to reply. i need it to return valid json so my react frontend can map it to my product card later.
        const systemMessage = `
        You are a helpful tech advisor for an electronics store named GadgetShack.
        Here is our current in-stock inventory: ${inventoryContext}
        Answer the user's question friendly and concisely. 
        If a product matches their needs, recommend it based ONLY on the provided inventory.
        You MUST return your response in strictly this JSON format:
        {
            "reply": "Your conversational advice here.",
            "recommendedProductId": "The exact _id string of the product from the inventory, or null if nothing fits"
        }
        Do not include markdown blocks like \`\`\`json, just output the raw JSON object.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // i beleive its the cheapest model avaialble, will check later for usage limit
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
        });

        // logic: parsing the text back into a javascript object so i can send it safely to the frontend.
        const advisorResponse = JSON.parse(completion.choices[0].message.content);

        ////////////TESTING
        // console.log('TESTING: advisor responded successfully with recommendation:', advisorResponse.recommendedProductId);
        ////////////

        res.status(200).json(advisorResponse);

    } catch (error) {
        console.error("tech advisor error:", error);
        res.status(500);
        // logic: passing the error down to my global error middleware
        next(new Error("failed to generate advisor response. check api key or prompt formatting."));
    }
};