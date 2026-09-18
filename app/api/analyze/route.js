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

    const prompt = `
    The user uploaded a course schedule or syllabus.

    Extract:
    - course name
    - assignments
    - due dates
    - exams

    Return the information in a clean list.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt,
        }
      ],
    });

    return Response.json({
      message: response.choices[0].message.content,
    });

  } catch (error) {
    return Response.json({
      message: error.message,
    });
  }
}
