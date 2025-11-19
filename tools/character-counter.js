// Character Counter - All-in-one Pocket
// Made by ShifoSan

// DOM Elements
const textInput = document.getElementById('textInput');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');

// Stat elements
const charCount = document.getElementById('charCount');
const charNoSpaces = document.getElementById('charNoSpaces');
const wordCount = document.getElementById('wordCount');
const lineCount = document.getElementById('lineCount');
const sentenceCount = document.getElementById('sentenceCount');
const paragraphCount = document.getElementById('paragraphCount');
const readTime = document.getElementById('readTime');
const speakTime = document.getElementById('speakTime');

// Analysis elements
const avgWordLength = document.getElementById('avgWordLength');
const longestWord = document.getElementById('longestWord');
const uniqueWords = document.getElementById('uniqueWords');
const commonWord = document.getElementById('commonWord');
const uppercaseCount = document.getElementById('uppercaseCount');
const lowercaseCount = document.getElementById('lowercaseCount');
const numberCount = document.getElementById('numberCount');
const specialCount = document.getElementById('specialCount');

// Initialize
initialize();

function initialize() {
    // Event listeners
    textInput.addEventListener('input', analyzeText);
    clearBtn.addEventListener('click', clearText);
    copyBtn.addEventListener('click', copyStats);
    
    // Initial analysis
    analyzeText();
}

function analyzeText() {
    const text = textInput.value;
    
    // Basic counts
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = getWordCount(text);
    const lines = getLineCount(text);
    const sentences = getSentenceCount(text);
    const paragraphs = getParagraphCount(text);
    
    // Time estimates
    const readTimeMin = calculateReadTime(words);
    const speakTimeMin = calculateSpeakTime(words);
    
    // Update primary stats
    charCount.textContent = formatNumber(chars);
    charNoSpaces.textContent = formatNumber(charsNoSpaces);
    wordCount.textContent = formatNumber(words);
    lineCount.textContent = formatNumber(lines);
    sentenceCount.textContent = formatNumber(sentences);
    paragraphCount.textContent = formatNumber(paragraphs);
    readTime.textContent = readTimeMin;
    speakTime.textContent = speakTimeMin;
    
    // Advanced analysis
    performAdvancedAnalysis(text);
}

function getWordCount(text) {
    if (!text.trim()) return 0;
    const words = text.trim().split(/\s+/);
    return words.filter(word => word.length > 0).length;
}

function getLineCount(text) {
    if (!text) return 0;
    return text.split('\n').length;
}

function getSentenceCount(text) {
    if (!text.trim()) return 0;
    const sentences = text.match(/[.!?]+/g);
    return sentences ? sentences.length : 0;
}

function getParagraphCount(text) {
    if (!text.trim()) return 0;
    const paragraphs = text.split(/\n\n+/);
    return paragraphs.filter(p => p.trim().length > 0).length;
}

function calculateReadTime(words) {
    // Average reading speed: 200-250 words per minute
    const wpm = 225;
    const minutes = Math.ceil(words / wpm);
    return minutes === 0 ? '< 1 min' : `${minutes} min`;
}

function calculateSpeakTime(words) {
    // Average speaking speed: 130-150 words per minute
    const wpm = 140;
    const minutes = Math.ceil(words / wpm);
    return minutes === 0 ? '< 1 min' : `${minutes} min`;
}

function performAdvancedAnalysis(text) {
    if (!text.trim()) {
        avgWordLength.textContent = '0';
        longestWord.textContent = '-';
        uniqueWords.textContent = '0';
        commonWord.textContent = '-';
        uppercaseCount.textContent = '0';
        lowercaseCount.textContent = '0';
        numberCount.textContent = '0';
        specialCount.textContent = '0';
        return;
    }
    
    // Extract words
    const words = text.toLowerCase().match(/\b[a-z]+\b/gi) || [];
    
    // Average word length
    if (words.length > 0) {
        const totalLength = words.reduce((sum, word) => sum + word.length, 0);
        avgWordLength.textContent = (totalLength / words.length).toFixed(1);
    } else {
        avgWordLength.textContent = '0';
    }
    
    // Longest word
    if (words.length > 0) {
        const longest = words.reduce((a, b) => a.length > b.length ? a : b);
        longestWord.textContent = longest.length > 15 ? longest.substring(0, 15) + '...' : longest;
    } else {
        longestWord.textContent = '-';
    }
    
    // Unique words
    const uniqueWordSet = new Set(words.map(w => w.toLowerCase()));
    uniqueWords.textContent = formatNumber(uniqueWordSet.size);
    
    // Most common word
    if (words.length > 0) {
        const wordFreq = {};
        words.forEach(word => {
            const w = word.toLowerCase();
            wordFreq[w] = (wordFreq[w] || 0) + 1;
        });
        
        const sortedWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]);
        const most = sortedWords[0][0];
        commonWord.textContent = most.length > 15 ? most.substring(0, 15) + '...' : most;
    } else {
        commonWord.textContent = '-';
    }
    
    // Character type counts
    const uppercase = (text.match(/[A-Z]/g) || []).length;
    const lowercase = (text.match(/[a-z]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;
    const special = text.length - uppercase - lowercase - numbers - (text.match(/\s/g) || []).length;
    
    uppercaseCount.textContent = formatNumber(uppercase);
    lowercaseCount.textContent = formatNumber(lowercase);
    numberCount.textContent = formatNumber(numbers);
    specialCount.textContent = formatNumber(special);
}

function formatNumber(num) {
    return num.toLocaleString();
}

function clearText() {
    textInput.value = '';
    analyzeText();
    textInput.focus();
}

function copyStats() {
    const text = textInput.value;
    const stats = `
Text Statistics:
================
Characters: ${charCount.textContent}
Characters (no spaces): ${charNoSpaces.textContent}
Words: ${wordCount.textContent}
Lines: ${lineCount.textContent}
Sentences: ${sentenceCount.textContent}
Paragraphs: ${paragraphCount.textContent}
Reading Time: ${readTime.textContent}
Speaking Time: ${speakTime.textContent}

Advanced Analysis:
==================
Average Word Length: ${avgWordLength.textContent}
Longest Word: ${longestWord.textContent}
Unique Words: ${uniqueWords.textContent}
Most Common Word: ${commonWord.textContent}
Uppercase Letters: ${uppercaseCount.textContent}
Lowercase Letters: ${lowercaseCount.textContent}
Numbers: ${numberCount.textContent}
Special Characters: ${specialCount.textContent}
`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(stats).then(() => {
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✔️ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, #00FF00, #00CC00)';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy statistics');
    });
}