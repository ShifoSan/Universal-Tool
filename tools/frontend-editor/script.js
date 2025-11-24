document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Initialization ---
    const editors = {};
    const STORAGE_KEY = 'unitool_fe_code';

    // Default Code
    const defaults = {
        html: '<h1>Hello, Universal Tool!</h1>\n<button id="btn">Click Me</button>',
        css: 'body {\n  font-family: sans-serif;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  margin: 0;\n  background: #f0f9ff;\n}\n\nh1 {\n  color: #0f172a;\n}\n\nbutton {\n  padding: 10px 20px;\n  background: #6366f1;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 1rem;\n}\n\nbutton:hover {\n  background: #4f46e5;\n}',
        js: '// JavaScript Logic\nconst btn = document.getElementById("btn");\n\nbtn.addEventListener("click", () => {\n  const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];\n  const randomColor = colors[Math.floor(Math.random() * colors.length)];\n  document.body.style.background = randomColor;\n  console.log("Changed background to: " + randomColor);\n});'
    };

    // Load State
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    // Init CodeMirror
    function initEditor(id, mode, value) {
        const el = document.getElementById(`editor-${id}`);
        const cm = CodeMirror(el, {
            value: saved[id] || value,
            mode: mode,
            theme: 'dracula', // Default dark
            lineNumbers: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            tabSize: 2,
            lineWrapping: true
        });
        cm.on('change', debounce(saveAndPreview, 1000));
        return cm;
    }

    // Wait for CM resources to load slightly or just go
    // Since script is deferred/at end, it should be fine.

    // Check theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const theme = isDark ? 'dracula' : 'eclipse';

    editors.html = initEditor('html', 'htmlmixed', defaults.html);
    editors.css = initEditor('css', 'css', defaults.css);
    editors.js = initEditor('js', 'javascript', defaults.js);

    // Set Initial Theme
    Object.values(editors).forEach(cm => cm.setOption('theme', theme));

    // Watch Global Theme Change
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                const newTheme = document.documentElement.getAttribute('data-theme');
                const cmTheme = newTheme === 'dark' ? 'dracula' : 'eclipse';
                Object.values(editors).forEach(cm => cm.setOption('theme', cmTheme));
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });

    // --- 2. Tabs Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const codeWrappers = document.querySelectorAll('.code-wrapper');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Visibility
            const target = btn.dataset.tab;
            codeWrappers.forEach(w => w.classList.remove('active'));
            document.getElementById(`editor-${target}`).classList.add('active');

            // Refresh CM (needed when unhidden)
            editors[target].refresh();
        });
    });

    // --- 3. Preview Logic ---
    const previewFrame = document.getElementById('previewFrame');
    const consoleOutput = document.getElementById('consoleOutput');

    function saveAndPreview() {
        // Save
        const state = {
            html: editors.html.getValue(),
            css: editors.css.getValue(),
            js: editors.js.getValue(),
            libs: document.getElementById('externalLibs').value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

        // Preview
        updatePreview(state);
    }

    function updatePreview(state) {
        const { html, css, js, libs } = state;

        // Construct Library Scripts
        let libTags = '';
        if (libs) {
            libs.split(',').forEach(url => {
                if (url.trim()) libTags += `<script src="${url.trim()}"><\/script>`;
            });
        }

        // Console Interceptor Script
        const consoleScript = `
            <script>
                (function() {
                    const oldLog = console.log;
                    const oldError = console.error;
                    const oldWarn = console.warn;

                    function send(type, args) {
                        // Convert args to string for safety
                        const msg = args.map(a => {
                            try {
                                return typeof a === 'object' ? JSON.stringify(a) : String(a);
                            } catch(e) { return String(a); }
                        }).join(' ');

                        // Post message to parent
                        window.parent.postMessage({ type: 'console', level: type, msg: msg }, '*');
                    }

                    console.log = (...args) => { send('log', args); oldLog.apply(console, args); };
                    console.error = (...args) => { send('error', args); oldError.apply(console, args); };
                    console.warn = (...args) => { send('warn', args); oldWarn.apply(console, args); };

                    // Catch global errors
                    window.onerror = function(msg, url, line) {
                        send('error', [msg + " (Line " + line + ")"]);
                    };
                })();
            <\/script>
        `;

        const source = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>${css}</style>
                ${libTags}
                ${consoleScript}
            </head>
            <body>
                ${html}
                <script>
                    try {
                        ${js}
                    } catch(e) {
                        console.error(e);
                    }
                <\/script>
            </body>
            </html>
        `;

        previewFrame.srcdoc = source;
    }

    // Debounce Helper
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Listen for Console Messages
    window.addEventListener('message', (event) => {
        const data = event.data;
        if (data && data.type === 'console') {
            addConsoleLog(data.level, data.msg);
        }
    });

    function addConsoleLog(level, msg) {
        const div = document.createElement('div');
        div.className = `console-log ${level}`;
        const time = new Date().toLocaleTimeString().split(' ')[0];
        div.innerHTML = `<span class="ts">[${time}]</span> <span class="msg">${escapeHtml(msg)}</span>`;
        consoleOutput.appendChild(div);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- 4. Toolbar & Controls ---

    // Run
    document.getElementById('runBtn').addEventListener('click', saveAndPreview);

    // Reset
    document.getElementById('resetBtn').addEventListener('click', () => {
        if(confirm('Reset all code to default?')) {
            editors.html.setValue(defaults.html);
            editors.css.setValue(defaults.css);
            editors.js.setValue(defaults.js);
            document.getElementById('externalLibs').value = '';
            consoleOutput.innerHTML = '<div class="console-placeholder">Console output will appear here...</div>';
            saveAndPreview();
        }
    });

    // Clear Console
    document.getElementById('clearConsoleBtn').addEventListener('click', () => {
        consoleOutput.innerHTML = '';
    });

    // Format (Simple Indent)
    document.getElementById('formatBtn').addEventListener('click', () => {
        Object.values(editors).forEach(cm => {
            const totalLines = cm.lineCount();
            cm.operation(() => {
                for (let i = 0; i < totalLines; i++) {
                    cm.indentLine(i, "smart");
                }
            });
        });
    });

    // Download (JSZip)
    document.getElementById('downloadBtn').addEventListener('click', () => {
        const zip = new JSZip();
        zip.file("index.html", `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${editors.html.getValue()}
<script src="script.js"><\/script>
</body>
</html>`);
        zip.file("style.css", editors.css.getValue());
        zip.file("script.js", editors.js.getValue());

        zip.generateAsync({type:"blob"}).then(function(content) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = "project.zip";
            link.click();
        });
    });

    // Collapsible Panels
    document.querySelectorAll('.collapse-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const panel = document.getElementById(targetId);
            panel.classList.toggle('collapsed');
        });
    });

    // Device Toggles
    document.querySelectorAll('.device-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const width = btn.dataset.width;
            document.querySelector('.iframe-wrapper').style.width = width;
        });
    });

    // Libs Input
    document.getElementById('externalLibs').value = saved.libs || '';
    document.getElementById('externalLibs').addEventListener('input', debounce(saveAndPreview, 2000)); // Slower debounce for libs

    // Initial Run
    saveAndPreview();
});
