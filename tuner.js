const noteDisplay = document.getElementById("note");
const noteMeta = document.getElementById("noteMeta");
const freqDisplay = document.getElementById("freq");
const centsDisplay = document.getElementById("centsDisplay");
const targetDisplay = document.getElementById("targetDisplay");
const needle = document.getElementById("needle");
const autoBtn = document.getElementById("autoBtn");
const manualBtn = document.getElementById("manualBtn");
const stringButtonsContainer = document.getElementById("stringButtons");
const stringButtons = [...stringButtonsContainer.querySelectorAll(".string-btn")];
const feedback = document.getElementById("feedback");
const feedbackCopy = document.getElementById("feedbackCopy");
const statusText = document.getElementById("statusText");
const statusPill = document.getElementById("statusPill");
const statusCopy = document.getElementById("statusCopy");
const signalStrength = document.getElementById("signalStrength");
const accuracyMarker = document.getElementById("accuracyMarker");
const toggleTunerBtn = document.getElementById("toggleTunerBtn");
const playReferenceBtn = document.getElementById("playReferenceBtn");
const modeCopy = document.getElementById("modeCopy");
const tuningSelect = document.getElementById("tuningSelect");
const tuningSummary = document.getElementById("tuningSummary");
const toggleMetronomeBtn = document.getElementById("toggleMetronomeBtn");
const bpmInput = document.getElementById("bpmInput");
const subdivisionSelect = document.getElementById("subdivisionSelect");
const tapTempoBtn = document.getElementById("tapTempoBtn");
const metronomeBeat = document.getElementById("metronomeBeat");
const tempoBadge = document.getElementById("tempoBadge");
const tempoReadout = document.getElementById("tempoReadout");
const subdivisionLabel = document.getElementById("subdivisionLabel");
const beatCounter = document.getElementById("beatCounter");
const tempoFeel = document.getElementById("tempoFeel");
const subdivisionTrack = document.getElementById("subdivisionTrack");
const tempoDial = document.querySelector(".tempo-dial");
const chordRoot = document.getElementById("chordRoot");
const chordType = document.getElementById("chordType");
const chordShapeSelect = document.getElementById("chordShapeSelect");
const playChordBtn = document.getElementById("playChordBtn");
const chordDisplay = document.getElementById("chordDisplay");
const chordFingering = document.getElementById("chordFingering");
const chordMood = document.getElementById("chordMood");
const intervalChips = document.getElementById("intervalChips");
const chordNotes = document.getElementById("chordNotes");
const chordShapeName = document.getElementById("chordShapeName");
const chordShapeDiagram = document.getElementById("chordShapeDiagram");
const chordShapeSummary = document.getElementById("chordShapeSummary");
const fretboardMap = document.getElementById("fretboardMap");
const progressionSelect = document.getElementById("progressionSelect");
const playProgressionBtn = document.getElementById("playProgressionBtn");
const progressionMap = document.getElementById("progressionMap");
const progressionDescription = document.getElementById("progressionDescription");

const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SEMITONES = NOTE_STRINGS.reduce((accumulator, noteName, index) => {
  accumulator[noteName] = index;
  return accumulator;
}, {});
const SUBDIVISION_LABELS = {
  1: "Quarter notes",
  2: "Eighth notes",
  3: "Triplet subdivision",
  4: "Sixteenth notes",
};

const TUNING_PRESETS = {
  standard: {
    name: "Standard",
    summary: "6E 5A 4D 3G 2B 1E",
    strings: ["E2", "A2", "D3", "G3", "B3", "E4"],
  },
  dropD: {
    name: "Drop D",
    summary: "6D 5A 4D 3G 2B 1E",
    strings: ["D2", "A2", "D3", "G3", "B3", "E4"],
  },
  halfStepDown: {
    name: "Half-Step Down",
    summary: "6D# 5G# 4C# 3F# 2A# 1D#",
    strings: ["D#2", "G#2", "C#3", "F#3", "A#3", "D#4"],
  },
  dadgad: {
    name: "DADGAD",
    summary: "6D 5A 4D 3G 2A 1D",
    strings: ["D2", "A2", "D3", "G3", "A3", "D4"],
  },
  openG: {
    name: "Open G",
    summary: "6D 5G 4D 3G 2B 1D",
    strings: ["D2", "G2", "D3", "G3", "B3", "D4"],
  },
  openD: {
    name: "Open D",
    summary: "6D 5A 4D 3F# 2A 1D",
    strings: ["D2", "A2", "D3", "F#3", "A3", "D4"],
  },
};

let activeTuningId = "standard";
let activeTuning = buildTuningStrings(TUNING_PRESETS.standard);
let activeStringNotes = buildStringNoteMap(activeTuning);

const CHORD_FORMULAS = {
  maj: {
    name: "Major",
    symbol: "",
    intervals: [0, 4, 7],
    degrees: ["R", "3", "5"],
    mood: "Bright landing point",
    description: "A stable major triad with a clear, open center.",
  },
  min: {
    name: "Minor",
    symbol: "m",
    intervals: [0, 3, 7],
    degrees: ["R", "b3", "5"],
    mood: "Darker pull",
    description: "A minor color that keeps the root grounded but more emotional.",
  },
  "7": {
    name: "Dominant 7",
    symbol: "7",
    intervals: [0, 4, 7, 10],
    degrees: ["R", "3", "5", "b7"],
    mood: "Tension forward",
    description: "A blues and jazz flavored chord that wants to resolve.",
  },
  maj7: {
    name: "Major 7",
    symbol: "maj7",
    intervals: [0, 4, 7, 11],
    degrees: ["R", "3", "5", "7"],
    mood: "Smooth shimmer",
    description: "A soft, polished major sound with more color on top.",
  },
  m7: {
    name: "Minor 7",
    symbol: "m7",
    intervals: [0, 3, 7, 10],
    degrees: ["R", "b3", "5", "b7"],
    mood: "Warm late-night groove",
    description: "A rounded minor sound that sits well in soulful or jazzy movement.",
  },
};

const PROGRESSION_LIBRARY = {
  "I-IV-V": {
    description: "A direct major-key move with strong forward pull and easy ear training.",
    steps: [
      { roman: "I", degree: 1, type: "maj" },
      { roman: "IV", degree: 4, type: "maj" },
      { roman: "V", degree: 5, type: "maj" },
    ],
  },
  "vi-IV-I-V": {
    description: "A familiar pop progression that balances lift, release, and a strong return home.",
    steps: [
      { roman: "vi", degree: 6, type: "min" },
      { roman: "IV", degree: 4, type: "maj" },
      { roman: "I", degree: 1, type: "maj" },
      { roman: "V", degree: 5, type: "maj" },
    ],
  },
  "ii-V-I": {
    description: "A jazz classic that leans into tension before settling into the tonic.",
    steps: [
      { roman: "ii", degree: 2, type: "m7" },
      { roman: "V", degree: 5, type: "7" },
      { roman: "I", degree: 1, type: "maj7" },
    ],
  },
  "I-vi-IV-V": {
    description: "A classic turnaround with a gentle dip to vi before climbing back up.",
    steps: [
      { roman: "I", degree: 1, type: "maj" },
      { roman: "vi", degree: 6, type: "min" },
      { roman: "IV", degree: 4, type: "maj" },
      { roman: "V", degree: 5, type: "maj" },
    ],
  },
};

