from playwright.sync_api import sync_playwright, expect
import time

def verify_hexagon_animation(page):
    # Navigate to the app
    page.goto("http://localhost:8080/index.html")

    # Verify Title
    expect(page).to_have_title("All-in-one Pocket | Modern Multi-Tool Hub")

    # Wait for the hexagon to be visible
    hexagon = page.locator(".hexagon-3d")
    expect(hexagon).to_be_visible()

    # Take a screenshot of the initial state
    page.screenshot(path="/home/jules/verification/hexagon_initial.png")

    # Wait a bit for animation to progress (it's 12s duration)
    time.sleep(2)

    # Take another screenshot to potentially see rotation
    page.screenshot(path="/home/jules/verification/hexagon_rotated.png")

    # Verify Theme Toggle
    toggle_btn = page.locator("#themeToggle")
    toggle_btn.click()
    time.sleep(0.5) # Wait for transition
    page.screenshot(path="/home/jules/verification/light_mode.png")

    # Toggle back
    toggle_btn.click()
    time.sleep(0.5)

    print("Verification screenshots captured.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_hexagon_animation(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
