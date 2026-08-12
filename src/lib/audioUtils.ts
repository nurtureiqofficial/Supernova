// Audio utility functions for Gemini Live PCM audio stream encoding/decoding

export function convertFloat32ToInt16PcmBase64(float32Array: Float32Array): string {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  let binary = '';
  const bytes = new Uint8Array(int16Array.buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function playPcmChunk(
  audioCtx: AudioContext,
  base64Pcm: string,
  nextStartTimeRef: { current: number },
  activeSourcesRef?: { current: AudioBufferSourceNode[] },
  gainMultiplier: number = 2.8
) {
  try {
    // Ensure AudioContext is resumed for maximum audio output
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const binaryString = atob(base64Pcm);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;

    // Create GainNode for volume amplification
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(gainMultiplier, audioCtx.currentTime);

    // Create DynamicsCompressor to normalize speech volume and prevent audio distortion
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, audioCtx.currentTime);
    compressor.knee.setValueAtTime(30, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

    source.connect(gainNode);
    gainNode.connect(compressor);
    compressor.connect(audioCtx.destination);

    const currentTime = audioCtx.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }

    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;

    if (activeSourcesRef) {
      activeSourcesRef.current.push(source);
      source.onended = () => {
        if (activeSourcesRef.current) {
          activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
        }
      };
    }

    return source;
  } catch (err) {
    console.error('Error playing PCM audio chunk:', err);
  }
}

export function stopAllActiveAudio(
  audioCtx: AudioContext | null,
  nextStartTimeRef: { current: number },
  activeSourcesRef: { current: AudioBufferSourceNode[] }
) {
  if (activeSourcesRef.current) {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch (e) {}
    });
    activeSourcesRef.current = [];
  }
  if (audioCtx) {
    nextStartTimeRef.current = audioCtx.currentTime;
  }
}
