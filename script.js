// Speech Recognition Setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US'; // Default language
recognition.interimResults = true;

const micBtn = document.getElementById('mic-btn');
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const sourceLang = document.getElementById('source-lang');
const targetLang = document.getElementById('target-lang');
const translateBtn = document.getElementById('translate-btn');
const speakBtn = document.getElementById('speak-btn');

// Update recognition language when source language changes
sourceLang.addEventListener('change', () => {
    recognition.lang = sourceLang.value;
});

// Speech Recognition
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
        .map(result => result[0].transcript)
        .join('');
    inputText.value = transcript;
};

recognition.onend = () => {
    micBtn.classList.remove('active');
};

// Translation Function (Using LibreTranslate API)
async function translateText(text, source, target) {
    try {
        const response = await fetch('https://libretranslate.com/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: source,
                target: target,
                format: 'text'
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return 'Translation failed. Please try again.';
    }
}

translateBtn.addEventListener('click', async () => {
    const text = inputText.value;
    if (text.trim() === '') return;
    const translated = await translateText(text, sourceLang.value, targetLang.value);
    outputText.value = translated;
});

// Text-to-Speech
speakBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(outputText.value);
    utterance.lang = targetLang.value;
    window.speechSynthesis.speak(utterance);
});
