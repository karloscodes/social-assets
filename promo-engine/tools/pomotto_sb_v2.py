from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os
W,H=1080,1920
G="/usr/share/fonts/truetype/sand-box/google/"
def serif(s,w=400):
    f=ImageFont.truetype(G+"Cormorant Garamond/CormorantGaramond-VariableFont_wght.ttf",s)
    try: f.set_variation_by_axes([w])
    except: pass
    return f
def sans(s,w=300):
    f=ImageFont.truetype(G+"Inter/Inter-VariableFont_opsz,wght.ttf",s)
    try: f.set_variation_by_axes([14,w])
    except: pass
    return f
def base(lx,ly,warm=(200,170,130),r=520,k=0.22):
    im=Image.new("RGB",(W,H),(7,7,9))
    glow=Image.new("RGB",(W,H),(0,0,0)); d=ImageDraw.Draw(glow)
    d.ellipse([lx-r,ly-r,lx+r,ly+r],fill=tuple(int(c*k) for c in warm))
    glow=glow.filter(ImageFilter.GaussianBlur(r*0.45))
    im=Image.blend(im,Image.eval(glow,lambda v:v),0.0)
    im=Image.fromarray(__import__("numpy").clip(__import__("numpy").asarray(im,dtype=int)+__import__("numpy").asarray(glow,dtype=int),0,255).astype("uint8"))
    return im
def laptop(im,cx,cy,w,screen=(18,18,20),lid=True,ui=None):
    d=ImageDraw.Draw(im); h=int(w*0.64)
    x0,y0=cx-w//2,cy-h
    d.rounded_rectangle([x0,y0,x0+w,cy],radius=18,fill=(14,14,16),outline=(40,40,44),width=2)
    d.rounded_rectangle([x0+14,y0+14,x0+w-14,cy-14],radius=8,fill=screen)
    d.rounded_rectangle([x0-40,cy,x0+w+40,cy+22],radius=10,fill=(26,26,29))
    if ui: ui(d,x0+14,y0+14,x0+w-14,cy-14)
def text(im,line,y,size=78,font=serif,color=(236,232,224),italic=False,sub=None):
    d=ImageDraw.Draw(im); f=font(size)
    d.text((44+40,y),line,font=f,fill=color)
    if sub: d.text((84,y+size+28),sub,font=sans(30,300),fill=(150,146,140))
def tag(im,n,rec,note,beat):
    d=ImageDraw.Draw(im)
    # safe zone guides
    d.rectangle([0,0,W,380],outline=None); 
    for y in (380,1436): d.line([(0,y),(W,y)],fill=(60,30,30),width=2)
    d.line([(940,380),(940,1436)],fill=(60,30,30),width=2); d.line([(44,380),(44,1436)],fill=(60,30,30),width=2)
    d.text((44,40),n,font=sans(34,500),fill=(120,118,112))
    d.text((44,90),beat,font=sans(28,300),fill=(100,98,94))
    if rec:
        d.rounded_rectangle([44,1480,600,1540],radius=30,fill=(120,30,30))
        d.text((70,1490),"● REAL MAC SCREEN RECORDING",font=sans(28,600),fill=(255,230,230))
    d.text((44,1580),note,font=sans(28,300),fill=(130,126,120))
def menubar(t):
    def ui(d,x0,y0,x1,y1):
        d.rectangle([x0,y0,x1,y0+22],fill=(30,30,33))
        d.text((x1-150,y0+2),t,font=sans(16,500),fill=(230,230,230))
    return ui
def soft(color):
    def ui(d,x0,y0,x1,y1): d.rectangle([x0,y0+22,x1,y1],fill=color)
    return ui
