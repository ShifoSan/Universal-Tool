from playwright.sync_api import sync_playwright, expect
import time

def verify_ai_chat(page):
    # 1. Go to the app index
    page.goto("http://localhost:8080/index.html")

    # 2. Verify AI Tools filter button exists
    ai_filter = page.get_by_role("button", name="AI Tools")
    expect(ai_filter).to_be_visible()

    # 3. Verify AI Tools section exists
    # Finding the header "AI Tools"
    ai_header = page.get_by_role("heading", name="AI Tools")
    expect(ai_header).to_be_visible()

    # 4. Navigate to AI Help Chat
    chat_card = page.get_by_text("AI Help Chat").first
    chat_card.click()

    # 5. Verify Chat Interface
    expect(page).to_have_title("AI Help Chat | All-in-one Pocket")

    # Check for welcome message
    welcome_msg = page.locator(".message.ai").first
    expect(welcome_msg).to_contain_text("Hi! I'm here to help")

    # 6. Send a message
    input_field = page.locator("#userInput")
    input_field.fill("Hello AI")

    send_btn = page.locator("#sendBtn")
    send_btn.click()

    # 7. Verify User Message appears
    user_msg = page.locator(".message.user").last
    expect(user_msg).to_contain_text("Hello AI")

    # 8. Verify Typing Indicator appears (it might disappear fast if error happens fast)
    # We wait a bit. Since the endpoint is placeholder, it should eventually show an error or fallback message.
    time.sleep(2)

    # 9. Verify Response (Error/Fallback)
    last_ai_msg = page.locator(".message.ai").last
    # We expect the fallback message about connection trouble
    expect(last_ai_msg).to_contain_text("I'm having trouble connecting")

    # 10. Screenshot
    page.screenshot(path="/home/jules/verification/ai_chat_verification.png")
    print("Verification complete.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_ai_chat(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
