const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.categorizeTransaction = async (description) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    
    const prompt = `Analyze this transaction description: "${description}".
    Classify it strictly into one of the following categories:
    - Food
    - Transport
    - Entertainment
    - Utilities
    - Shopping
    - Education
    - Others

    Respond ONLY with the category name, without punctuation or extra words.`;

    const result = await model.generateContent(prompt);
    const category = result.response.text().trim();
    
    const validCategories = [
      "Food",
      "Transport",
      "Entertainment",
      "Utilities",
      "Shopping",
      "Education",
      "Others"
    ];

    return validCategories.includes(category) ? category : "Others";
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return "Others";
  }
};
// ======================================
// Generate AI Spending Insight
// ======================================

exports.generateSpendingInsight = async (transactions) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite"
    });

    const spendingData = transactions.map(tx => ({
      description: tx.description,
      amount: tx.amount,
      category: tx.category,
      date: tx.date
    }));

    const prompt = `
You are a personal finance assistant.

Analyze the following expense transactions:

${JSON.stringify(spendingData)}

Give one short and useful spending insight.

Mention:
- total spending
- largest spending category
- one practical suggestion

Keep the response under 60 words.

Do not use markdown.
Do not give financial investment advice.
`;

    const result = await model.generateContent(prompt);

    return result.response.text().trim();

  } catch (error) {
    console.error(
      "Gemini Insight Error:",
      error.message
    );

    return "Unable to generate spending insights right now.";
  }
};