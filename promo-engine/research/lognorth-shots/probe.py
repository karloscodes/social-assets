import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={"width":1280,"height":800},device_scale_factor=2)
        pg=await ctx.new_page()
        await pg.goto("https://demo.lognorth.com/?nocache=1",wait_until="networkidle")
        print(pg.url)
        await pg.screenshot(path="research/lognorth-shots/demo-home.png")
        links=await pg.evaluate("[...document.querySelectorAll('a')].map(a=>a.href+' | '+a.innerText.trim().slice(0,40))")
        print("\n".join(sorted(set(links))[:80]))
        await b.close()
asyncio.run(main())
