type Sound = 'reject' | 'purchase' | 'resolve' | 'ending' | 'warning' | 'tension' | 'expansion';
let context: AudioContext | undefined;
const voices = new Set<OscillatorNode>();
let lastPlayed = 0;
export function play(sound: Sound, muted: boolean) {
  if (sound === 'tension' && !context) return;
  if (muted || typeof window === 'undefined' || document.hidden) return;
  const critical = sound === 'ending' || sound === 'warning' || sound === 'expansion';
  if (!critical && performance.now() - lastPlayed < 65) return;
  try {
    context ??= new AudioContext();
    if (context.state === 'suspended') void context.resume();
    if (critical)
      for (const voice of voices) {
        voice.stop();
        voices.delete(voice);
      }
    if (voices.size >= 4) return;
    const notes: Record<Sound, number[]> = {
      reject: [240, 180],
      purchase: [440, 554, 660],
      resolve: [440, 660],
      ending: [392, 294, 196],
      warning: [330, 260, 330],
      tension: [94, 88],
      expansion: [196, 294, 392, 587, 784],
    };
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.type = 'sine';
    const sequence = notes[sound];
    sequence.forEach((frequency, index) =>
      oscillator.frequency.setValueAtTime(
        frequency,
        now + index * (sound === 'expansion' ? 0.09 : 0.07),
      ),
    );
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(
      sound === 'tension' ? 0.018 : sound === 'expansion' ? 0.055 : 0.035,
      now + 0.012,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + sequence.length * (sound === 'expansion' ? 0.09 : 0.07) + 0.08,
    );
    oscillator.connect(gain).connect(context.destination);
    voices.add(oscillator);
    oscillator.onended = () => {
      voices.delete(oscillator);
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start();
    oscillator.stop(now + sequence.length * (sound === 'expansion' ? 0.09 : 0.07) + 0.1);
    lastPlayed = performance.now();
  } catch {
    /* Audio is optional; every cue has a visual equivalent. */
  }
}
export function suspendAudio() {
  for (const voice of voices) {
    try {
      voice.stop();
    } catch {
      /* already stopped */
    }
  }
  voices.clear();
  if (context?.state === 'running') void context.suspend();
}
