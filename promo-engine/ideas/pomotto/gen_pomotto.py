# Pomotto still storyboards. Real screens from pomotto.app demo.mp4 + studio app-store shots; panda from studio posts.
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
S='/tmp/pf/'; O='/workspace/promo-engine/out/ideas/pomotto/frames/'
FB='/tmp/studio/fonts/Inter-Black.otf'
fb=lambda n: ImageFont.truetype(FB,n)
fr=lambda n: ImageFont.truetype('/usr/share/fonts/truetype/sand-box/google/Inter/Inter-VariableFont_opsz,wght.ttf',n)
W,H=1080,1920; VT,VB=380,1290; INK=(26,26,28)
def visual(src,box,flash=0,cursor=None):
    im=Image.open(S+src).convert('RGB').crop(box).resize((W,VB-VT),Image.LANCZOS)
    if flash: im=Image.blend(im,Image.new('RGB',im.size,'white'),flash)
    d=ImageDraw.Draw(im,'RGBA')
    if cursor:
        x,y=cursor; d.ellipse((x-34,y-34,x+34,y+34),fill=(26,26,28,40),outline=(26,26,28,120),width=3)
    return im
def frame(name,vis,cap,extra=None,note=None):
    c=Image.new('RGB',(W,H),'white'); c.paste(vis,(0,VT)); d=ImageDraw.Draw(c,'RGBA')
    if extra: extra(c,d)
    y=1306
    for ln in cap.split('\n'):
        d.text((44,y),ln,font=fb(60),fill=INK); y+=68
    if note: d.text((44,330),note,font=fr(26),fill=(140,140,140))
    c.save(O+name+'.png')
def endcard(name):
    c=Image.new('RGB',(W,H),(8,8,9)); d=ImageDraw.Draw(c)
    ic=Image.open(S+'icon-Pomotto.png').convert('RGBA').resize((200,200)); c.paste(ic,(440,560),ic)
    def ctr(t,f,y,col): w=d.textlength(t,font=f); d.text(((W-w)/2,y),t,font=f,fill=col)
    ctr('Pomotto',fb(110),800,'white'); ctr('Notifications stop while you work.',fr(44),960,(200,200,200))
    ctr('Free to try. $2.99 once for Pro.',fb(52),1080,'white'); ctr('pomotto.app',fr(48),1190,(200,200,200))
    c.save(O+name+'.png')
def panda(src,cap):
    return Image.open(S+src).convert('RGB').crop((0,330,1080,1240))
def call_card(c,d):
    x,y=560,470; d.rounded_rectangle((x,y,x+480,y+120),26,fill=(245,245,247,250),outline=(210,210,215))
    d.ellipse((x+22,y+30,x+82,y+90),fill=(52,199,89)); d.text((x+100,y+24),'Mom',font=fb(30),fill=INK)
    d.text((x+100,y+66),'Favorite · calling',font=fr(26),fill=(90,90,90))
def keys(c,d):
    x=300
    for k in ['⌃','⌥','P']:
        d.rounded_rectangle((x,600,x+140,740),24,fill='white',outline=INK,width=5)
        w=d.textlength(k,font=fb(70)); d.text((x+70-w/2,618),k,font=fb(70),fill=INK); x+=170
TOPR=(900,0,1920,859); TIMER=(1250,400,1850,905); DND=(1000,0,1920,775)
# Demo 1: Do Not Disturb by itself
frame('d1-1',visual('d1.png',TOPR),'A ping.\nYour focus is gone.')
frame('d1-2',panda('cover.jpg',''),'One Slack ping can\ncost you 23 minutes.')
frame('d1-3',visual('d12.5.png',TIMER),'Click start.')
frame('d1-4',visual('d15.png',DND),'Do Not Disturb\nturns on by itself.')
frame('d1-5',visual('d20.png',DND),'Notifications stop.')
endcard('d1-6')
# Demo 2: breaks start on their own
frame('d2-1',panda('pflow.jpg',''),'Three hours.\nNo break.')
frame('d2-2',visual('d21.png',TIMER),'The break starts\non its own.')
frame('d2-3',visual('d26.png',TIMER,flash=0.15),'A gentle chime.\nA soft flash.')
frame('d2-4',visual('d15.png',DND),'Favorites still\nget through.',extra=call_card,note='Staged: drawn call card, example contact')
frame('d2-5',visual('d24.png',DND),'Break. Your messages\nare waiting.')
endcard('d2-6')
# Demo 3 (sketch): menu bar, shortcut, Siri
frame('d3-1',visual('menubar-menu.png',(0,0,640,539)),'It lives in\nthe menu bar.')
frame('d3-2',visual('d12.5.png',TIMER),'Start it from\nany app.',extra=keys)
frame('d3-3',visual('01-ask-siri.png',(260,600,1620,1745)),'Or ask Siri for\n25 minutes.')
endcard('d3-4')
# board
rows=[[f'd1-{i}' for i in range(1,7)],[f'd2-{i}' for i in range(1,7)],[f'd3-{i}' for i in range(1,5)]]
tw,th=360,640; B=Image.new('RGB',(6*tw+7*20,3*(th+90)+20),(230,230,232)); d=ImageDraw.Draw(B)
for r,row in enumerate(rows):
    d.text((20,r*(th+90)+20),['Demo 1 · Do Not Disturb by itself (priority)','Demo 2 · Breaks start on their own','Demo 3 · sketch · menu bar, shortcut, Siri'][r],font=fb(40),fill=INK)
    for k,n in enumerate(row):
        B.paste(Image.open(O+n+'.png').resize((tw,th)),(20+k*(tw+20),r*(th+90)+80))
B.save('/workspace/promo-engine/out/pomotto-storyboards.png')
