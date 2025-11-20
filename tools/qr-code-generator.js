document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    lucide.createIcons();

    const input = document.getElementById('qrInput');
    const generateBtn = document.getElementById('generateBtn');
    const errorMsg = document.getElementById('errorMsg');
    const resultSection = document.getElementById('resultSection');
    const qrContainer = document.getElementById('qrcode');
    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const downloadSvgBtn = document.getElementById('downloadSvgBtn');

    let currentQrSvg = null;
    let currentQrDataUrl = null;

    // Generate Button Click
    generateBtn.addEventListener('click', () => {
        generateQR();
    });

    // Enter Key Support
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateQR();
        }
    });

    function generateQR() {
        const text = input.value.trim();

        // Validation
        if (!text) {
            errorMsg.classList.remove('hidden');
            resultSection.classList.add('hidden');
            return;
        }

        errorMsg.classList.add('hidden');

        // Clear previous QR
        qrContainer.innerHTML = '';

        // Show Result Section
        resultSection.classList.remove('hidden');

        try {
            // Initialize QR Code generator (TypeNumber 0 = auto, 'H' = High Error Correction)
            const qr = qrcode(0, 'H');
            qr.addData(text);
            qr.make();

            // Generate SVG tag
            // Cell size 10, margin 4
            const svgTag = qr.createSvgTag({ cellSize: 10, margin: 4 });
            currentQrSvg = svgTag;

            // Generate Data URL for PNG
            // Cell size 10, margin 4
            currentQrDataUrl = qr.createDataURL(10, 4);

            // Display SVG in container
            qrContainer.innerHTML = svgTag;

            // Adjust SVG size to fit container smoothly
            const svgElement = qrContainer.querySelector('svg');
            if (svgElement) {
                svgElement.style.width = '100%';
                svgElement.style.height = 'auto';
                // Add white background rect if transparent
                // The lib usually creates rects for black modules. Background might be transparent.
                // We want a white background for visibility.
                // But usually the SVG output includes a background rect or relies on transparency.
                // Let's visually check. For "Download", transparency is fine for SVG.
            }

            // Animation effect
            qrContainer.style.opacity = 0;
            setTimeout(() => {
                qrContainer.style.transition = 'opacity 0.5s ease';
                qrContainer.style.opacity = 1;
            }, 100);

        } catch (err) {
            console.error("QR Gen Error:", err);
            errorMsg.textContent = "Error generating QR code. Try shorter text.";
            errorMsg.classList.remove('hidden');
        }
    }

    // Download PNG
    downloadPngBtn.addEventListener('click', () => {
        if (currentQrDataUrl) {
            // Create a temporary link
            const link = document.createElement('a');
            link.href = currentQrDataUrl; // Valid GIF/PNG data URL from library
            link.download = 'qrcode.png'; // Although lib often returns GIF, browsers handle it or we can try to enforce PNG if needed.
            // Wait, qrcode-generator createDataURL returns a GIF by default or PNG?
            // The docs say "returns data URI". Usually GIF.
            // If it's GIF, we should name it .gif or convert.
            // Let's check if we can use a canvas to convert to PNG if it returns GIF.

            // Actually, simplest way to ensure PNG is to draw the modules on a canvas ourselves or let the browser handle the conversion.
            // But `qrcode-generator` is lightweight.
            // Let's just download it as is. If it's a GIF data URL, downloading as .png might work but is technically wrong.
            // Let's inspect the data URL header if possible, or just default to .gif?
            // The prompt asked for "Download PNG".
            // If the lib produces GIF, I should probably convert.

            if (currentQrDataUrl.startsWith('data:image/gif')) {
                // Convert GIF data URL to PNG using Canvas
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#FFFFFF'; // White background
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    const pngUrl = canvas.toDataURL('image/png');
                    downloadLink(pngUrl, 'qrcode.png');
                };
                img.src = currentQrDataUrl;
            } else {
                // It's already PNG or other
                downloadLink(currentQrDataUrl, 'qrcode.png');
            }
        }
    });

    // Download SVG
    downloadSvgBtn.addEventListener('click', () => {
        if (currentQrSvg) {
            // Create a Blob from the SVG string
            const blob = new Blob([currentQrSvg], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            downloadLink(url, 'qrcode.svg');
        }
    });

    function downloadLink(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