const OPEN_STANDARD_SHAPES = {
  "C:maj": [{ name: "Open C", frets: [null, 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null] }],
  "C:7": [{ name: "Open C7", frets: [null, 3, 2, 3, 1, 0], fingers: [null, 3, 2, 4, 1, null] }],
  "C:maj7": [{ name: "Open Cmaj7", frets: [null, 3, 2, 0, 0, 0], fingers: [null, 3, 2, null, null, null] }],
  "D:maj": [{ name: "Open D", frets: [null, null, 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2] }],
  "D:min": [{ name: "Open Dm", frets: [null, null, 0, 2, 3, 1], fingers: [null, null, null, 2, 3, 1] }],
  "D:7": [{ name: "Open D7", frets: [null, null, 0, 2, 1, 2], fingers: [null, null, null, 2, 1, 3] }],
  "D:m7": [{ name: "Open Dm7", frets: [null, null, 0, 2, 1, 1], fingers: [null, null, null, 2, 1, 1] }],
  "E:maj": [{ name: "Open E", frets: [0, 2, 2, 1, 0, 0], fingers: [null, 2, 3, 1, null, null] }],
  "E:min": [{ name: "Open Em", frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null] }],
  "E:7": [{ name: "Open E7", frets: [0, 2, 0, 1, 0, 0], fingers: [null, 2, null, 1, null, null] }],
  "E:maj7": [{ name: "Open Emaj7", frets: [0, 2, 1, 1, 0, 0], fingers: [null, 3, 1, 2, null, null] }],
  "E:m7": [{ name: "Open Em7", frets: [0, 2, 0, 0, 0, 0], fingers: [null, 2, null, null, null, null] }],
  "G:maj": [{ name: "Open G", frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, null, null, null, 4] }],
  "G:7": [{ name: "Open G7", frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, null, null, null, 1] }],
  "G:maj7": [{ name: "Open Gmaj7", frets: [3, 2, 0, 0, 0, 2], fingers: [3, 1, null, null, null, 2] }],
  "A:maj": [{ name: "Open A", frets: [null, 0, 2, 2, 2, 0], fingers: [null, null, 1, 2, 3, null] }],
  "A:min": [{ name: "Open Am", frets: [null, 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null] }],
  "A:7": [{ name: "Open A7", frets: [null, 0, 2, 0, 2, 0], fingers: [null, null, 2, null, 3, null] }],
  "A:maj7": [{ name: "Open Amaj7", frets: [null, 0, 2, 1, 2, 0], fingers: [null, null, 2, 1, 3, null] }],
  "A:m7": [{ name: "Open Am7", frets: [null, 0, 2, 0, 1, 0], fingers: [null, null, 2, null, 1, null] }],
  "F:maj7": [{ name: "Open Fmaj7", frets: [null, null, 3, 2, 1, 0], fingers: [null, null, 3, 2, 1, null] }],
};

const E_SHAPE_TEMPLATES = {
  maj: { label: "E-shape barre", offsets: [0, 2, 2, 1, 0, 0], fingers: [1, 3, 4, 2, 1, 1] },
  min: { label: "Em-shape barre", offsets: [0, 2, 2, 0, 0, 0], fingers: [1, 3, 4, 1, 1, 1] },
  "7": { label: "E7-shape barre", offsets: [0, 2, 0, 1, 0, 0], fingers: [1, 3, 1, 2, 1, 1] },
  maj7: { label: "Emaj7-shape barre", offsets: [0, 2, 1, 1, 0, 0], fingers: [1, 4, 2, 3, 1, 1] },
  m7: { label: "Em7-shape barre", offsets: [0, 2, 0, 0, 0, 0], fingers: [1, 3, 1, 1, 1, 1] },
};

const A_SHAPE_TEMPLATES = {
  maj: { label: "A-shape barre", offsets: [null, 0, 2, 2, 2, 0], fingers: [null, 1, 3, 3, 3, 1] },
  min: { label: "Am-shape barre", offsets: [null, 0, 2, 2, 1, 0], fingers: [null, 1, 3, 4, 2, 1] },
  "7": { label: "A7-shape barre", offsets: [null, 0, 2, 0, 2, 0], fingers: [null, 1, 3, 1, 4, 1] },
  maj7: { label: "Amaj7-shape barre", offsets: [null, 0, 2, 1, 2, 0], fingers: [null, 1, 3, 2, 4, 1] },
  m7: { label: "Am7-shape barre", offsets: [null, 0, 2, 0, 1, 0], fingers: [null, 1, 3, 1, 2, 1] },
};

const OPEN_TUNING_ROOTS = {
  openG: "G",
  openD: "D",
};

let mode = "auto";
let selectedNote = null;
let audioCtx = null;
let source = null;
let analyser = null;
let stream = null;
let animationId = null;
let isTuning = false;
let stablePitch = null;
let lastUpdateTimestamp = 0;
let lastTargetFrequency = activeTuning[0].frequency;
let playbackContext = null;
let playbackMaster = null;
let playbackNoiseBuffer = null;
let isProgressionPlaying = false;
let tapTimes = [];

const metronomeState = {
  bpm: 120,
  subdivision: 1,
  beatsPerBar: 4,
  isRunning: false,
  nextNoteTime: 0,
  currentStep: 0,
  lookaheadMs: 25,
  scheduleAheadTime: 0.1,
  timerId: null,
};

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function reportPlaybackError(error) {
  const message = error?.message || "Audio playback is unavailable in this browser.";
  setFeedbackState("bad", "Audio unavailable", message);
  statusCopy.textContent = "Interact with the page once, then try again if the browser blocked sound.";

  if (tempoFeel) {
    tempoFeel.textContent = "Audio playback unavailable";
  }
}

function buildTuningStrings(preset) {
  return preset.strings.map((note, index) => {
    const midi = noteNameToMidi(note);
    const pitchClass = getPitchClass(note);
    const stringNumber = 6 - index;
    const stringRole = index === 0 ? "Low" : index === 5 ? "High" : String(stringNumber);

    return {
      note,
      label: `${stringRole} ${pitchClass}`,
      frequency: midiToFrequency(midi),
      stringNumber,
    };
  });
}

