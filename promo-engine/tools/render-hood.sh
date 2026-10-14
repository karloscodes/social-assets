#!/bin/bash
# Re-render hoodiechamp deliverables (silent + music) into out/
set -e
cd "$(dirname "$0")/../remotion"; O=../out; A=../research/hoodiechamp
V="-c:v libx264 -preset slow -b:v 12M -maxrate 14M -bufsize 24M -pix_fmt yuv420p -movflags +faststart"
job(){ comp=$1; name=$2; track=$3; ss=$4; fin=$5
  npx remotion render $comp /tmp/$name-raw.mp4 --codec=h264 --crf=14 --bundle-cache=false --log=error
  ffmpeg -y -v error -i /tmp/$name-raw.mp4 $V -an $O/$name-vertical.mp4
  d=$(ffprobe -v error -select_streams v -show_entries stream=duration -of csv=p=0 $O/$name-vertical.mp4); st=$(python3 -c "print(round($d-2.8,3))")
  ffmpeg -y -v error -i $O/$name-vertical.mp4 -ss $ss -i $track -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-19:TP=-1.5:LRA=11,afade=t=in:d=$fin,afade=t=out:st=$st:d=2.5,apad" -t $d -ar 48000 -c:a aac -b:a 192k -movflags +faststart $O/$name-music-vertical.mp4
  ffmpeg -y -v error -i $O/$name-vertical.mp4 -vf "fps=12/$d,scale=270:-1,tile=6x2" -frames:v 1 $O/$name-contact.png; echo done $name; }
job HoodPain hoodiechamp-pain-v1 $A/audio/picnic.mp3 0.70 0.05
job HoodCreators2En hoodiechamp-creators-v3-en $A/audio/sweetsun.mp3 0.79 0.05
job HoodCreators2Es hoodiechamp-creators-v3-es $A/audio/sweetsun.mp3 0.79 0.05
job HoodLaunchEs hoodiechamp-launch-es $A/music/holizna-the-good-times.mp3 4 1.2
