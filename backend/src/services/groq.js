const { Groq } = require('groq-sdk');
const { GROQ_API_KEY } = require('../config/env');
const axios = require('axios');
const groq = new Groq({ apiKey: GROQ_API_KEY });

async function getImagePrescriptionSummary(imageUrl) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'From this medical image, extract only the relevant prescription and rewrite it in plain English as simple, spoken patient instructions. Do NOT include headings, metadata, or explanations. No markdown. Only the final clean instructions.' },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ],
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    temperature: 0.3,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false
  });

  const summary = chatCompletion.choices[0].message.content
    .replace(/[\*\_\~\`]/g, '')
    .split('\n\n')
    .pop()
    .trim();

  let finalSummary = summary;
  try {
    console.log(summary);
    const medicalResponse = await axios.post(
      'https://medical-api-endpoints.onrender.com/summarize-prescription',
      {
        text: summary
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const structuredData = medicalResponse.data;

    // Send structured medical data to Groq to get a clean text summary
    const refinement = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                'You are a medical assistant. Based on the following structured prescription data (JSON), produce a concise patient-facing summary with actionable instructions. Do NOT include headings, bullets, disclaimers, or formatting. No markdown. Only plain sentences. If dosages or timings are present, include them clearly.'
            },
            {
              type: 'text',
              text: `JSON:\n${JSON.stringify(structuredData)}`
            }
          ]
        }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.3,
      top_p: 1,
      stream: false,
      max_completion_tokens: 5000
    });

    finalSummary = refinement.choices[0].message.content
      .replace(/[\*\_\~\`]/g, '')
      .trim();
  } catch (error) {
    console.error(error.response?.data || error.message || error);
  }
  console.log(finalSummary);
  return finalSummary;
}

async function answerQuestionWithContext(summary, question) {
  const chatResponse = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `
You are a helpful healthcare assistant. The following is a prescription summary:

"${summary}"

Now, the user asked:
"${question}"

Task:
- Give a direct, simple, and helpful answer to the exact question asked.
- Suggest safe alternatives or natural remedies if relevant.
- Do not just say "consult your doctor" unless the question is about something dangerous.
- Keep the response in plain, simple text, easy for a patient to understand.
`
      }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
    top_p: 1
  });

  return chatResponse.choices[0].message.content.trim();
}

module.exports = { getImagePrescriptionSummary, answerQuestionWithContext };


