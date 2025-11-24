from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Determine absolute path to index.html
        cwd = os.getcwd()
        url = f"file://{cwd}/tools/frontend-editor/index.html"

        print(f"Navigating to {url}")
        page.goto(url)

        # Wait for Editor to load
        page.wait_for_selector(".CodeMirror")
        print("Editor Loaded")

        # Type something in HTML tab
        # We need to click the editor to focus? Or use eval to set value
        # Using evaluate is safer for CodeMirror
        page.evaluate("() => { document.querySelector(\".CodeMirror\").CodeMirror.setValue(\"<h1>Updated Title</h1>\") }")

        # Wait for preview update (debounce 1s)
        page.wait_for_timeout(1500)

        # Check preview iframe
        frame_element = page.wait_for_selector("#previewFrame")
        frame = frame_element.content_frame()

        if frame:
             title = frame.wait_for_selector("h1")
             text = title.text_content()
             print(f"Preview Text: {text}")
        else:
             print("Frame not found")

        # Take screenshot
        page.screenshot(path="verification/editor.png")
        print("Screenshot taken")

        browser.close()

if __name__ == "__main__":
    run()
