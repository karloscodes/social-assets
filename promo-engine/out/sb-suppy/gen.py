import subprocess
from PIL import Image
O='#ea580c'
css='''*{box-sizing:border-box}body{margin:0;width:1080px;height:1920px;background:radial-gradient(120% 75% at 50% 45%,#22201d,#151311 70%);color:#f5f5f4;font-family:Inter,sans-serif;position:relative;overflow:hidden}
.t{position:absolute;left:80px;width:840px;top:320px;font-size:88px;font-weight:800;letter-spacing:-2.5px;line-height:1.05}.o{color:#ea580c}
.box{position:absolute;left:80px;width:840px;top:700px;background:#1f1d1b;border:2px solid #ffffff1c;border-radius:36px;padding:28px;overflow:hidden}
.hd{display:flex;justify-content:space-between;align-items:center;font-size:36px;font-weight:700;padding:6px 10px 22px;border-bottom:2px solid #ffffff14}
.cnt{background:#ffffff1a;padding:6px 18px;border-radius:999px;font-size:34px}
.r{display:flex;gap:22px;align-items:center;padding:22px 10px;border-bottom:2px solid #ffffff10;font-size:34px}.r:last-child{border:0}
.av{width:70px;height:70px;border-radius:35px;background:#3a3633;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:28px;flex:none}
.m{flex:1;min-width:0}.m b{display:block;font-size:34px}.m span{display:block;opacity:.6;font-size:30px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.w{opacity:.55;font-size:28px}.dim{opacity:.35}.hi{background:#ea580c1f;border:3px solid #ea580c;border-radius:24px}
.chip{background:#ea580c;color:#fff;font-size:26px;font-weight:700;padding:5px 14px;border-radius:10px;margin-left:10px}
.ex{text-align:right;padding:14px 10px 0;font-size:24px;opacity:.5}.sec{font-size:26px;letter-spacing:2px;opacity:.55;font-weight:700;padding:18px 10px 4px}'''
def row(i,n,s,w,cls=''): return f'<div class="r {cls}"><div class="av">{i}</div><div class="m"><b>{n}</b><span>{s}</span></div><div class="w">{w}</div></div>'
P=[row('GR','Growth Rank SEO','Rank first on Google, guaranteed','Mon'),row('JK','“Security researcher”','I found a bug on your site. Bounty?','Mon'),
   row('LB','LinkBoost Agency','Guest posts on high-DA blogs','Mon'),row('CX','CoinX Partners','Accept crypto, grow fast','Mon')]
REF=lambda cls='',extra='':row('ML','Maria L.'+extra,'Hi, can I get a refund for my order?','3 days ago',cls)
mascot='''<svg width="300" height="300" viewBox="0 0 100 100"><path d="M50 8C24 8 12 28 12 52c0 26 14 40 38 40s38-14 38-40C88 28 76 8 50 8z" fill="#fff"/><ellipse cx="38" cy="50" rx="5" ry="7" fill="#111"/><ellipse cx="62" cy="50" rx="5" ry="7" fill="#111"/><circle cx="80" cy="18" r="9" fill="#ea580c"/></svg>'''
logo0=open('/workspace/promo-engine/remotion/public/suppyhq/logo.svg').read().replace('<svg ','<svg width="120" height="120" ')
B=[
('Monday morning. <span class=o>63</span> emails.', '<div class="box"><div class="hd">support@ <span class="cnt">63</span></div>'+''.join(P[:3])+'<div class="ex">Example inbox</div></div>'),
('Most of them aren’t <span class=o>customers.</span>', '<div class="box"><div class="hd">support@ <span class="cnt">63</span></div>'+''.join(P)+'</div>'),
('At the bottom: a refund. <span class=o>3 days ago.</span>', '<div class="box"><div class="hd">support@ <span class="cnt">63</span></div>'+''.join(x.replace('class="r ','class="r dim ') for x in P[2:])+REF('hi')+'<div class="ex">Example names</div></div>'),
('Same inbox. <span class=o>Paying customer on top.</span>', '<div class="box"><div class="hd">SuppyHQ · Needs you</div><div class="sec">CAN’T WAIT</div>'+row('ML','Maria L. <span class="chip">Paid · Stripe</span>','Hi, can I get a refund for my order?','3 days ago','hi')+'<div class="sec">SPAM</div>'+''.join(x.replace('class="r ','class="r dim ') for x in P)+'<div class="ex">Example</div></div>'),
(None,f'''<div style="position:absolute;left:80px;width:840px;top:340px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:40px">{mascot}
<div style="display:flex;align-items:center;gap:24px"><div style="position:relative;width:120px;height:120px;border-radius:28px;background:#1c1917;border:2px solid #ffffff22;display:flex;align-items:center;justify-content:center;font-size:76px;font-weight:600">s<div style="position:absolute;right:10px;top:10px;width:30px;height:30px;border-radius:15px;background:#f97316"></div></div><span style="font-size:80px;font-weight:800;letter-spacing:-2px">SuppyHQ</span></div>
<div style="font-size:72px;font-weight:800;line-height:1.08;letter-spacing:-2px">Pitches out.<br><span class=o>Paying customers on top.</span></div>
<div style="font-size:50px;font-weight:700">suppyhq.com · $29/mo</div><div style="font-size:36px;opacity:.7">Free for the first 10 people who write in.</div></div>'''),
]
fs=[]
for i,(t,v) in enumerate(B,1):
  h=f'<html><head><style>{css}</style></head><body>'+(f'<div class="t">{t}</div>' if t else '')+v+'</body></html>'
  open(f'b{i}.html','w').write(h); p=f'/workspace/promo-engine/out/suppyhq-missed-refund-beat{i}.png'
  subprocess.run(['google-chrome','--headless','--no-sandbox','--hide-scrollbars',f'--screenshot={p}','--window-size=1080,1920',f'file://{__import__("os").getcwd()}/b{i}.html'],capture_output=True); fs.append(p)
S=Image.new('RGB',(5*432+6*20,808),'#000')
for k,p in enumerate(fs): S.paste(Image.open(p).resize((432,768)),(20+k*452,20))
S.save('/workspace/promo-engine/out/suppyhq-missed-refund-storyboard.png')
