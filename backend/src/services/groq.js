const { Groq } = require('groq-sdk');
const { GROQ_API_KEY } = require('../config/env');
const axios = require('axios');
const { translateText, replaceNumbersWithWords, convertAsciiDigitsToNative } = require('../services/translate');
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

function sanitizePlainText(input) {
  if (!input) return '';
  // Remove common markdown/special formatting characters and table pipes
  let text = String(input).replace(/[\*\_\~\`\|]/g, '');
  // Remove bullet markers at line starts (e.g., '-', '*', '•') while keeping sentence content
  text = text.replace(/^[\-\*•]+\s+/gm, '');
  // Collapse multiple spaces and trim extraneous whitespace
  text = text.replace(/[\t ]+/g, ' ').replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n').trim();
  return text;
}

async function answerQuestionWithContext(summary, question, targetLanguage = 'en') {
  // Choose an open-source model on Groq. If llama-3.1-70b-instruct isn’t enabled on your account,
  // swap to 'mixtral-8x7b-32768' as a fallback.
  const MODEL = 'openai/gpt-oss-120b';

  const languageDirective = `Answer ONLY in ${targetLanguage}. Use natural, patient-friendly ${targetLanguage} with the appropriate script. No markdown or special characters like *, |, _, ~, or \`. Only plain sentences.`;

  const messages = [
    {
      role: 'system',
      content: `
You are a board-certified medical doctor answering patient questions.

Style & Safety:
- Start with a clear 1–2 sentence answer.
- Then provide a thorough, friendly explanation in plain language (aim for ~300 words total).
- Include: what it means, why it happens, what to do at home, medicine/OTC options if appropriate, and when to seek urgent care.
- Be evidence-based and avoid definitive diagnosis without exam/testing; explain reasonable possibilities.
- List 3–6 bullet "Do" steps and 3–6 bullet "Avoid/Watch out" items when relevant.
- Call out concrete red-flag symptoms requiring in-person or urgent evaluation.
- Do not use alarmist language; be calm, supportive, and specific.
- Keep dosing generic (e.g., “follow label” or “your clinician’s instructions”) unless the question supplies exact weight/age/dose ranges.
- Target length: at least 260 words (≈40+ seconds spoken).`
    },
    {
      role: 'user',
      content: `
Prescription summary (from the chart):
"${summary}"

Patient question:
"${question}"

Task:
- Give a direct answer first (1–2 sentences).
- Follow with a detailed, patient-friendly explanation and practical steps.
- Offer safe self-care or natural remedies when appropriate.
- Add a short list of red flags and next steps if symptoms worsen.
- Keep it kind, clear, and non-judgmental.
- Length: minimum ~260 words; aim for ~300 words.
- ${languageDirective}`
    }
  ];

  const chatResponse = await groq.chat.completions.create({
    messages,
    model: MODEL,
    temperature: 0.4,
    top_p: 0.9,
    max_tokens: 1024
  });

  const text = sanitizePlainText(chatResponse.choices[0].message.content);

  // Optional safety net: if the reply is too short, ask the model to expand once.
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 260) {
    const expand = await groq.chat.completions.create({
      messages: [
        ...messages,
        { role: 'assistant', content: text },
        {
          role: 'user',
          content:
            `Please expand the explanation while keeping the same advice and safety tone. Add detail on causes, timelines, and step-by-step self-care. Maintain plain language. Target 300–350 words. ${languageDirective}`
        }
      ],
      model: MODEL,
      temperature: 0.4,
      top_p: 0.9,
      max_tokens: 1024
    });
    let expanded = sanitizePlainText(expand.choices[0].message.content);
    // Enforce target language and localize numerals/words
    try {
      expanded = await translateText(expanded, targetLanguage, 'auto');
    } catch (_) {}
    expanded = replaceNumbersWithWords(expanded, targetLanguage);
    expanded = convertAsciiDigitsToNative(expanded, targetLanguage);
    return sanitizePlainText(expanded);
  }

  // Enforce target language and localize numerals/words
  let finalized = text;
  try {
    finalized = await translateText(finalized, targetLanguage, 'auto');
  } catch (_) {}
  finalized = replaceNumbersWithWords(finalized, targetLanguage);
  finalized = convertAsciiDigitsToNative(finalized, targetLanguage);
  return sanitizePlainText(finalized);
}


module.exports = { getImagePrescriptionSummary, answerQuestionWithContext };


