# Idea slides for next videos (1920x1080). Run: python3 gen_ideas.py
import subprocess, os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__))
I=[
 dict(n=1,prod="SuppyHQ",acc="#ea580c",title="The 3-day refund",hook="She asked for a refund. 3 days ago.",
  beats=["Night. A founder at the desk, only the screen glows. The phone buzzes.","The support inbox: cold pitches, one under another.","At the bottom: the paying customer. “3 days ago.”","SuppyHQ: pitches go to Spam, the customer who paid goes on top."],
  fmt="9:16 · 20s · silent, cinematic stock + product UI",img="p9333180.jpg",card='<div class="nt"><b>Refund request</b><span>from a paying customer</span><i>3 days ago</i></div>',
  end="Pitches out. Paying customers on top. · $29/mo · Free for the first 10 people who write in."),
 dict(n=2,prod="SuppyHQ",acc="#ea580c",title="Hands at work",hook="Monday. Coffee. Support inbox.",
  beats=["Carlos's hands, coffee, screen glow. Silent POV, no face.","Scroll: SEO offer, “partnership”, another pitch.","One look in SuppyHQ: the refund on top, with the plan beside it.","He answers it, sips the coffee, closes the laptop."],
  fmt="9:16 · 15–20s · filmed by Carlos on his phone",img="p2255355.jpg",card='<div class="nt"><b>Shot list (phone, 4K 30fps, lock exposure)</b><span>1 Top-down desk, laptop closed, coffee pour · 2 Hands open laptop, screen glow on fingers · 3 Over-shoulder screen, scroll (blur names) · 4 Macro: finger on trackpad, click · 5 Hands type a short reply · 6 Sip, close lid, morning light</span></div>',
  end="Stock still is a placeholder for Carlos's own footage."),
 dict(n=3,prod="SuppyHQ",acc="#ea580c",title="Before / after loop",hook="Same inbox.",
  beats=["Before: pitches stacked on top, the refund at the bottom.","Hard match-cut to after: same rows, rearranged.","The refund is on top, the pitches wait in Spam.","Punchline, then it loops straight back to “before”."],
  fmt="9:16 · 8s seamless loop · replay bait",img=None,card=None,
  end="Pitches out. Paying customers on top."),
 dict(n=4,prod="LogNorth",acc="#f59e0b",title="Alert at 3am. Fixed by breakfast.",hook="03:00. /checkout 8% vs 1%.",
  beats=["Night city. The phone lights up: a LogNorth alert.","A webhook starts a Grok Bot routine: it reads the logs and opens a pull request with a test.","Dawn: “verify 0.9% since the deploy”. The alert clears.","Morning: you wake up to a closed incident."],
  fmt="9:16 or 16:9 · 20s · night-to-morning stock + terminal UI",img="p20832059.jpg",card='<div class="nt mono"><b>[lognorth] alert</b><span>/checkout 8% vs 1%</span><i>closed · 0.9% since the deploy</i></div>',
  end="Free for your first app. · lognorth.com"),
 dict(n=5,prod="hoodiechamp",acc="#c4f01e",title="The world of creators",hook="Your product. Their camera.",
  beats=["Montage: creators filming in kitchens, gyms, bedrooms (stock, tagged Example).","Say what you need in one sentence.","Creators who fit send a price. Prices, not pitches.","Creators bid. You pick. Ask for an invite at hoodiechamp.com."],
  fmt="9:16 · 15–20s · cinematic creator stock + music",img="p7480527.jpg",card='<div class="nt"><b>“3 TikTok ads for my candle”</b><span>Creators bid. You pick.</span></div>',
  end="No fee amounts on screen."),
]
css='''*{box-sizing:border-box}body{margin:0;width:1920px;height:1080px;background:#0e0d0c;color:#f5f5f4;font-family:Inter,sans-serif;overflow:hidden;position:relative}
.l{position:absolute;left:110px;top:90px;width:980px}.tag{font-size:26px;letter-spacing:4px;font-weight:700}.n{opacity:.4}
h1{font-size:92px;line-height:1;letter-spacing:-3px;margin:22px 0 30px;font-weight:800}
.hook{font-size:40px;font-weight:700;padding:22px 30px;border-left:8px solid var(--a);background:#ffffff0d;border-radius:0 18px 18px 0}
.hook small{display:block;font-size:22px;letter-spacing:3px;opacity:.55;margin-bottom:8px;font-weight:700}
ol{margin:36px 0 0;padding:0;list-style:none;counter-reset:b}li{counter-increment:b;font-size:31px;line-height:1.3;margin:0 0 20px;padding-left:64px;position:relative;opacity:.9}
li:before{content:counter(b);position:absolute;left:0;top:0;width:44px;height:44px;border-radius:22px;border:2px solid var(--a);color:var(--a);font-size:24px;font-weight:800;display:flex;align-items:center;justify-content:center}
.f{position:absolute;left:110px;bottom:70px;width:980px;font-size:26px;opacity:.7;line-height:1.5}.f b{color:var(--a);opacity:1}
.ph{position:absolute;right:150px;top:70px;width:530px;height:940px;border-radius:44px;overflow:hidden;background:#1a1816;box-shadow:0 40px 120px #000c,0 0 0 2px #ffffff18}
.ph img{width:100%;height:100%;object-fit:cover;filter:sepia(.28) saturate(1.1) contrast(1.08) brightness(.82)}
.ph:after{content:"";position:absolute;inset:0;background:linear-gradient(#0000 45%,#000b),radial-gradient(120% 80% at 50% 40%,#0000,#0007)}
.cap{position:absolute;left:40px;right:40px;top:150px;z-index:2;font-size:54px;font-weight:800;letter-spacing:-1.5px;line-height:1.05}
.nt{position:absolute;z-index:2;left:30px;right:30px;bottom:60px;background:#f5f5f4ee;color:#1c1917;border-radius:26px;padding:24px 28px;font-size:24px}
.nt b{display:block;font-size:28px}.nt span{display:block;opacity:.7;margin-top:6px;line-height:1.35}.nt i{display:block;font-style:normal;color:var(--a);font-weight:700;margin-top:8px;filter:brightness(.8)}
.mono{font-family:"JetBrains Mono",monospace;background:#0c0c0cee;color:#e7e5e4}.mono i{filter:none}
.ex{position:absolute;z-index:3;top:24px;right:24px;background:var(--a);color:#111;font-weight:800;font-size:22px;padding:4px 14px;border-radius:10px}
.src{position:absolute;right:150px;bottom:30px;width:530px;text-align:center;font-size:18px;opacity:.45}
.ba{position:absolute;inset:0;display:flex;flex-direction:column;padding:120px 30px 40px;gap:14px}.row{background:#2a2725;border-radius:16px;padding:16px 20px;font-size:22px;opacity:.75}.row.r{background:#ea580c2e;border:3px solid #ea580c;opacity:1;color:#fff}
.lab{font-size:22px;letter-spacing:3px;font-weight:800;opacity:.6;margin-top:8px}'''
PEX={"p9333180.jpg":"pexels.com/photo/9333180 (Al-Razi Production)","p2255355.jpg":"pexels.com/photo/2255355 (Gül Işık)","p20832059.jpg":"pexels.com/photo/20832059 (Alina Chernii)","p7480527.jpg":"pexels.com/photo/7480527 (MART PRODUCTION)"}
outs=[]
for x in I:
  if x["img"]:
    vis=f'<img src="file://{D}/stills/{x["img"]}"><div class="cap">{x["hook"]}</div>{x["card"]}'+('<div class="ex">Example</div>' if x["n"]==5 else '')
    src=f'<div class="src">Key frame mockup · Pexels still: {PEX[x["img"]]}</div>'
  else:
    vis='<div class="ba"><div class="cap" style="position:static;font-size:48px">Same inbox.</div><div class="lab">BEFORE</div><div class="row">SEO offer · Rank first on Google</div><div class="row">“Partnership” opportunity</div><div class="row r">Refund request · 3 days ago</div><div class="lab" style="color:#ea580c;opacity:1">AFTER · SUPPYHQ</div><div class="row r">Refund request · paying customer</div><div class="row" style="opacity:.35">Spam: SEO offer, “partnership”</div><div class="cap" style="position:static;font-size:40px;margin-top:10px">Pitches out. <span style="color:#ea580c">Paying customers on top.</span></div></div>'
    src='<div class="src">Key frame mockup · product UI, no stock</div>'
  h=f'''<html><head><style>{css}</style></head><body style="--a:{x["acc"]}"><div class="l"><div class="tag" style="color:{x["acc"]}"><span class="n">IDEA {x["n"]} / 5 · </span>{x["prod"].upper()}</div><h1>{x["title"]}</h1>
<div class="hook"><small>HOOK · FIRST SECOND</small>{x["hook"]}</div><ol>{"".join(f"<li>{b}</li>" for b in x["beats"])}</ol></div>
<div class="f"><b>Format</b> {x["fmt"]}<br><b>End</b> {x["end"]}</div><div class="ph">{vis}</div>{src}</body></html>'''
  hp=f'{D}/idea-{x["n"]}.html';open(hp,'w').write(h);png=f'{D}/idea-{x["n"]}-{x["prod"].lower()}.png'
  subprocess.run(['google-chrome','--headless','--no-sandbox','--hide-scrollbars','--allow-file-access-from-files',f'--screenshot={png}','--window-size=1920,1080','file://'+hp],capture_output=True);outs.append(png)
S=Image.new('RGB',(3*960+40,2*540+30),'#000')
for k,p in enumerate(outs): S.paste(Image.open(p).resize((960,540)),(10+(k%3)*970,10+(k//3)*550))
S.save(f'{D}/next-videos-overview.png')
