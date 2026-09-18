import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({
        message: "No file uploaded"
      });
    }

    return Response.json({
      message: `Received ${file.name}. AI connection is working.`
    });
  } catch (error) {
    return Response.json({
      message: error.message
    });
  }
}
