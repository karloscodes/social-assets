# Live demo log view filtered to Errors (red lines), fresh.
import asyncio, time
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={"width":640,"height":1100},device_scale_factor=3,extra_http_headers={"Cache-Control":"no-cache"})
        pg=await ctx.new_page(); ts=int(time.time())
        await pg.goto(f"https://demo.lognorth.com/apps/1/log?nocache={ts}",wait_until="networkidle")
        await pg.get_by_text("Errors", exact=True).first.click()
        await pg.wait_for_timeout(1500)
        print(pg.url)
        await pg.add_style_tag(content=".statusbar,[class*=status]{} ")
        await pg.screenshot(path="research/lognorth-shots/logs-errors.png")
        await b.close()
asyncio.run(main())