F=[]
# Demo 1: "The ping" (cost of interruption)
D1=[
 ("D1·1",True,"Slow push-in, 4.5s. Dark desk, one warm lamp. Mac lit, a ping dot appears.","0.0–4.5s hook",
  lambda im:(laptop(im,500,1150,640,ui=lambda d,a,b,c,e:(d.rectangle([a,b,c,e],fill=(22,22,25)),d.rounded_rectangle([c-210,b+30,c-20,b+80],radius=10,fill=(52,52,58)))),text(im,"One ping.",470,104))),
 ("D1·2",False,"Hold on near-black. Number fades up slowly. Result hold 2s.","4.5–9.0s",
  lambda im:(text(im,"23 minutes",600,150,color=(240,236,228)),text(im,"to get back to the task.",790,58,color=(180,176,168),sub="UC Irvine researchers"))),
 ("D1·3",True,"Macro on menu bar clock. Click Start. DND icon appears. Slow 3% drift.","9.0–13.5s",
  lambda im:(laptop(im,480,1250,820,ui=menubar("25:00   Wed 9:00")),text(im,"Start the timer.",470,96),text(im,"Your Mac goes quiet.",590,60,color=(170,166,160)))),
 ("D1·4",False,"Empty room, lamp only. Slow light breathe, no cuts. Rain sound bed.","13.5–18.0s",
  lambda im:text(im,"Nothing to toggle.",720,92)),
 ("D1·5",True,"Real break chime. Screen goes gray. Messages arrive softly. Hold 2s.","18.0–22.5s result",
  lambda im:(laptop(im,480,1250,820,ui=soft((70,70,74))),text(im,"Your messages",470,96),text(im,"are waiting.",585,96))),
 ("D1·6",False,"End card. Wordmark + price. Music fades out by 25.5s.","22.5–27.0s",
  lambda im:(text(im,"Pomotto",620,140),text(im,"Free to try. $2.99 once for Pro.",820,46,font=sans,color=(190,186,178)),text(im,"pomotto.app",900,40,font=sans,color=(140,136,130)))),
]
D2=[
 ("D2·1",False,"Window light moves across an empty chair. Slow pan left, 4.5s.","0.0–4.5s hook",
  lambda im:text(im,"It's 4pm.",520,110)),
 ("D2·2",True,"Same desk, cooler light. Clock in menu bar reads late. Hold.","4.5–9.0s",
  lambda im:(laptop(im,480,1250,820,ui=menubar("Wed 4:02 PM")),text(im,"Three hours,",470,96),text(im,"no break.",585,96))),
 ("D2·3",True,"Macro: menu bar countdown 17:14. Slow push.","9.0–13.5s",
  lambda im:(laptop(im,480,1250,820,ui=menubar("17:14   Wed 2:04 PM")),text(im,"A gentle chime",470,96),text(im,"tells you to stop.",585,96))),
 ("D2·4",False,"Hands leave keyboard, cup lifted, out of frame. Faceless. Warm light.","13.5–18.0s",
  lambda im:text(im,"Step away.",720,110)),
 ("D2·5",False,"Back to desk, light warmer. Result hold 2s.","18.0–22.5s result",
  lambda im:(text(im,"Still sharp",560,110),text(im,"at 4pm.",690,110))),
 ("D2·6",False,"End card. Music fades out by 25.5s.","22.5–27.0s",
  lambda im:(text(im,"Pomotto",620,140),text(im,"Free to try. $2.99 once for Pro.",820,46,font=sans,color=(190,186,178)),text(im,"pomotto.app",900,40,font=sans,color=(140,136,130)))),
]
out="/workspace/promo-engine/out/ideas/pomotto/frames-v2"
lights=[(820,500),(200,700),(700,900),(850,400),(600,800),(540,900)]
thumbs=[]
for row,(D,warm) in enumerate([(D1,(210,170,120)),(D2,(140,160,200))]):
    for i,(n,rec,note,beat,draw) in enumerate(D):
        im=base(*lights[i],warm=warm); draw(im); tag(im,n,rec,note,beat)
        p=f"{out}/{n.replace('·','-').lower()}.png"; im.save(p); thumbs.append(im)
s=0.3; tw,th=int(W*s),int(H*s); pad=24
sheet=Image.new("RGB",(pad+6*(tw+pad),110+2*(th+pad)+pad),(4,4,5)); d=ImageDraw.Draw(sheet)
d.text((pad,30),"Pomotto storyboard v2 — dark/cinematic. Red lines = safe zones. Red pill = real Mac recording.",font=sans(30,400),fill=(200,196,190))
for k,im in enumerate(thumbs):
    r,c=divmod(k,6); sheet.paste(im.resize((tw,th),Image.LANCZOS),(pad+c*(tw+pad),110+r*(th+pad)))
sheet.save("/workspace/promo-engine/out/pomotto-storyboards-v2.png")
