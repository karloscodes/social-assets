#!/bin/bash
# Pomotto demo 1 "One ping": silent + music (CC0 Holizna "Ocean Memory") + soft chime at 18.3s + contact sheet
set -e
cd "$(dirname "$0")/../remotion"; O=../out; M=../research/pomotto/music; name=pomotto-one-ping-v1
V="-c:v libx264 -preset slow -b:v 12M -maxrate 14M -bufsize 24M -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -movflags +faststart"
npx remotion render PomottoOnePing /tmp/$name-raw.mp4 --codec=h264 --crf=14 --bundle-cache=false --log=error
ffmpeg -y -v error -i /tmp/$name-raw.mp4 -vf "format=gray,format=yuv420p,scale=out_color_matrix=bt709:out_range=tv,setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv" $V -an $O/$name-silent-vertical.mp4
d=$(ffprobe -v error -select_streams v -show_entries stream=duration -of csv=p=0 $O/$name-silent-vertical.mp4)
st=$(python3 -c "print(round($d-3.2,3))")
ffmpeg -y -v error -i $O/$name-silent-vertical.mp4 -ss 2 -i $M/ocean-memory.mp3 -i $M/chime.wav -map 0:v -c:v copy \
 -filter_complex "[1:a]loudnorm=I=-20:TP=-2:LRA=11,afade=t=in:d=1.2,afade=t=out:st=$st:d=2.8,aresample=48000[m];[2:a]adelay=18300|18300,volume=0.8[c];[m][c]amix=inputs=2:normalize=0:duration=first,apad[a]" \
 -map "[a]" -t $d -ar 48000 -c:a aac -b:a 192k -movflags +faststart $O/$name-music-vertical.mp4
ffmpeg -y -v error -i $O/$name-silent-vertical.mp4 -vf "fps=12/$d,scale=270:-1,tile=6x2" -frames:v 1 $O/$name-contact.png
echo done $d
