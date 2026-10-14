# Capture real product shots from the live LogNorth demo (demo.lognorth.com), fresh, no cache.
import asyncio, time
from playwright.async_api import async_playwright
OUT="remotion/public/lognorth"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={"width":900,"height":1100},device_scale_factor=2,extra_http_headers={"Cache-Control":"no-cache"})
        pg=await ctx.new_page()
        ts=int(time.time())
        await pg.goto(f"https://demo.lognorth.com/?nocache={ts}",wait_until="networkidle")
        await pg.screenshot(path=f"{OUT}/demo-home.png")
        await pg.goto(f"https://demo.lognorth.com/apps/1/issues?nocache={ts}",wait_until="networkidle")
        await pg.screenshot(path=f"research/lognorth-shots/issues.png", full_page=True)
        await pg.goto(f"https://demo.lognorth.com/apps/1/issues/3c6943f03e9e8010be47eb1b01c0cf19e6ca3e969bce0e3acf70ea3644bb070b?nocache={ts}",wait_until="networkidle")
        await pg.screenshot(path=f"research/lognorth-shots/issue.png", full_page=True)
        await b.close()
asyncio.run(main())
