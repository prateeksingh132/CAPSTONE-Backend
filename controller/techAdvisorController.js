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

        // logic: calling the openai api. i am switching to gpt-4o-mini bcuz it is fast and supports structured tool calling perfectly.
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // i beleive its the cheapest model avaialble, will check later for usage limit
            messages: [
                {
                    role: "system",
                    // logic: writing my message to advisor, giving strict rules on how to reply.
                    content: "you are a gadgetshack tech advisor. if a user asks for a product, use the recommend_product tool to search our database. be friendly and extremely brief."
                },
                { role: "user", content: prompt }
            ],
            // logic: defining the tool schema so the advisor knows exactly what json format to return when it decides to show a product.
            // i need it to return valid json so my react frontend can map it to my product card later.
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
            }],
            temperature: 0.7,
        });

        const advisorMessage = response.choices[0].message;

        // logic: parsing the text back into a javascript object so i can send it safely to the frontend.
        // checking if the advisor decided to use my tool. if tool_calls exists, it means it wants me to fetch database info and show a product card.
        if (advisorMessage.tool_calls) {
            const toolCall = advisorMessage.tool_calls[0];
            const args = JSON.parse(toolCall.function.arguments);

            ////////////TESTING
            // console.log(`TESTING: advisor triggered tool call. searching db for category: ${args.category}, keyword: ${args.keyword}`);
            ////////////

            // logic: fetching the live inventory from my collections.
            // using the extracted keywords to search the actual mongodb database using mongoose.
            const products = await Product.find({
                category: { $regex: args.category, $options: 'i' },
                name: { $regex: args.keyword || "", $options: 'i' },
                stock: { $gt: 0 } // i am selecting only the important fields (and filtering out 0 stock)
            }).limit(1);

            return res.status(200).json({
                type: 'ui_component',
                text: `Here is the ${args.category} I recommend based on our current inventory:`,
                productData: products.length > 0 ? products[0] : null
            });
        }

        ////////////TESTING
        // console.log('TESTING: advisor responded successfully with conversational text');
        ////////////

        return res.status(200).json({
            type: 'text',
            text: advisorMessage.content
        });

    } catch (error) {
        console.error("tech advisor error:", error);
        res.status(500);
        // logic: passing the error down to my global error middleware
        next(new Error("failed to generate advisor response. check api key or prompt formatting."));
    }
};