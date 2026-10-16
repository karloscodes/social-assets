#!/bin/bash
# Render cinematic promos (LogNorth 3am, hoodiechamp world EN/ES): silent + music + contact sheets
set -e
cd "$(dirname "$0")/../remotion"; O=../out
V="-c:v libx264 -preset slow -b:v 12M -maxrate 14M -bufsize 24M -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -movflags +faststart"
job(){ comp=$1; name=$2; track=$3; ss=$4
  npx remotion render $comp /tmp/$name-raw.mp4 --codec=h264 --crf=14 --bundle-cache=false --log=error
  ffmpeg -y -v error -i /tmp/$name-raw.mp4 -vf "scale=out_color_matrix=bt709:out_range=tv" $V -an $O/$name-vertical.mp4
  d=$(ffprobe -v error -select_streams v -show_entries stream=duration -of csv=p=0 $O/$name-vertical.mp4)
  ffmpeg -y -v error -i $O/$name-vertical.mp4 -vf "fps=12/$d,scale=270:-1,tile=6x2" -frames:v 1 $O/$name-contact.png
  if [ -n "$track" ]; then st=$(python3 -c "print(round($d-3.0,3))")
    ffmpeg -y -v error -i $O/$name-vertical.mp4 -ss $ss -i $track -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-19:TP=-1.5:LRA=11,afade=t=in:d=0.8,afade=t=out:st=$st:d=2.7,apad" -t $d -ar 48000 -c:a aac -b:a 192k -movflags +faststart $O/$name-music-vertical.mp4; fi
  echo done $name $d; }
A=../research/hoodiechamp
job LogNorth3am lognorth-3am-cinematic-v2 $A/music/holizna-the-good-times.mp3 4
job HoodWorldEn hoodiechamp-world-v2-en $A/audio/picnic.mp3 0.70
job HoodWorldEs hoodiechamp-world-v2-es $A/audio/picnic.mp3 0.70
