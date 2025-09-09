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
    
    try {
      const audioRes = await sarvamClient.textToSpeech.convert({
        text: chunk,
        target_language_code: langCode,
        speaker: 'anushka',
        model: 'bulbul:v2',
        pitch: 0, pace: 1, loudness: 1, speech_sample_rate: 22050,
        enable_preprocessing: true
      });

      // Process all audio chunks returned by Sarvam
      if (audioRes.audios && audioRes.audios.length > 0) {
        for (let j = 0; j < audioRes.audios.length; j++) {
          const buffer = Buffer.from(audioRes.audios[j], 'base64');
          const rawPath = path.join(__dirname, '../../public', `chunk_${timestamp}_${i}_${j}.raw`);
          const mp3Path = path.join(__dirname, '../../public', `chunk_${timestamp}_${i}_${j}.mp3`);
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
      } else {
        console.warn(`No audio data received for chunk ${i + 1}`);
      }
    } catch (error) {
      console.error(`Error processing chunk ${i + 1}:`, error.message);
      throw error;
    }
  }

  const concatList = path.join(__dirname, '../../public', `concat_${timestamp}.txt`);
  const concatContent = mp3Files.map(f => `file '${f}'`).join('\n');
  fs.writeFileSync(concatList, concatContent);
  
  const finalPath = path.join(__dirname, '../../public', `answer_${timestamp}.mp3`);
  
  await new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-f', 'concat', '-safe', '0',
      '-i', concatList,
      '-c', 'copy',
      finalPath
    ]);
    
    ffmpeg.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('concat ffmpeg failed'));
      }
    });
  });

  return `${NGROK_DOMAIN}/static/answer_${timestamp}.mp3`;
}

module.exports = { generateSpeechFromText };