function buildStringNoteMap(tuning) {
  return Object.fromEntries(
    tuning.map((string) => [string.note, { label: string.label, frequency: string.frequency }]),
  );
}

function getSelectedTarget() {
  return activeStringNotes[selectedNote] || activeTuning[0];
}

function refreshStringButtons() {
  stringButtons.forEach((button, index) => {
    const string = activeTuning[index];
    const noteLabel = button.querySelector(".string-note");
    const freqLabel = button.querySelector(".string-freq");

    button.dataset.note = string.note;
    button.dataset.stringNumber = String(string.stringNumber);
    noteLabel.textContent = `${string.stringNumber} - ${string.label}`;
    freqLabel.textContent = `${string.note} - ${string.frequency.toFixed(2)} Hz`;
  });
}

function setTuning(tuningId) {
  const previousStringIndex = activeTuning.findIndex((string) => string.note === selectedNote);
  const nextStringIndex = previousStringIndex >= 0 ? previousStringIndex : 0;

  activeTuningId = TUNING_PRESETS[tuningId] ? tuningId : "standard";
  activeTuning = buildTuningStrings(TUNING_PRESETS[activeTuningId]);
  activeStringNotes = buildStringNoteMap(activeTuning);
  selectedNote = activeTuning[nextStringIndex].note;
  lastTargetFrequency = activeTuning[nextStringIndex].frequency;

  tuningSelect.value = activeTuningId;
  refreshStringButtons();
  tuningSummary.textContent = TUNING_PRESETS[activeTuningId].summary;
  highlightStringButton(selectedNote);
  updateSelectedTarget();
  renderFretboard(buildChordNotes(chordRoot.value || "E", chordType.value || "maj"));
  showChord();

  if (!isTuning) {
    resetDisplay();
  }
}

