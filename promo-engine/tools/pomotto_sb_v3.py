from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os
W,H=1080,1920
ANN_LINE=(200,40,40); ANN_PILL=(170,30,30)
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
def base(lx,ly,warm=(167,167,167),r=520,k=0.22):
    im=Image.new("RGB",(W,H),(7,7,7))
    glow=Image.new("RGB",(W,H),(0,0,0)); d=ImageDraw.Draw(glow)
    d.ellipse([lx-r,ly-r,lx+r,ly+r],fill=tuple(int(c*k) for c in warm))
    glow=glow.filter(ImageFilter.GaussianBlur(r*0.45))
    im=Image.blend(im,Image.eval(glow,lambda v:v),0.0)
    im=Image.fromarray(__import__("numpy").clip(__import__("numpy").asarray(im,dtype=int)+__import__("numpy").asarray(glow,dtype=int),0,255).astype("uint8"))
    return im
def laptop(im,cx,cy,w,screen=(18,18,18),lid=True,ui=None):
    d=ImageDraw.Draw(im); h=int(w*0.64)
    x0,y0=cx-w//2,cy-h
    d.rounded_rectangle([x0,y0,x0+w,cy],radius=18,fill=(14,14,14),outline=(42,42,42),width=2)
    d.rounded_rectangle([x0+14,y0+14,x0+w-14,cy-14],radius=8,fill=screen)
    d.rounded_rectangle([x0-40,cy,x0+w+40,cy+22],radius=10,fill=(27,27,27))
    if ui: ui(d,x0+14,y0+14,x0+w-14,cy-14)
def text(im,line,y,size=78,font=serif,color=(231,231,231),italic=False,sub=None):
    d=ImageDraw.Draw(im); f=font(size)
    d.text((44+40,y),line,font=f,fill=color)
    if sub: d.text((84,y+size+28),sub,font=sans(30,300),fill=(145,145,145))
def tag(im,n,rec,note,beat,ann=True):
    if not ann: return
    d=ImageDraw.Draw(im)
    # safe zone guides
    d.rectangle([0,0,W,380],outline=None); 
    for y in (380,1436): d.line([(0,y),(W,y)],fill=ANN_LINE,width=2)
    d.line([(940,380),(940,1436)],fill=ANN_LINE,width=2); d.line([(44,380),(44,1436)],fill=ANN_LINE,width=2)
    d.text((44,40),n,font=sans(34,500),fill=(117,117,117))
    d.text((44,90),beat,font=sans(28,300),fill=(97,97,97))
    if rec:
        d.rounded_rectangle([44,1480,600,1540],radius=30,fill=ANN_PILL)
        d.text((70,1490),"● REAL MAC SCREEN RECORDING",font=sans(28,600),fill=(255,255,255))
    d.text((44,1580),note,font=sans(28,300),fill=(125,125,125))
def menubar(t):
    def ui(d,x0,y0,x1,y1):
        d.rectangle([x0,y0,x1,y0+22],fill=(30,30,30))
        d.text((x1-150,y0+2),t,font=sans(16,500),fill=(230,230,230))
    return ui
def soft(color):
    def ui(d,x0,y0,x1,y1): d.rectangle([x0,y0+22,x1,y1],fill=color)
    return ui
F=[]
# Demo 1: "The ping" (cost of interruption)
D1=[
 ("D1·1",True,"Slow push-in, 4.5s. Dark desk, one warm lamp. Mac lit, a ping dot appears.","0.0–4.5s hook",
  lambda im:(laptop(im,500,1150,640,ui=lambda d,a,b,c,e:(d.rectangle([a,b,c,e],fill=(22,22,22)),d.rounded_rectangle([c-210,b+30,c-20,b+80],radius=10,fill=(56,56,56)))),text(im,"One ping.",470,104))),
 ("D1·2",False,"Hold on near-black. Number fades up slowly. Result hold 2s.","4.5–9.0s",
  lambda im:(text(im,"23 minutes",600,150,color=(235,235,235)),text(im,"to get back to the task.",790,58,color=(175,175,175),sub="UC Irvine researchers"))),
 ("D1·3",True,"Macro on menu bar clock. Click Start. DND icon appears. Slow 3% drift.","9.0–13.5s",
  lambda im:(laptop(im,480,1250,820,ui=menubar("25:00   Wed 9:00")),text(im,"Start the timer.",470,96),text(im,"Your Mac goes quiet.",590,60,color=(165,165,165)))),
 ("D1·4",False,"Empty room, lamp only. Slow light breathe, no cuts. Rain sound bed.","13.5–18.0s",
  lambda im:text(im,"Nothing to toggle.",720,92)),
 ("D1·5",True,"Real break chime. Screen goes gray. Messages arrive softly. Hold 2s.","18.0–22.5s result",
  lambda im:(laptop(im,480,1250,820,ui=soft((72,72,72))),text(im,"Your messages",470,96),text(im,"are waiting.",585,96))),
 ("D1·6",False,"End card. Wordmark + price. Music fades out by 25.5s.","22.5–27.0s",
  lambda im:(text(im,"Pomotto",620,140),text(im,"Free to try. $2.99 once for Pro.",820,46,font=sans,color=(185,185,185)),text(im,"pomotto.app",900,40,font=sans,color=(135,135,135)))),
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
  lambda im:(text(im,"Pomotto",620,140),text(im,"Free to try. $2.99 once for Pro.",820,46,font=sans,color=(185,185,185)),text(im,"pomotto.app",900,40,font=sans,color=(135,135,135)))),
]
out="/workspace/promo-engine/out/ideas/pomotto/frames-v3"
lights=[(820,500),(200,700),(700,900),(850,400),(600,800),(540,900)]
def build(ann):
    th_=[]
    for row,(D,warm) in enumerate([(D1,(200,200,200)),(D2,(170,170,170))]):
        for i,(n,rec,note,beat,draw) in enumerate(D):
            im=base(*lights[i],warm=warm); draw(im); tag(im,n,rec,note,beat,ann)
            im=im.convert("L").convert("RGB") if not ann else im
            if not ann: im.save(f"{out}/{n.replace('·','-').lower()}.png")
            th_.append(im)
    s=0.3; tw,th=int(W*s),int(H*s); pad=24
    top=110 if ann else pad
    sheet=Image.new("RGB",(pad+6*(tw+pad),top+2*(th+pad)),(0,0,0)); d=ImageDraw.Draw(sheet)
    if ann: d.text((pad,30),"Pomotto v3 annotated. Red lines = safe zones. Red pill = real Mac recording.",font=sans(30,400),fill=(200,200,200))
    for k,im in enumerate(th_):
        r,c=divmod(k,6); sheet.paste(im.resize((tw,th),Image.LANCZOS),(pad+c*(tw+pad),top+r*(th+pad)))
    sheet.save("/workspace/promo-engine/out/pomotto-storyboards-v3"+("-annotated" if ann else "")+".png")
build(False); build(True)
