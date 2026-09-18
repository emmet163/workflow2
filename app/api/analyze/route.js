import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Say 'SchoolFlow AI is connected'."
        }
      ]
    });

    return Response.json({
      message: response.choices[0].message.content
    });

  } catch (error) {
    return Response.json({
      message: error.message
    });
  }
}
