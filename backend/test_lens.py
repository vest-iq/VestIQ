from pathlib import Path
from playwright.sync_api import sync_playwright
import time


IMAGE_PATH = Path(
    r"C:\Users\akshb\Downloads\Screenshot 2026-09-18 184739.png"
)

LENS_URL = "https://lens.google.com/"


with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=False
    )

    page = browser.new_page(
        viewport={
            "width": 1400,
            "height": 900,
        }
    )

    print("Opening Google Lens...")
    page.goto(
        LENS_URL,
        wait_until="domcontentloaded",
        timeout=60000,
    )

    print("Waiting for Lens...")
    page.wait_for_timeout(3000)

    print("Current URL:")
    print(page.url)

    # Look for file upload inputs.
    file_inputs = page.locator(
        'input[type="file"]'
    )

    print(
        f"File inputs found: {file_inputs.count()}"
    )

    if file_inputs.count() == 0:
        print(
            "No file input found."
        )

        print(
            "Page title:",
            page.title(),
        )

        page.screenshot(
            path="lens_debug.png",
            full_page=True,
        )

        print(
            "Saved screenshot as lens_debug.png"
        )

        browser.close()
        raise SystemExit

    print("Uploading image...")

    file_inputs.first.set_input_files(
        str(IMAGE_PATH)
    )

    print("Image uploaded.")

    print("Waiting for Google Lens results...")

    page.wait_for_timeout(10000)

    print("\nFINAL URL:")
    print(page.url)

    print("\nPAGE TITLE:")
    print(page.title())

    print("\nPAGE TEXT:")
    text = page.locator("body").inner_text()

    print(text[:15000])

    print("\nSAVING HTML...")

    html = page.content()

    Path(
        "lens_result.html"
    ).write_text(
        html,
        encoding="utf-8",
    )

    page.screenshot(
        path="lens_result.png",
        full_page=True,
    )

    print(
        "Saved lens_result.html"
    )

    print(
        "Saved lens_result.png"
    )

    print("\nEXTRACTING LINKS...")

    links = page.locator("a")

    print(
        f"Total links found: {links.count()}"
    )

    for i in range(
        min(links.count(), 100)
    ):
        link = links.nth(i)

        try:
            href = link.get_attribute(
                "href"
            )

            label = link.inner_text(
                timeout=1000
            ).strip()

            if href:
                print(
                    f"\n[{i}] {label[:150]}"
                )
                print(
                    f"    {href}"
                )

        except Exception:
            pass

    print(
        "\nBrowser will remain open for 30 seconds."
    )

    time.sleep(30)

    browser.close()