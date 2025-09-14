// DOM Elements
const micBtn = document.getElementById('mic-btn');
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const sourceLang = document.getElementById('source-lang');
const targetLang = document.getElementById('target-lang');
const translateBtn = document.getElementById('translate-btn');
const speakBtn = document.getElementById('speak-btn');

// ------------------- SPEECH RECOGNITION -------------------
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = true;

sourceLang.addEventListener('change', () => {
  recognition.lang = sourceLang.value || 'en-US';
});

micBtn.addEventListener('click', () => {
  if (micBtn.classList.contains('active')) {
    recognition.stop();
    micBtn.classList.remove('active');
  } else {
    recognition.start();
    micBtn.classList.add('active');
  }
});

recognition.onresult = (event) => {
  const transcript = Array.from(event.results)
    .map(r => r[0].transcript)
    .join('');
  inputText.value = transcript;
};

recognition.onend = () => micBtn.classList.remove('active');

// ------------------- TRANSLATION -------------------
async function translateText(text, source, target) {
  const payload = {
    q: text,
    source: source === "" ? "auto" : source,
    target: target,
    format: "text"
  };

  try {
    const res = await fetch("http://localhost:3000/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.translatedText;
  } catch (err) {
    console.error("Translation error:", err);
    return "❌ Translation failed. Try again.";
  }
}

translateBtn.addEventListener('click', async () => {
  const text = inputText.value.trim();
  if (!text) return;
  outputText.value = "⏳ Translating...";
  const translated = await translateText(text, sourceLang.value, targetLang.value);
  outputText.value = translated;
});

// ------------------- TEXT TO SPEECH -------------------
speakBtn.addEventListener('click', () => {
  if (!outputText.value.trim()) return;
  const utterance = new SpeechSynthesisUtterance(outputText.value);
  utterance.lang = targetLang.value || "en-US";
  window.speechSynthesis.speak(utterance);
});
a
