import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    // Left burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#A855F7', '#38BDF8', '#FACC15', '#F472B6', '#FFFFFF'],
    });
    // Right burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#A855F7', '#38BDF8', '#FACC15', '#F472B6', '#FFFFFF'],
    });
  } catch (err) {
    // Graceful fallback
  }
}

export function fireStarBurst() {
  try {
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FACC15', '#FB923C', '#F472B6'],
    });
  } catch {}
}
