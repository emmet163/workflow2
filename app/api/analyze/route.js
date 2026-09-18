import OpenAI from "openai";
import pdfParse from "pdf-parse";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({
        success: false,
        message: "No file uploaded"
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const pdfData = await pdfParse(buffer);
    const pdfText = pdfData.text;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Extract:
- course name
- assignments
- due dates
- exams

Return valid JSON in this format:

{
  "course": "",
  "assignments": [
    {
      "title": "",
      "due": ""
    }
  ]
}
`
        },
        {
          role: "user",
          content: pdfText
        }
      ]
    });

    const result = response.choices[0].message.content;

    return Response.json({
      success: true,
      result
    });

  } catch (error) {
    return Response.json({
      success: false,
      message: error.message
    });
  }
}
