/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Singapore Transit Chime generator
export function playArrivalChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic two-tone ascending chime (similar to airport/metro boarding chime)
    const notes = [
      { freq: 523.25, start: 0.0, duration: 0.25 }, // C5
      { freq: 659.25, start: 0.15, duration: 0.35 }, // E5
      { freq: 783.99, start: 0.32, duration: 0.55 }, // G5
      { freq: 1046.50, start: 0.50, duration: 0.80 } // C6
    ];

    notes.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.25, now + start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch (e) {
    console.warn('Audio alert not supported or blocked by browser gesture policy:', e);
  }
}
