# Capture the live demo's log view (plain lines, errors in red) at a narrow viewport so text stays legible in a 9:16 frame.
import asyncio, time
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={"width":640,"height":760},device_scale_factor=3,extra_http_headers={"Cache-Control":"no-cache"})
        pg=await ctx.new_page(); ts=int(time.time())
        await pg.goto(f"https://demo.lognorth.com/apps/1/issues?nocache={ts}",wait_until="networkidle")
        links=await pg.evaluate("[...document.querySelectorAll('a')].map(a=>a.href+' | '+a.innerText.trim().slice(0,30))")
        print("\n".join(l for l in links if 'logs' in l or 'endpoints' in l))
        href=await pg.evaluate("([...document.querySelectorAll('a')].find(a=>/logs/.test(a.innerText))||{}).href")
        print("logs:",href)
        await pg.goto(href+f"?nocache={ts}",wait_until="networkidle")
        await pg.wait_for_timeout(800)
        await pg.screenshot(path="research/lognorth-shots/logs-view.png")
        await pg.screenshot(path="research/lognorth-shots/logs-full.png", full_page=True)
        await b.close()
asyncio.run(main())
