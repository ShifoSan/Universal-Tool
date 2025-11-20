from playwright.sync_api import sync_playwright, expect
import time

def verify_qr_generator(page):
    # 1. Go to the app index
    page.goto("http://localhost:8080/index.html")

    # 2. Click on the QR Code Generator card
    # It should be in the Productivity section
    # Finding by text "QR Code Generator"
    qr_card = page.get_by_text("QR Code Generator").first
    qr_card.click()

    # 3. Verify we are on the tool page
    expect(page).to_have_title("QR Code Generator | All-in-one Pocket")

    # 4. Enter text
    input_field = page.locator("#qrInput")
    input_field.fill("https://www.example.com")

    # 5. Generate
    generate_btn = page.locator("#generateBtn")
    generate_btn.click()

    # 6. Verify QR Code appears
    qr_container = page.locator("#qrcode")
    expect(qr_container).to_be_visible()

    # Wait a moment for animation
    time.sleep(1)

    # 7. Screenshot
    page.screenshot(path="/home/jules/verification/qr_code_result.png")
    print("Screenshot captured.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_qr_generator(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