function parseNoteName(note) {
  const match = /^([A-G]#?)(-?\d+)?$/.exec(note);

  if (!match) {
    return null;
  }

  return {
    pitchClass: match[1],
    octave: match[2] === undefined ? null : Number(match[2]),
  };
}

function noteNameToMidi(note, fallbackOctave = 4) {
  const parsed = parseNoteName(note);

  if (!parsed) {
    return 12 * (fallbackOctave + 1);
  }

  return 12 * ((parsed.octave ?? fallbackOctave) + 1) + SEMITONES[parsed.pitchClass];
}

function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function midiToNoteName(midi) {
  const pitchClass = NOTE_STRINGS[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${pitchClass}${octave}`;
}

function getPitchClass(note) {
  return note.replace(/\d+/g, "");
}

function getNoteDetails(frequency) {
  const a4 = 440;
  const noteNumber = 69 + 12 * Math.log2(frequency / a4);
  const roundedNote = Math.round(noteNumber);
  const cents = (noteNumber - roundedNote) * 100;
  const noteIndex = ((roundedNote % 12) + 12) % 12;
  const octave = Math.floor(roundedNote / 12) - 1;
  const targetFrequency = a4 * Math.pow(2, (roundedNote - 69) / 12);

  return {
    noteName: `${NOTE_STRINGS[noteIndex]}${octave}`,
    cents,
    targetFrequency,
  };
}

function getSignalLevel(buffer) {
  let sum = 0;

  for (let index = 0; index < buffer.length; index += 1) {
    sum += buffer[index] * buffer[index];
  }

  return Math.sqrt(sum / buffer.length);
}

function autoCorrelate(buffer, sampleRate) {
  const size = buffer.length;
  const correlation = new Array(size).fill(0);
  const rms = getSignalLevel(buffer);

  if (rms < 0.01) {
    return -1;
  }

  let trimStart = 0;
  let trimEnd = size - 1;
  const threshold = 0.2;

  while (trimStart < size / 2 && Math.abs(buffer[trimStart]) < threshold) {
    trimStart += 1;
  }

  while (trimEnd > size / 2 && Math.abs(buffer[trimEnd]) < threshold) {
    trimEnd -= 1;
  }

  const trimmed = buffer.slice(trimStart, trimEnd);
  const trimmedSize = trimmed.length;

  if (!trimmedSize) {
    return -1;
  }

  for (let lag = 0; lag < trimmedSize; lag += 1) {
    for (let index = 0; index < trimmedSize - lag; index += 1) {
      correlation[lag] += trimmed[index] * trimmed[index + lag];
    }
  }

  let dip = 0;

  while (dip + 1 < correlation.length && correlation[dip] > correlation[dip + 1]) {
    dip += 1;
  }

  let bestLag = -1;
  let bestValue = -1;

  for (let lag = dip; lag < trimmedSize; lag += 1) {
    if (correlation[lag] > bestValue) {
      bestValue = correlation[lag];
      bestLag = lag;
    }
  }

  if (bestLag <= 0) {
    return -1;
  }

  const previous = correlation[bestLag - 1] || correlation[bestLag];
  const current = correlation[bestLag];
  const next = correlation[bestLag + 1] || correlation[bestLag];
  const adjustment = (next - previous) / (2 * (2 * current - next - previous));
  const refinedLag = Number.isFinite(adjustment) ? bestLag + adjustment : bestLag;

  return sampleRate / refinedLag;
}

function setMeterPosition(cents) {
  const clampedCents = clamp(cents, -50, 50);
  const angle = clampedCents * 0.95;
  needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
  accuracyMarker.style.left = `${clampedCents + 50}%`;
}

function setFeedbackState(type, text, copy) {
  feedback.textContent = text;
  feedback.className = "feedback-line";

  if (type) {
    feedback.classList.add(type);
  }

  feedbackCopy.textContent = copy;
}

function updateSignalLabel(rms) {
  if (rms < 0.01) {
    signalStrength.textContent = "Signal: none";
  } else if (rms < 0.03) {
    signalStrength.textContent = "Signal: soft";
  } else if (rms < 0.06) {
    signalStrength.textContent = "Signal: good";
  } else {
    signalStrength.textContent = "Signal: strong";
  }
}

function updateStatus(active, message) {
  statusPill.classList.toggle("live", active);
  statusText.textContent = message;
}

function showNoSignalState() {
  noteDisplay.textContent = "--";
  noteMeta.textContent = isTuning
    ? "Listening for a stable string vibration."
    : "Start the tuner and pluck one string clearly.";
  freqDisplay.textContent = "-- Hz";
  centsDisplay.textContent = "0 cents";
  setMeterPosition(0);
  setFeedbackState(
    "",
    "Ready when you are",
    "The needle and accuracy marker will respond as soon as the tuner catches a stable note.",
  );
  statusCopy.textContent = isTuning
    ? "Try muting background noise and pluck only one open string."
    : "Use a quiet room and pluck one open string at a time for the fastest lock.";
}

function resetDisplay() {
  stablePitch = null;
  signalStrength.textContent = "Waiting for signal";
  updateStatus(false, isTuning ? "Listening..." : "Microphone idle");
  showNoSignalState();
}

function clearManualSelection() {
  stringButtons.forEach((button) => button.classList.remove("active"));
}

function highlightStringButton(note) {
  stringButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.note === note);
  });
}

function updateSelectedTarget() {
  if (mode === "manual" && selectedNote) {
    const target = getSelectedTarget();
    lastTargetFrequency = target.frequency;
    targetDisplay.textContent = `${target.label} - ${target.frequency.toFixed(2)} Hz`;
  } else {
    targetDisplay.textContent = "Auto Detect";
  }
}

function setMode(nextMode) {
  mode = nextMode;
  autoBtn.classList.toggle("active", nextMode === "auto");
  manualBtn.classList.toggle("active", nextMode === "manual");
  stringButtonsContainer.classList.toggle("hidden", nextMode !== "manual");

  if (nextMode === "auto") {
    selectedNote = null;
    clearManualSelection();
    targetDisplay.textContent = "Auto Detect";
    modeCopy.textContent = "Automatic mode listens for the closest pitch and finds the nearest note for you.";
  } else {
    selectedNote = selectedNote || activeTuning[0].note;
    highlightStringButton(selectedNote);
    updateSelectedTarget();
    modeCopy.textContent = `Manual mode locks to one string in ${TUNING_PRESETS[activeTuningId].name} tuning.`;
  }

  if (!isTuning) {
    resetDisplay();
  }
}

async function selectString(note) {
  selectedNote = note;
  highlightStringButton(note);
  updateSelectedTarget();
  await playReferenceTone(getSelectedTarget().frequency);
}

function updateDetectedState(pitch) {
  const now = performance.now();

  if (!stablePitch || now - lastUpdateTimestamp > 260) {
    stablePitch = pitch;
  } else {
    stablePitch = stablePitch * 0.7 + pitch * 0.3;
  }

  lastUpdateTimestamp = now;

  const currentPitch = stablePitch;
  const displayPitch = `${currentPitch.toFixed(2)} Hz`;
  freqDisplay.textContent = displayPitch;

  let cents = 0;
  let noteName = "--";
  let targetFrequency = currentPitch;

  if (mode === "manual" && selectedNote) {
    const target = getSelectedTarget();
    targetFrequency = target.frequency;
    cents = 1200 * Math.log2(currentPitch / targetFrequency);
    noteName = selectedNote;
    noteMeta.textContent = `${target.label} target - ${targetFrequency.toFixed(2)} Hz`;
  } else {
    const details = getNoteDetails(currentPitch);
    cents = details.cents;
    noteName = details.noteName;
    targetFrequency = details.targetFrequency;
    noteMeta.textContent = `Nearest pitch target - ${targetFrequency.toFixed(2)} Hz`;
  }

  lastTargetFrequency = targetFrequency;
  noteDisplay.textContent = noteName;
  centsDisplay.textContent = `${cents >= 0 ? "+" : ""}${cents.toFixed(1)} cents`;
  setMeterPosition(cents);

  const absoluteCents = Math.abs(cents);

  if (absoluteCents <= 5) {
    setFeedbackState(
      "good",
      "In tune",
      "Nice. The string is close enough to center for a clean standard tuning.",
    );
    needle.style.background = "linear-gradient(180deg, #8cedbc, #e4ffef)";
  } else if (cents < 0) {
    setFeedbackState(
      "warn",
      "Tune up",
      "The pitch is flat. Tighten the string slightly until the needle settles in the center.",
    );
    needle.style.background = "linear-gradient(180deg, #f8be72, #ffe4bf)";
  } else {
    setFeedbackState(
      "bad",
      "Tune down",
      "The pitch is sharp. Loosen the string a touch and watch the marker move back to center.",
    );
    needle.style.background = "linear-gradient(180deg, #ff708f, #ffd7df)";
  }

  updateStatus(true, "Microphone live");
  statusCopy.textContent = `Detected ${displayPitch} against a target of ${targetFrequency.toFixed(2)} Hz.`;
}

function updateTuner() {
  if (!analyser || !audioCtx) {
    return;
  }

  const buffer = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buffer);

  const rms = getSignalLevel(buffer);
  const pitch = autoCorrelate(buffer, audioCtx.sampleRate);

  updateSignalLabel(rms);

  if (pitch !== -1 && pitch > 60 && pitch < 1400) {
    updateDetectedState(pitch);
  } else {
    showNoSignalState();
  }

  animationId = requestAnimationFrame(updateTuner);
}

async function startTuner() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone access is not supported in this browser.");
  }

  stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  });

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  source = audioCtx.createMediaStreamSource(stream);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.82;

  source.connect(analyser);

  isTuning = true;
  toggleTunerBtn.textContent = "Stop Listening";
  updateStatus(true, "Microphone live");
  signalStrength.textContent = "Listening for signal";
  statusCopy.textContent = "Pluck one string cleanly and let it ring for a moment.";
  updateTuner();
}

async function stopTuner() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  if (audioCtx) {
    await audioCtx.close();
    audioCtx = null;
  }

  source = null;
  analyser = null;
  isTuning = false;
  toggleTunerBtn.textContent = "Start Listening";
  resetDisplay();
}

async function toggleTuner() {
  toggleTunerBtn.disabled = true;

  try {
    if (isTuning) {
      await stopTuner();
    } else {
      await startTuner();
    }
  } catch (error) {
    isTuning = false;
    toggleTunerBtn.textContent = "Start Listening";
    updateStatus(false, "Microphone unavailable");
    signalStrength.textContent = "Permission needed";
    setFeedbackState(
      "bad",
      "Microphone blocked",
      error.message || "Allow microphone access so the tuner can listen.",
    );
    statusCopy.textContent = "If your browser asked for access, approve it and try again.";
  } finally {
    toggleTunerBtn.disabled = false;
  }
}

function createNoiseBuffer(context) {
  const duration = 0.25;
  const frameCount = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    const fade = 1 - index / frameCount;
    channel[index] = (Math.random() * 2 - 1) * fade;
  }

  return buffer;
}

function connectToMaster(context, node, pan = 0) {
  if (context.createStereoPanner) {
    const panner = context.createStereoPanner();
    panner.pan.value = pan;
    node.connect(panner);
    panner.connect(playbackMaster);
    return panner;
  }

  node.connect(playbackMaster);
  return playbackMaster;
}

async function ensurePlaybackContext() {
  if (!playbackContext || playbackContext.state === "closed") {
    playbackContext = new (window.AudioContext || window.webkitAudioContext)();
    playbackMaster = playbackContext.createGain();
    const compressor = playbackContext.createDynamicsCompressor();

    compressor.threshold.value = -22;
    compressor.knee.value = 22;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.22;

    playbackMaster.gain.value = 0.92;
    playbackMaster.connect(compressor);
    compressor.connect(playbackContext.destination);
    playbackNoiseBuffer = createNoiseBuffer(playbackContext);
  }

  if (playbackContext.state === "suspended") {
    await playbackContext.resume();
  }

  return playbackContext;
}

function schedulePluckedTone(context, frequency, options = {}) {
  const startTime = options.start ?? context.currentTime;
  const duration = options.duration ?? 1.4;
  const volume = options.volume ?? 0.18;
  const pan = options.pan ?? 0;
  const accent = options.accent ?? 1;
  const voiceBus = context.createGain();
  const filter = context.createBiquadFilter();
  const amplifier = context.createGain();

  filter.type = "lowpass";
  filter.Q.value = 3.2;
  filter.frequency.setValueAtTime(Math.max(900, frequency * 8), startTime);
  filter.frequency.exponentialRampToValueAtTime(Math.max(480, frequency * 2.4), startTime + duration);

  amplifier.gain.setValueAtTime(0.0001, startTime);
  amplifier.gain.linearRampToValueAtTime(volume * accent, startTime + 0.012);
  amplifier.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.42), startTime + 0.16);
  amplifier.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  voiceBus.connect(filter);
  filter.connect(amplifier);
  connectToMaster(context, amplifier, pan);

  const oscillatorLayers = [
    { type: "triangle", ratio: 1, level: 0.58, detune: -3 },
    { type: "sine", ratio: 2, level: 0.16, detune: 2 },
    { type: "sawtooth", ratio: 1, level: 0.06, detune: 0 },
  ];

  oscillatorLayers.forEach((layer) => {
    const oscillator = context.createOscillator();
    const layerGain = context.createGain();

    oscillator.type = layer.type;
    oscillator.frequency.setValueAtTime(frequency * layer.ratio, startTime);
    oscillator.detune.setValueAtTime(layer.detune, startTime);

    layerGain.gain.setValueAtTime(layer.level, startTime);

    oscillator.connect(layerGain);
    layerGain.connect(voiceBus);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.08);
  });

  if (playbackNoiseBuffer) {
    const noiseSource = context.createBufferSource();
    const noiseFilter = context.createBiquadFilter();
    const noiseGain = context.createGain();

    noiseSource.buffer = playbackNoiseBuffer;
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(Math.max(1200, frequency * 10), startTime);
    noiseFilter.Q.value = 0.8;

    noiseGain.gain.setValueAtTime(0.0001, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.035 * accent, startTime + 0.002);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.055);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(voiceBus);
    noiseSource.start(startTime);
    noiseSource.stop(startTime + 0.06);
  }
}

function scheduleMetronomeClick(context, time, isAccent) {
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  oscillator.type = isAccent ? "triangle" : "square";
  oscillator.frequency.setValueAtTime(isAccent ? 1820 : 1260, time);
  oscillator.frequency.exponentialRampToValueAtTime(isAccent ? 960 : 740, time + 0.05);

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(isAccent ? 1600 : 1100, time);
  filter.Q.value = 6;

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(isAccent ? 0.22 : 0.14, time + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.055);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(playbackMaster);
  oscillator.start(time);
  oscillator.stop(time + 0.07);

  if (playbackNoiseBuffer) {
    const noise = context.createBufferSource();
    const noiseFilter = context.createBiquadFilter();
    const noiseGain = context.createGain();

    noise.buffer = playbackNoiseBuffer;
    noiseFilter.type = "highpass";
    noiseFilter.frequency.setValueAtTime(isAccent ? 2100 : 1600, time);

    noiseGain.gain.setValueAtTime(0.0001, time);
    noiseGain.gain.exponentialRampToValueAtTime(isAccent ? 0.065 : 0.04, time + 0.001);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.028);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(playbackMaster);
    noise.start(time);
    noise.stop(time + 0.03);
  }
}

async function playReferenceTone(frequency) {
  const context = await ensurePlaybackContext();
  const start = context.currentTime + 0.02;

  schedulePluckedTone(context, frequency, {
    start,
    duration: 1.7,
    volume: 0.2,
    pan: -0.04,
    accent: 1.08,
  });

  schedulePluckedTone(context, frequency * 2, {
    start: start + 0.01,
    duration: 1.1,
    volume: 0.05,
    pan: 0.04,
    accent: 0.8,
  });
}

function formatChordName(root, type) {
  const formula = CHORD_FORMULAS[type] || CHORD_FORMULAS.maj;
  return `${root}${formula.symbol}`;
}

function buildChordNotes(root, type) {
  const formula = CHORD_FORMULAS[type] || CHORD_FORMULAS.maj;
  const rootMidi = noteNameToMidi(root, 3);

  return formula.intervals.map((interval, index) => {
    const midi = rootMidi + interval;
    const name = midiToNoteName(midi);

    return {
      midi,
      pitch: midiToFrequency(midi),
      name,
      shortName: getPitchClass(name),
      degreeLabel: formula.degrees[index],
      isRoot: interval === 0,
    };
  });
}

function buildChordVoicing(root, type) {
  const notes = buildChordNotes(root, type);
  const rootMidi = notes[0].midi;
  const thirdMidi = notes[1].midi + 12;
  const fifthMidi = notes[Math.min(2, notes.length - 1)].midi;
  const voicing = [rootMidi, fifthMidi, rootMidi + 12, thirdMidi];

  if (notes[3]) {
    voicing.push(notes[3].midi + 12);
  } else {
    voicing.push(notes[Math.min(2, notes.length - 1)].midi + 12);
  }

  return [...new Set(voicing)]
    .sort((left, right) => left - right)
    .map((midi) => ({
      midi,
      pitch: midiToFrequency(midi),
      name: midiToNoteName(midi),
    }));
}

function getPitchClassDistance(fromPitchClass, toPitchClass) {
  return (SEMITONES[toPitchClass] - SEMITONES[fromPitchClass] + 12) % 12;
}

function getFretForPitchClass(openNote, targetPitchClass) {
  const openPitchClass = getPitchClass(openNote);
  return getPitchClassDistance(openPitchClass, targetPitchClass);
}

function createOffsetShape(root, type, template, rootStringIndex) {
  const baseFret = getFretForPitchClass(activeTuning[rootStringIndex].note, root);
  const frets = template.offsets.map((offset) => (offset === null ? null : offset + baseFret));
  const name = `${formatChordName(root, type)} ${template.label}`;

  return {
    id: `${activeTuningId}-${root}-${type}-${template.label}`,
    name,
    frets,
    fingers: template.fingers,
    tuningOnly: TUNING_PRESETS[activeTuningId].name,
    summary: `Moveable ${template.label.toLowerCase()} in ${TUNING_PRESETS[activeTuningId].name} tuning.`,
  };
}

function createOpenTuningBarreShape(root, type) {
  const openRoot = OPEN_TUNING_ROOTS[activeTuningId];

  if (!openRoot || type !== "maj") {
    return null;
  }

  const barreFret = getPitchClassDistance(openRoot, root);
  const isOpen = barreFret === 0;

  return {
    id: `${activeTuningId}-${root}-open-tuning-barre`,
    name: `${formatChordName(root, type)} open-tuning ${isOpen ? "open" : "barre"}`,
    frets: Array(6).fill(barreFret),
    fingers: Array(6).fill(isOpen ? null : 1),
    tuningOnly: TUNING_PRESETS[activeTuningId].name,
    summary: isOpen
      ? `Use all open strings in ${TUNING_PRESETS[activeTuningId].name} tuning.`
      : `Barre all six strings at fret ${barreFret} in ${TUNING_PRESETS[activeTuningId].name} tuning.`,
  };
}

function getAvailableShapes(root, type) {
  const shapes = [];
  const openShapes = OPEN_STANDARD_SHAPES[`${root}:${type}`] || [];

  if (activeTuningId === "standard") {
    shapes.push(
      ...openShapes.map((shape, index) => ({
        ...shape,
        id: `standard-open-${root}-${type}-${index}`,
        tuningOnly: "Standard",
        summary: "Open-position standard tuning shape.",
      })),
    );
  }

  if (["standard", "halfStepDown"].includes(activeTuningId) && E_SHAPE_TEMPLATES[type]) {
    shapes.push(createOffsetShape(root, type, E_SHAPE_TEMPLATES[type], 0));
  }

  if (["standard", "halfStepDown", "dropD"].includes(activeTuningId) && A_SHAPE_TEMPLATES[type]) {
    shapes.push(createOffsetShape(root, type, A_SHAPE_TEMPLATES[type], 1));
  }

  const openTuningShape = createOpenTuningBarreShape(root, type);

  if (openTuningShape) {
    shapes.push(openTuningShape);
  }

  return shapes;
}

function renderShapeOptions(root, type) {
  const previousId = chordShapeSelect.value;
  const shapes = getAvailableShapes(root, type);
  chordShapeSelect.innerHTML = "";

  if (!shapes.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Tone map only";
    chordShapeSelect.append(option);
    chordShapeSelect.disabled = true;
    return shapes;
  }

  shapes.forEach((shape, index) => {
    const option = document.createElement("option");
    option.value = shape.id;
    option.textContent = shape.name;
    chordShapeSelect.append(option);

    if (shape.id === previousId || index === 0) {
      chordShapeSelect.value = shape.id;
    }
  });

  chordShapeSelect.disabled = false;
  return shapes;
}

function getSelectedShape(root, type) {
  const shapes = getAvailableShapes(root, type);
  return shapes.find((shape) => shape.id === chordShapeSelect.value) || shapes[0] || null;
}

function formatShapeFrets(shape) {
  return shape.frets.map((fret) => (fret === null ? "x" : String(fret))).join(" ");
}

function getShapeStartFret(shape) {
  const fretted = shape.frets.filter((fret) => Number.isFinite(fret) && fret > 0);

  if (!fretted.length) {
    return 1;
  }

  return Math.max(1, Math.min(...fretted));
}

function renderChordShape(shape) {
  chordShapeDiagram.innerHTML = "";

  if (!shape) {
    chordShapeName.textContent = "Tone map only";
    chordShapeSummary.textContent =
      `${TUNING_PRESETS[activeTuningId].name} does not have a safe built-in shape for this chord yet, so use the note map.`;
    chordShapeDiagram.innerHTML = `<div class="shape-empty">No playable shape loaded for this chord and tuning.</div>`;
    return;
  }

  const startFret = getShapeStartFret(shape);
  chordShapeName.textContent = shape.name;
  chordShapeSummary.textContent = `${shape.summary} Frets 6 to 1: ${formatShapeFrets(shape)}.`;

  shape.frets.forEach((fret, stringIndex) => {
    const stringColumn = document.createElement("div");
    const state = document.createElement("div");
    stringColumn.className = "shape-string";
    state.className = "shape-string-state";

    if (fret === null) {
      state.textContent = "X";
      state.classList.add("muted");
    } else if (fret === 0) {
      state.textContent = "O";
      state.classList.add("open");
    } else {
      state.textContent = String(6 - stringIndex);
    }

    stringColumn.append(state);

    for (let row = 0; row < 5; row += 1) {
      const fretBox = document.createElement("div");
      const displayedFret = startFret + row;
      fretBox.className = "shape-fret";

      if (fret === displayedFret) {
        const finger = document.createElement("div");
        finger.className = "shape-finger";
        finger.textContent = shape.fingers[stringIndex] || 1;
        fretBox.append(finger);
      } else if (stringIndex === 0) {
        const fretNumber = document.createElement("span");
        fretNumber.className = "shape-fret-number";
        fretNumber.textContent = displayedFret;
        fretBox.append(fretNumber);
      }

      stringColumn.append(fretBox);
    }

    chordShapeDiagram.append(stringColumn);
  });
}

function getShapeVoicing(shape) {
  if (!shape) {
    return [];
  }

  return shape.frets
    .map((fret, stringIndex) => {
      if (fret === null) {
        return null;
      }

      const midi = noteNameToMidi(activeTuning[stringIndex].note) + fret;

      return {
        midi,
        pitch: midiToFrequency(midi),
        name: midiToNoteName(midi),
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.midi - right.midi);
}

function buildPlayableVoicing(root, type) {
  const shape = getSelectedShape(root, type);
  const shapeVoicing = getShapeVoicing(shape);

  return shapeVoicing.length ? shapeVoicing : buildChordVoicing(root, type);
}

function renderIntervalChips(notes) {
  intervalChips.innerHTML = "";

  notes.forEach((note) => {
    const chip = document.createElement("div");
    chip.className = "interval-chip";
    chip.innerHTML = `
      <span class="interval-chip-label">${note.degreeLabel}</span>
      <span class="interval-chip-value">${note.shortName}</span>
    `;
    intervalChips.append(chip);
  });
}

function renderChordNotes(notes) {
  chordNotes.innerHTML = "";

  notes.forEach((note) => {
    const pill = document.createElement("div");
    pill.className = `note-pill${note.isRoot ? " root" : ""}`;
    pill.innerHTML = `<strong>${note.name}</strong><span>${note.degreeLabel}</span>`;
    chordNotes.append(pill);
  });
}

function renderFretboard(notes) {
  fretboardMap.innerHTML = "";

  const lookup = new Map(notes.map((note) => [note.shortName, note]));
  const headerRow = document.createElement("div");
  headerRow.className = "fretboard-row";

  const blankLabel = document.createElement("span");
  blankLabel.className = "fretboard-string-label";
  blankLabel.textContent = "String";
  headerRow.append(blankLabel);

  for (let fret = 0; fret <= 5; fret += 1) {
    const fretLabel = document.createElement("span");
    fretLabel.className = "fretboard-fret-label";
    fretLabel.textContent = String(fret);
    headerRow.append(fretLabel);
  }

  fretboardMap.append(headerRow);

  activeTuning.forEach((string) => {
    const row = document.createElement("div");
    row.className = "fretboard-row";

    const stringLabel = document.createElement("span");
    stringLabel.className = "fretboard-string-label";
    stringLabel.textContent = string.label;
    row.append(stringLabel);

    const openMidi = noteNameToMidi(string.note);

    for (let fret = 0; fret <= 5; fret += 1) {
      const cell = document.createElement("div");
      cell.className = "fretboard-cell";
      const cellNoteName = midiToNoteName(openMidi + fret);
      const chordNote = lookup.get(getPitchClass(cellNoteName));

      if (chordNote) {
        cell.classList.add("active");
        const marker = document.createElement("div");
        marker.className = `fretboard-marker ${chordNote.isRoot ? "root" : "tone"}`;
        marker.textContent = chordNote.degreeLabel;
        cell.append(marker);
      }

      row.append(cell);
    }

    fretboardMap.append(row);
  });
}

function degreeToRootInKey(keyRoot, degree) {
  const majorScaleSteps = [0, 2, 4, 5, 7, 9, 11];
  const offset = majorScaleSteps[(degree - 1) % 7];
  const rootSemitone = SEMITONES[keyRoot];
  const semitone = (rootSemitone + offset) % 12;
  return NOTE_STRINGS[semitone];
}

function getSelectedProgression() {
  return PROGRESSION_LIBRARY[progressionSelect.value] || PROGRESSION_LIBRARY["I-IV-V"];
}

function renderProgressionPreview(activeIndex = -1) {
  const key = chordRoot.value || "E";
  const progression = getSelectedProgression();
  progressionMap.innerHTML = "";

  const chordNames = progression.steps.map((step, index) => {
    const root = degreeToRootInKey(key, step.degree);
    const chordName = formatChordName(root, step.type);
    const stepElement = document.createElement("div");

    stepElement.className = `progression-step${index === activeIndex ? " active" : ""}`;
    stepElement.innerHTML = `
      <span class="roman">${step.roman}</span>
      <span class="name">${chordName}</span>
    `;

    progressionMap.append(stepElement);
    return chordName;
  });

  progressionDescription.textContent = `${progression.description} In ${key}, that gives you ${chordNames.join(" - ")}.`;
}

function showChord() {
  const root = chordRoot.value || "E";
  const type = chordType.value || "maj";
  const formula = CHORD_FORMULAS[type] || CHORD_FORMULAS.maj;
  const notes = buildChordNotes(root, type);

  chordDisplay.textContent = formatChordName(root, type);
  chordMood.textContent = formula.mood;
  chordFingering.textContent = `${formula.name} voicing. ${formula.description} Notes: ${notes
    .map((note) => note.name)
    .join(", ")}.`;
  renderIntervalChips(notes);
  renderChordNotes(notes);
  renderFretboard(notes);
  renderShapeOptions(root, type);
  renderChordShape(getSelectedShape(root, type));
  renderProgressionPreview();
}

async function playChordVoicing(notes, options = {}) {
  const context = await ensurePlaybackContext();
  const strumMilliseconds = options.strumMs ?? 56;
  const holdMilliseconds = options.holdMs ?? 1200;
  const start = context.currentTime + 0.02;

  notes.forEach((note, index) => {
    const panSpread = notes.length > 1 ? -0.34 + (index / (notes.length - 1)) * 0.68 : 0;

    schedulePluckedTone(context, note.pitch, {
      start: start + (index * strumMilliseconds) / 1000,
      duration: 1.45 + index * 0.06,
      volume: index === 0 ? 0.18 : 0.14,
      pan: panSpread,
      accent: index === 0 ? 1.12 : 0.96,
    });
  });

  await wait(Math.max(holdMilliseconds, notes.length * strumMilliseconds + 260));
}

function getTempoFeel(bpm) {
  if (bpm < 70) {
    return "Slow and deliberate";
  }

  if (bpm < 110) {
    return "Relaxed groove";
  }

  if (bpm < 150) {
    return "Steady practice pocket";
  }

  return "Fast picking zone";
}

function renderSubdivisionTrack(activeIndex = -1) {
  const visibleSteps = metronomeState.subdivision * metronomeState.beatsPerBar;

  if (!subdivisionTrack.childElementCount) {
    for (let index = 0; index < 16; index += 1) {
      const step = document.createElement("span");
      step.className = "subdivision-step";
      subdivisionTrack.append(step);
    }
  }

  [...subdivisionTrack.children].forEach((step, index) => {
    step.className = "subdivision-step";

    if (index >= visibleSteps) {
      step.classList.add("is-hidden");
      return;
    }

    if (index % metronomeState.subdivision === 0) {
      step.classList.add("is-accent");
    }

    if (index === activeIndex) {
      step.classList.add("is-active");
    }
  });
}

function updateMetronomeReadout(activeStep = 0) {
  const bpm = metronomeState.bpm;
  const beat = Math.floor(activeStep / metronomeState.subdivision) % metronomeState.beatsPerBar + 1;

  tempoBadge.textContent = `${bpm} BPM`;
  tempoReadout.textContent = String(bpm);
  subdivisionLabel.textContent = SUBDIVISION_LABELS[metronomeState.subdivision];
  beatCounter.textContent = `${beat} / ${metronomeState.beatsPerBar}`;
  tempoFeel.textContent = getTempoFeel(bpm);
}

function pulseMetronomeVisual(stepIndex, time) {
  const delay = Math.max(0, (time - playbackContext.currentTime) * 1000);
  const visibleSteps = metronomeState.subdivision * metronomeState.beatsPerBar;
  const normalizedStep = stepIndex % visibleSteps;

  setTimeout(() => {
    metronomeBeat.classList.add("active");
    tempoDial?.classList.add("active");
    renderSubdivisionTrack(normalizedStep);
    updateMetronomeReadout(normalizedStep);

    setTimeout(() => {
      metronomeBeat.classList.remove("active");
      tempoDial?.classList.remove("active");
    }, 120);
  }, delay);
}

function nextMetronomeStep() {
  const secondsPerBeat = 60 / metronomeState.bpm;
  metronomeState.nextNoteTime += secondsPerBeat / metronomeState.subdivision;
  metronomeState.currentStep += 1;
}

function metronomeScheduler() {
  if (!playbackContext) {
    return;
  }

  while (metronomeState.nextNoteTime < playbackContext.currentTime + metronomeState.scheduleAheadTime) {
    const stepIndex = metronomeState.currentStep;
    const isAccent = stepIndex % metronomeState.subdivision === 0;

    scheduleMetronomeClick(playbackContext, metronomeState.nextNoteTime, isAccent);
    pulseMetronomeVisual(stepIndex, metronomeState.nextNoteTime);
    nextMetronomeStep();
  }
}

async function startMetronome() {
  if (metronomeState.isRunning) {
    return;
  }

  await ensurePlaybackContext();
  metronomeState.isRunning = true;
  metronomeState.currentStep = 0;
  metronomeState.nextNoteTime = playbackContext.currentTime + 0.05;
  metronomeState.timerId = window.setInterval(metronomeScheduler, metronomeState.lookaheadMs);
  toggleMetronomeBtn.textContent = "Metronome On";
  updateMetronomeReadout(0);
  renderSubdivisionTrack(0);
}

function stopMetronome() {
  if (!metronomeState.isRunning) {
    return;
  }

  metronomeState.isRunning = false;

  if (metronomeState.timerId) {
    clearInterval(metronomeState.timerId);
    metronomeState.timerId = null;
  }

  toggleMetronomeBtn.textContent = "Metronome Off";
  metronomeBeat.classList.remove("active");
  tempoDial?.classList.remove("active");
  renderSubdivisionTrack();
  updateMetronomeReadout(0);
}

async function toggleMetronome() {
  if (metronomeState.isRunning) {
    stopMetronome();
  } else {
    await startMetronome();
  }
}

function setMetronomeBpm(bpm) {
  const nextBpm = clamp(Number(bpm) || 120, 30, 300);
  metronomeState.bpm = nextBpm;
  bpmInput.value = String(nextBpm);
  updateMetronomeReadout(metronomeState.currentStep);

  if (metronomeState.isRunning && playbackContext) {
    metronomeState.currentStep = 0;
    metronomeState.nextNoteTime = playbackContext.currentTime + 0.05;
  }
}

function setMetronomeSubdivision(subdivision) {
  const nextSubdivision = clamp(Number(subdivision) || 1, 1, 4);
  metronomeState.subdivision = nextSubdivision;
  subdivisionSelect.value = String(nextSubdivision);
  renderSubdivisionTrack();
  updateMetronomeReadout(metronomeState.currentStep);

  if (metronomeState.isRunning && playbackContext) {
    metronomeState.currentStep = 0;
    metronomeState.nextNoteTime = playbackContext.currentTime + 0.05;
  }
}

function handleTapTempo() {
  const now = performance.now();
  tapTimes = tapTimes.filter((timestamp) => now - timestamp < 2200);
  tapTimes.push(now);

  if (tapTimes.length < 2) {
    return;
  }

  const intervals = [];

  for (let index = 1; index < tapTimes.length; index += 1) {
    intervals.push(tapTimes[index] - tapTimes[index - 1]);
  }

  const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  const bpm = Math.round(60000 / averageInterval);
  setMetronomeBpm(bpm);
}

toggleTunerBtn.addEventListener("click", toggleTuner);

playReferenceBtn.addEventListener("click", async () => {
  const frequency = mode === "manual" && selectedNote ? getSelectedTarget().frequency : lastTargetFrequency;
  try {
    await playReferenceTone(frequency);
  } catch (error) {
    reportPlaybackError(error);
  }
});

autoBtn.addEventListener("click", () => setMode("auto"));
manualBtn.addEventListener("click", () => setMode("manual"));

stringButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (mode !== "manual") {
      setMode("manual");
    }

    try {
      await selectString(button.dataset.note);
    } catch (error) {
      reportPlaybackError(error);
    }
  });
});

toggleMetronomeBtn?.addEventListener("click", async () => {
  try {
    await toggleMetronome();
  } catch (error) {
    reportPlaybackError(error);
  }
});

bpmInput?.addEventListener("input", (event) => {
  setMetronomeBpm(event.target.value);
});

bpmInput?.addEventListener("change", (event) => {
  setMetronomeBpm(event.target.value);
});

subdivisionSelect?.addEventListener("change", (event) => {
  setMetronomeSubdivision(event.target.value);
});

tapTempoBtn?.addEventListener("click", handleTapTempo);

tuningSelect?.addEventListener("change", (event) => {
  setTuning(event.target.value);
});

chordShapeSelect?.addEventListener("change", () => {
  const root = chordRoot.value || "E";
  const type = chordType.value || "maj";
  renderChordShape(getSelectedShape(root, type));
});

playChordBtn?.addEventListener("click", async () => {
  if (isProgressionPlaying) {
    return;
  }

  const root = chordRoot.value || "E";
  const type = chordType.value || "maj";

  showChord();
  playChordBtn.disabled = true;

  try {
    await playChordVoicing(buildPlayableVoicing(root, type), { strumMs: 52, holdMs: 1000 });
  } catch (error) {
    reportPlaybackError(error);
  } finally {
    playChordBtn.disabled = false;
  }
});

playProgressionBtn?.addEventListener("click", async () => {
  if (isProgressionPlaying) {
    return;
  }

  const key = chordRoot.value || "E";
  const progression = getSelectedProgression();

  isProgressionPlaying = true;
  playProgressionBtn.disabled = true;
  playChordBtn.disabled = true;

  try {
    for (let index = 0; index < progression.steps.length; index += 1) {
      const step = progression.steps[index];
      const root = degreeToRootInKey(key, step.degree);
      const notes = buildChordNotes(root, step.type);

      chordDisplay.textContent = formatChordName(root, step.type);
      chordMood.textContent = `Progression step ${index + 1} of ${progression.steps.length}`;
      chordFingering.textContent = `${step.roman} in ${key}. ${CHORD_FORMULAS[step.type].description}`;
      renderIntervalChips(notes);
      renderChordNotes(notes);
      renderFretboard(notes);
      renderShapeOptions(root, step.type);
      renderChordShape(getSelectedShape(root, step.type));
      renderProgressionPreview(index);
      await playChordVoicing(buildPlayableVoicing(root, step.type), { strumMs: 66, holdMs: 1120 });
    }
  } catch (error) {
    reportPlaybackError(error);
  } finally {
    isProgressionPlaying = false;
    playProgressionBtn.disabled = false;
    playChordBtn.disabled = false;
    showChord();
  }
});

if (chordRoot && chordType) {
  chordRoot.addEventListener("change", showChord);
  chordType.addEventListener("change", showChord);
}

progressionSelect?.addEventListener("change", () => {
  renderProgressionPreview();
});

setTuning("standard");
setMode("auto");
renderSubdivisionTrack();
updateMetronomeReadout();
