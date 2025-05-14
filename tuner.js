const noteDisplay = document.getElementById("note");
const freqDisplay = document.getElementById("freq");
const needle = document.getElementById("needle");
const autoBtn = document.getElementById("autoBtn");
const manualBtn = document.getElementById("manualBtn");
const stringButtons = document.getElementById("stringButtons");
const feedback = document.getElementById("feedback");
const accuracyFill = document.getElementById("accuracyFill");

let mode = 'auto';
let selectedNote = null;

const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const standardNotes = {
  'E2': 82.41,
  'A2': 110.00,
  'D3': 146.83,
  'G3': 196.00,
  'B3': 246.94,
  'E4': 329.63,
};

function setMode(m) {
  mode = m;
  selectedNote = null;
  autoBtn.classList.toggle("active", m === "auto");
  manualBtn.classList.toggle("active", m === "manual");
  stringButtons.style.display = m === "manual" ? "block" : "none";
}

function selectString(note) {
  selectedNote = note;

  [...stringButtons.children].forEach(btn => {
    const label = btn.textContent;
    const match = (note === "E4" && label === "e") || (note[0] === label);
    btn.classList.toggle("active", match);
  });

  playTone(standardNotes[note]);
}

function getNoteDetails(freq) {
  const A4 = 440;
  const semitone = 69 + 12 * Math.log2(freq / A4);
  const nearestNote = Math.round(semitone);
  const noteName = noteStrings[nearestNote % 12];
  const cents = (semitone - nearestNote) * 100;
  return { noteName, cents, nearestNoteFreq: A4 * Math.pow(2, (nearestNote - 69) / 12) };
}

async function startTuner() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);
  const buffer = new Float32Array(analyser.fftSize);

  function autoCorrelate(buf, sampleRate) {
    let size = buf.length;
    let rms = 0;
    for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1;

    let r1 = 0, r2 = size - 1, thres = 0.2;
    for (let i = 0; i < size / 2; i++) {
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < size / 2; i++) {
      if (Math.abs(buf[size - i]) < thres) { r2 = size - i; break; }
    }

    buf = buf.slice(r1, r2);
    size = buf.length;

    let c = new Array(size).fill(0);
    for (let i = 0; i < size; i++)
      for (let j = 0; j < size - i; j++)
        c[i] += buf[j] * buf[j + i];

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < size; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    return sampleRate / maxpos;
  }

  function update() {
    analyser.getFloatTimeDomainData(buffer);
    const pitch = autoCorrelate(buffer, audioCtx.sampleRate);
    
    if (pitch !== -1) {
      freqDisplay.textContent = pitch.toFixed(2) + " Hz";
      let cents, angle, targetFreq, noteName;

      if (mode === "manual" && selectedNote) {
        targetFreq = standardNotes[selectedNote];
        cents = 1200 * Math.log2(pitch / targetFreq);
        noteName = selectedNote;
      } else {
        const noteData = getNoteDetails(pitch);
        noteName = noteData.noteName;
        cents = noteData.cents;
      }

      // Update display
      noteDisplay.textContent = noteName;
      angle = Math.max(-50, Math.min(50, cents)) * 0.9;
      needle.style.transform = `rotate(${angle}deg)`;

      // Update feedback text
      const absCents = Math.abs(cents);
      if (absCents < 5) {
        feedback.textContent = "In Tune ✓";
        feedback.style.color = "lightgreen";
      } else if (cents < 0) {
        feedback.textContent = "Tune Up ↑";
        feedback.style.color = "#f39c12";
      } else {
        feedback.textContent = "Tune Down ↓";
        feedback.style.color = "#e74c3c";
      }

      // Update accuracy bar (50% = center)
      const percent = Math.max(0, Math.min(100, 50 + cents));
      accuracyFill.style.width = `${percent}%`;

    } else {
      freqDisplay.textContent = "– Hz";
      noteDisplay.textContent = "–";
      feedback.textContent = "–";
      feedback.style.color = "#ccc";
      needle.style.transform = "rotate(0deg)";
      accuracyFill.style.width = "50%";
    }

    requestAnimationFrame(update);
  }

  update();
}

let toneOscillator = null;

function playTone(frequency) {
  if (toneOscillator) {
    toneOscillator.stop();
    toneOscillator.disconnect();
  }

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  toneOscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  toneOscillator.type = "sine";
  toneOscillator.frequency.value = frequency;
  toneOscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
  toneOscillator.start();
  toneOscillator.stop(audioCtx.currentTime + 1.5);
}
