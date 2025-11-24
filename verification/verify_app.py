from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Determine absolute path to index.html
        cwd = os.getcwd()
        url = f"file://{cwd}/index.html"

        print(f"Navigating to {url}")
        page.goto(url)

        # Wait for hero to load
        page.wait_for_selector(".hero")

        # Take screenshot of Hub
        page.screenshot(path="verification/hub.png")
        print("Hub screenshot taken")

        # Navigate to a tool (e.g., Character Counter)
        # Use simple click on card
        page.click("a[data-name*=\"character\"]")

        # Wait for tool load
        page.wait_for_selector("#charCount")

        # Input text
        page.fill("#textInput", "Hello World")

        # Check stats update
        val = page.text_content("#charCount")
        print(f"Character count: {val}")

        page.screenshot(path="verification/tool_char.png")
        print("Tool screenshot taken")

        browser.close()

if __name__ == "__main__":
    run()
