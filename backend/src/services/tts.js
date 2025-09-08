const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { SarvamAIClient } = require('sarvamai');
const { SARVAM_API_KEY, NGROK_DOMAIN } = require('../config/env');
const { splitIntoChunks } = require('../utils/chunk');
const { convertAsciiDigitsToNative } = require('../services/translate');

const sarvamClient = new SarvamAIClient({ apiSubscriptionKey: SARVAM_API_KEY });

async function generateSpeechFromText(fullText, langCode, timestamp) {
  // Ensure numerals are localized to the target language for natural TTS
  const localized = convertAsciiDigitsToNative(fullText, langCode);
  const chunks = splitIntoChunks(localized, 400).filter(chunk => chunk && chunk.trim());
  
  if (chunks.length === 0) {
    console.warn('No valid text chunks found for TTS generation');
    return null;
  }
  
  const mp3Files = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i].trim();
    if (!chunk) continue; // Skip empty chunks
    
    const audioRes = await sarvamClient.textToSpeech.convert({
      text: chunk,
      target_language_code: langCode,
      speaker: 'anushka',
      model: 'bulbul:v2',
      pitch: 0, pace: 1, loudness: 1, speech_sample_rate: 22050,
      enable_preprocessing: true
    });

    const buffer = Buffer.from(audioRes.audios[0], 'base64');
    const rawPath = path.join(__dirname, '../../public', `chunk_${timestamp}_${i}.raw`);
    const mp3Path = path.join(__dirname, '../../public', `chunk_${timestamp}_${i}.mp3`);
    mp3Files.push(mp3Path);

    fs.writeFileSync(rawPath, buffer);

    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-f', 's16le', '-ar', '22050', '-ac', '1',
        '-i', rawPath,
        '-acodec', 'libmp3lame', '-ab', '128k',
        mp3Path
      ]);
      ffmpeg.on('close', code => code === 0 ? resolve() : reject(new Error('ffmpeg failed')));
    });
  }

  const concatList = path.join(__dirname, '../../public', `concat_${timestamp}.txt`);
  fs.writeFileSync(concatList, mp3Files.map(f => `file '${f}'`).join('\n'));

  const finalPath = path.join(__dirname, '../../public', `answer_${timestamp}.mp3`);
  await new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-f', 'concat', '-safe', '0',
      '-i', concatList,
      '-c', 'copy',
      finalPath
    ]);
    ffmpeg.on('close', code => code === 0 ? resolve() : reject(new Error('concat ffmpeg failed')));
  });

  return `${NGROK_DOMAIN}/static/answer_${timestamp}.mp3`;
}

module.exports = { generateSpeechFromText };


