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

// goal: refactoring the tech advisor controller to act as an intelligent proxy using tool calling.
// the idea is that instead of just chatting, the advisor can output structured json to search the actual mongodb database.
export const askAdvisor = async (req, res, next) => {
    const { prompt } = req.body;

    if (!prompt) {
        res.status(400);
        return next(new Error("no prompt provided for the tech advisor"));
    }

    try {
        // logic: calling the openai api. i am switching to gpt-4o-mini bcuz it is fast and supports structured tool calling perfectly.
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "you are a gadgetshack tech advisor. if a user asks for a product, use the recommend_product tool to search our database. be friendly and extremely brief."
                },
                { role: "user", content: prompt }
            ],
            // logic: defining the tool schema so the advisor knows exactly what json format to return when it decides to show a product.
            tools: [{
                type: "function",
                function: {
                    name: "recommend_product",
                    description: "search for a specific product by category or keyword based on user needs",
                    parameters: {
                        type: "object",
                        properties: {
                            category: { type: "string", description: "e.g., laptops, smartphones, audio, accessories" },
                            keyword: { type: "string", description: "e.g., gaming, wireless, pro, ultra" }
                        },
                        required: ["category"]
                    }
                }
            }]
        });

        const advisorMessage = response.choices[0].message;

        // logic: checking if the advisor decided to use my tool. if tool_calls exists, it means it wants me to fetch database info and show a product card.
        if (advisorMessage.tool_calls) {
            const toolCall = advisorMessage.tool_calls[0];
            // logic: parsing the structured json arguments generated based on the user's natural language prompt.
            const args = JSON.parse(toolCall.function.arguments);

            ////////////TESTING
            // console.log(`TESTING: advisor triggered tool call. searching db for category: ${args.category}, keyword: ${args.keyword}`);
            ////////////

            // logic: using the extracted keywords to search the actual mongodb database using mongoose.
            // using regex with the 'i' option so the search is case insensitive.
            const products = await Product.find({
                category: { $regex: args.category, $options: 'i' },
                name: { $regex: args.keyword || "", $options: 'i' }
            }).limit(1);

            // logic: sending back a custom json response telling the react frontend to render a specific ui component with the actual database data.
            return res.status(200).json({
                type: 'ui_component',
                text: `Here is the ${args.category} I recommend based on our current inventory:`,
                productData: products.length > 0 ? products[0] : null
            });
        }

        // logic: if the user was just saying hello, the advisor wont use a tool. so i just send back the normal conversational text.
        return res.status(200).json({
            type: 'text',
            text: advisorMessage.content
        });

    } catch (error) {
        console.error("tech advisor generative error:", error);
        next(error);
    }
};