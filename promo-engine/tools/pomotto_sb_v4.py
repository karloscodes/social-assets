# Pomotto storyboard v4: B&W flat panda. Ref: studio panda (superellipse block head, ears on top corners, patches act).
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np, math
W,H=1080,1920; S=2
G="/usr/share/fonts/truetype/sand-box/google/"
def serif(s):
    return ImageFont.truetype(G+"Cormorant Garamond/CormorantGaramond-VariableFont_wght.ttf",s*S)
def sans(s,w=300):
    f=ImageFont.truetype(G+"Inter/Inter-VariableFont_opsz,wght.ttf",s*S)
    try: f.set_variation_by_axes([14,w])
    except: pass
    return f
WH=(238,238,238); INK=(8,8,8); MID=(72,72,72); DIM=(150,150,150)
def P(*v): return [x*S for x in v]
def se(cx,cy,rx,ry,n=4.2,st=120):
    pts=[]
    for i in range(st):
        a=i/st*2*math.pi; c,s=math.cos(a),math.sin(a)
        pts.append(((cx+rx*np.sign(c)*abs(c)**(2/n))*S,(cy+ry*np.sign(s)*abs(s)**(2/n))*S))
    return pts
def base(lx=540,ly=700,k=34):
    a=np.full((H*S,W*S),6,np.float32)
    yy,xx=np.mgrid[0:H*S,0:W*S]; d=np.hypot(xx-lx*S,yy-ly*S)/(900*S)
    a+=k*np.clip(1-d,0,1)**2
    return Image.fromarray(np.dstack([a]*3).astype("uint8"))
def panda(d,cx,cy,s=1.0,eyes="open",look=0,arms="down",mouth="calm",tilt=0):
    q=lambda v:v*s
    # body
    d.ellipse(P(cx-q(200),cy+q(170),cx+q(200),cy+q(560)),fill=WH)
    # arms
    if arms=="down":
        for sx in(-1,1): d.ellipse(P(cx+sx*q(150)-q(55),cy+q(250),cx+sx*q(150)+q(55),cy+q(470)),fill=MID)
    elif arms=="type":
        for sx in(-1,1): d.ellipse(P(cx+sx*q(110)-q(60),cy+q(330),cx+sx*q(110)+q(60),cy+q(450)),fill=MID)
    elif arms=="up":
        for sx in(-1,1):
            a=(cx+sx*q(170),cy+q(270)); b=(cx+sx*q(360),cy-q(230))
            d.line(P(*a,*b),fill=MID,width=int(q(96)*S))
            for x,y in (a,b): d.ellipse(P(x-q(48),y-q(48),x+q(48),y+q(48)),fill=MID)
    elif arms=="tap":
        d.ellipse(P(cx-q(205),cy+q(250),cx-q(95),cy+q(470)),fill=MID)
        d.ellipse(P(cx+q(120),cy+q(120),cx+q(330),cy+q(240)),fill=MID)
    # ears
    for sx in(-1,1): d.ellipse(P(cx+sx*q(225)-q(72),cy-q(205)-q(72)+tilt*sx*q(8),cx+sx*q(225)+q(72),cy-q(205)+q(72)+tilt*sx*q(8)),fill=MID)
    # head
    d.polygon(se(cx,cy,q(290),q(225)),fill=WH)
    ex=q(105); ey=cy-q(10)
    for sx in(-1,1):
        x=cx+sx*ex
        d.ellipse(P(x-q(62),ey-q(78),x+q(62),ey+q(78)),fill=INK)
        if eyes=="open":
            d.ellipse(P(x+look*q(16)-q(17),ey-q(17),x+look*q(16)+q(17),ey+q(17)),fill=WH)
        elif eyes=="wide":
            d.ellipse(P(x+look*q(16)-q(23),ey-q(26),x+look*q(16)+q(23),ey+q(26)),fill=WH)
        elif eyes=="closed":
            d.arc(P(x-q(26),ey-q(14),x+q(26),ey+q(26)),200,340,fill=WH,width=int(q(7)*S))
        elif eyes=="tired":
            d.rectangle(P(x-q(28),ey+q(2),x+q(28),ey+q(10)),fill=WH)
    d.ellipse(P(cx-q(26),cy+q(70),cx+q(26),cy+q(102)),fill=INK)
    if mouth=="smile": d.arc(P(cx-q(34),cy+q(92),cx+q(34),cy+q(140)),20,160,fill=INK,width=int(q(6)*S))
    elif mouth=="o": d.ellipse(P(cx-q(13),cy+q(120),cx+q(13),cy+q(148)),fill=INK)
    elif mouth=="flat": d.line(P(cx-q(24),cy+q(128),cx+q(24),cy+q(128)),fill=INK,width=int(q(6)*S))
def desk(d,y=1300): d.rectangle(P(44,y,940,y+4),fill=MID)
def laptop_back(d,cx,y,w=300,lit=False):
    d.rounded_rectangle(P(cx-w//2,y-190,cx+w//2,y),radius=14*S,fill=(40,40,40) if not lit else (90,90,90))
    d.ellipse(P(cx-10,y-105,cx+10,y-85),fill=(70,70,70) if not lit else (140,140,140))
def card(d,x,y,w=330,h=86,label="New message"):
    d.rounded_rectangle(P(x,y,x+w,y+h),radius=20*S,fill=(46,46,46))
    d.rounded_rectangle(P(x+18,y+18,x+68,y+68),radius=10*S,fill=(110,110,110))
    d.text(P(x+86,y+26),label,font=sans(24,400),fill=(220,220,220))
def moon(d,cx,cy,r,col=WH,bg=(46,46,46)):
    d.ellipse(P(cx-r,cy-r,cx+r,cy+r),fill=col); d.ellipse(P(cx-r+r*0.55,cy-r-r*0.15,cx+r+r*0.55,cy+r-r*0.15),fill=bg)
def menubar(d,y,t,dnd=True):
    d.rounded_rectangle(P(44,y,940,y+96),radius=24*S,fill=(34,34,34))
    if dnd: moon(d,500,y+48,18,bg=(34,34,34))
    d.text(P(560,y+22),t,font=sans(44,500),fill=WH)
def text(d,lines,y=470,size=96,sub=None):
    for i,l in enumerate(lines): d.text(P(84,y+i*(size+12)),l,font=serif(size),fill=WH)
    if sub: d.text(P(84,y+len(lines)*(size+12)+18),sub,font=sans(30),fill=DIM)
def chime(d,cx,cy):
    for r in (40,75,110): d.arc(P(cx-r,cy-r,cx+r,cy+r),300,60,fill=(130,130,130),width=4*S)
def endcard(d):
    panda(d,700,1030,0.5,eyes="closed",mouth="smile")
    d.text(P(84,600),"Pomotto",font=serif(140),fill=WH)
    d.text(P(84,780),"Free to try. $2.99 once for Pro.",font=sans(42,300),fill=(200,200,200))
    d.text(P(84,850),"pomotto.app",font=sans(36,300),fill=DIM)
# beats: (id, product, note, time, draw)
D1=[
("D1·1",False,"Panda types, a ping card slides in slowly. Eyes dart to it. 4.5s.","0.0–4.5s hook",
 lambda d:(text(d,["One ping."]),card(d,560,640),panda(d,430,960,0.62,look=1,arms="type",mouth="o"),laptop_back(d,430,1300,280),desk(d))),
("D1·2",False,"Panda frozen, staring at the card. Number fades up. Result hold 2s.","4.5–9.0s",
 lambda d:(d.text(P(84,470),"23 minutes",font=serif(140),fill=WH),d.text(P(84,630),"to get back to the task.",font=serif(56),fill=(200,200,200)),d.text(P(84,710),"UC Irvine researchers",font=sans(28),fill=DIM),panda(d,560,1010,0.5,eyes="tired",mouth="flat"),desk(d))),
("D1·3",True,"PRODUCT: menu bar illustration. Timer 25:00 appears, moon fades in. Slow drift.","9.0–13.5s",
 lambda d:(text(d,["Start the timer.","Your Mac goes quiet."],size=84),menubar(d,800,"25:00"),panda(d,300,1080,0.36,arms="tap",mouth="smile",look=1))),
("D1·4",False,"Panda typing, eyes closed-calm. Nothing moves but a slow light breathe.","13.5–18.0s",
 lambda d:(text(d,["Nothing to toggle."]),panda(d,490,980,0.62,eyes="closed",arms="type",mouth="smile"),laptop_back(d,490,1300,280,lit=True),desk(d))),
("D1·5",False,"Soft chime rings. Panda looks up; two message cards wait, calm. Hold 2s.","18.0–22.5s result",
 lambda d:(text(d,["Your messages","are waiting."]),card(d,560,720,330,80,"Slack"),card(d,560,816,330,80,"Messages"),chime(d,300,820),panda(d,400,1000,0.55,eyes="wide",mouth="smile",look=1),desk(d))),
("D1·6",False,"End card. Panda small, content. Music fades out by 25.5s.","22.5–27.0s",lambda d:endcard(d)),
]
D2=[
("D2·1",False,"Panda slumped at the desk, ears low. Slow push-in.","0.0–4.5s hook",
 lambda d:(text(d,["It's 4pm."],size=110),panda(d,500,1010,0.6,eyes="tired",mouth="flat",tilt=2),laptop_back(d,500,1300,280,lit=True),desk(d))),
("D2·2",False,"Same pose, three small clock ticks. Hold, no cuts.","4.5–9.0s",
 lambda d:(text(d,["Three hours,","no break."]),panda(d,500,1060,0.55,eyes="tired",arms="type",mouth="flat"),laptop_back(d,500,1300,280,lit=True),desk(d))),
("D2·3",True,"PRODUCT: menu bar countdown 17:14 illustration, chime rings once. Slow push.","9.0–13.5s",
 lambda d:(text(d,["A gentle chime","tells you to stop."]),menubar(d,820,"17:14",dnd=False),chime(d,800,1080),panda(d,300,1100,0.32,eyes="wide",mouth="o"))),
("D2·4",False,"Panda stands and stretches, arms up, eyes closed. Slow.","13.5–18.0s",
 lambda d:(text(d,["Step away."],size=110),panda(d,540,1010,0.55,eyes="closed",arms="up",mouth="smile"))),
("D2·5",False,"Back at desk, upright, bright eyes, typing. Result hold 2s.","18.0–22.5s result",
 lambda d:(text(d,["Still sharp","at 4pm."],size=110),panda(d,500,1030,0.58,eyes="wide",arms="type",mouth="smile"),laptop_back(d,500,1300,280,lit=True),desk(d))),
("D2·6",False,"End card. Music fades out by 25.5s.","22.5–27.0s",lambda d:endcard(d)),
]
def annotate(d,n,prod,note,beat):
    R=(200,40,40)
    for y in (380,1436): d.line(P(0,y,W,y),fill=R,width=2*S)
    for x in (44,940): d.line(P(x,380,x,1436),fill=R,width=2*S)
    d.text(P(44,40),n,font=sans(34,500),fill=(150,150,150)); d.text(P(44,90),beat,font=sans(28),fill=(120,120,120))
    if prod:
        d.rounded_rectangle(P(44,1480,560,1540),radius=30*S,fill=(170,30,30)); d.text(P(70,1490),"PRODUCT ILLUSTRATION",font=sans(28,600),fill=(255,255,255))
    d.text(P(44,1580),note,font=sans(26),fill=(150,150,150))
out="/workspace/promo-engine/out/"
import os; os.makedirs(out+"ideas/pomotto/frames-v4",exist_ok=True)
def sheet(ims,path,title=None):
    s=0.3; tw,th=int(W*s),int(H*s); pad=24; top=110 if title else pad
    sh=Image.new("RGB",(pad+6*(tw+pad),top+2*(th+pad)),(0,0,0)); dd=ImageDraw.Draw(sh)
    if title: dd.text((pad,30),title,font=ImageFont.truetype(G+"Inter/Inter-VariableFont_opsz,wght.ttf",30),fill=(200,200,200))
    for k,im in enumerate(ims):
        r,c=divmod(k,6); sh.paste(im.resize((tw,th),Image.LANCZOS),(pad+c*(tw+pad),top+r*(th+pad)))
    sh.save(path)
clean=[];ann=[]
for D in (D1,D2):
    for n,prod,note,beat,draw in D:
        im=base(); d=ImageDraw.Draw(im); draw(d)
        c=im.convert("L").convert("RGB").resize((W,H),Image.LANCZOS); c.save(out+f"ideas/pomotto/frames-v4/{n.replace('·','-').lower()}.png"); clean.append(c)
        a=im.convert("L").convert("RGB"); annotate(ImageDraw.Draw(a),n,prod,note,beat); ann.append(a.resize((W,H),Image.LANCZOS))
sheet(clean,out+"pomotto-storyboards-v4.png")
sheet(ann,out+"pomotto-storyboards-v4-annotated.png","Pomotto v4 annotated. Red lines = safe zones. Red pill = product illustration (2 of 12 beats, 17%).")
# model sheet
MW,MH=2400,1100
ms=Image.new("RGB",(MW*S,MH*S),(6,6,6)); d=ImageDraw.Draw(ms)
d.text(P(60,40),"Pomotto panda: model sheet",font=serif(64),fill=WH)
d.text(P(60,130),"Flat shapes. White #EEE, ink #080808, limbs/ears #484848. No shadows, no color. Superellipse head, patches carry the acting.",font=sans(26),fill=DIM)
poses=[("Front / neutral",dict()),("Distracted (ping)",dict(look=1,mouth="o",arms="type")),("Focused",dict(eyes="closed",arms="type",mouth="smile")),("Tired, 4pm",dict(eyes="tired",mouth="flat",tilt=2)),("Stretch (break)",dict(eyes="closed",arms="up",mouth="smile"))]
for i,(lab,kw) in enumerate(poses):
    cx=260+i*470; panda(d,cx,520,0.62,**kw)
    d.text(P(cx-140,960),lab,font=sans(30,400),fill=(200,200,200))
ms.convert("L").convert("RGB").resize((MW,MH),Image.LANCZOS).save(out+"pomotto-panda-sheet.png")
