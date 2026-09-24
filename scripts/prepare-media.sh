#!/usr/bin/env bash
# Converts the raw brand assets in "../FOR WEBSITE" into web-sized files under public/.
# Re-run any time the source folder changes:  bash scripts/prepare-media.sh
# Needs ffmpeg on the PATH. Existing outputs are skipped; delete a file to rebuild it.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="${WEPIC_ASSETS:-../FOR WEBSITE}"
P="$SRC/Photos"; V="$SRC/Videos"
IMG=public/images; MED=public/media
mkdir -p "$IMG/portfolio" "$IMG/studio" "$MED/reels"

# ---------- Photos: long edge 2400px, high-quality JPEG ----------
img() { # img <source file> <dest path>
  [ -f "$2" ] && return 0
  ffmpeg -loglevel error -y -i "$P/$1" -vf "scale='if(gt(iw,ih),min(2400,iw),-2)':'if(gt(iw,ih),-2,min(2400,ih))'" -q:v 3 -frames:v 1 "$2" </dev/null
  echo "img  $2"
}
# portfolio
img DSC_0566.png  $IMG/portfolio/product-strawberry-cake.jpg
img DSC_0603.png  $IMG/portfolio/product-caramel-brownie.jpg
img DSC_0799.png  $IMG/portfolio/product-dessert-platter.jpg
img DSC_0922.png  $IMG/portfolio/product-gift-box.jpg
img DSC_11287.png $IMG/portfolio/portrait-fitness-rope.jpg
img DSC_1332.png  $IMG/portfolio/portrait-man-white-tank.jpg
img DSC_1570.png  $IMG/portfolio/portrait-fitness-pink.jpg
img DSC_2322.png  $IMG/portfolio/portrait-white-suit.jpg
img DSC_2580.png  $IMG/portfolio/portrait-rose-abaya-seated.jpg
img DSC_2583.png  $IMG/portfolio/portrait-rose-abaya.jpg
img DSC_2914.png  $IMG/portfolio/portrait-blue-suit-rings.jpg
img DSC_3349.png  $IMG/portfolio/portrait-pinstripe-man.jpg
img DSC_3422.jpg  $IMG/portfolio/portrait-red-light.jpg
img DSC_3450.jpg  $IMG/portfolio/portrait-red-smoke.jpg
img DSC_3746.png  $IMG/portfolio/commercial-ferrari-lusail.jpg
img DSC_3952.png  $IMG/portfolio/commercial-ferrari-stadium.jpg
img DSC_3974.png  $IMG/portfolio/commercial-ferrari-sunset.jpg
img DSC_4023.jpg  $IMG/portfolio/portrait-monochrome-man.jpg
img DSC_4077.jpg  $IMG/portfolio/commercial-spotlight-chair.jpg
img DSC_4281.jpg  $IMG/portfolio/portrait-skyline-silhouette.jpg
img DSC_5019.png  $IMG/portfolio/product-watch-vest.jpg
img DSC_6054.png  $IMG/portfolio/portrait-floor-pose.jpg
img DSC_6203.jpg  $IMG/portfolio/portrait-monochrome-dress.jpg
img DSC_6564.png  $IMG/portfolio/portrait-plaid-shirt.jpg
img DSC_7082.png  $IMG/portfolio/product-lip-gloss.jpg
img DSC_7329.png  $IMG/portfolio/product-navy-tee.jpg
img DSC_7734.png  $IMG/portfolio/product-black-quarter-zip.jpg
img DSC_8408.png  $IMG/portfolio/portrait-pinstripe-woman.jpg
img DSC_8662.png  $IMG/portfolio/portrait-pinstripe-woman-seated.jpg
img DSC_9317.png  $IMG/portfolio/commercial-mustang-side.jpg
img DSC_9364.png  $IMG/portfolio/commercial-mustang-front.jpg
img DSC_9386.png  $IMG/portfolio/commercial-mustang-974.jpg
img IMG_5088.PNG  $IMG/portfolio/portrait-black-abaya.jpg
img IMG_5095.PNG  $IMG/portfolio/portrait-black-abaya-full.jpg
img "Lime green.png" $IMG/portfolio/product-kinza-can.jpg
# studio
img DSC_3751.jpg  $IMG/studio/studio-floor-1.jpg
img DSC_3753.jpg  $IMG/studio/studio-floor-2.jpg
img DSC_3754.jpg  $IMG/studio/studio-floor-3.jpg
img DSC_3756.jpg  $IMG/studio/studio-floor-4.jpg
img DSC_3757.jpg  $IMG/studio/studio-floor-5.jpg
img DSC_3686.jpg  $IMG/studio/set-majlis.jpg
img DSC_3690.jpg  $IMG/studio/set-majlis-wide.jpg
img DSC_3707.jpg  $IMG/studio/set-purple-lounge.jpg
img DSC_3714.jpg  $IMG/studio/set-black-curtain.jpg
img DSC_3729.jpg  $IMG/studio/set-panel-wall.jpg
img DSC_4085.jpg  $IMG/studio/set-armchair.jpg

# Open Graph share image (1200x630) from a studio wide shot
[ -f public/og-image.jpg ] || ffmpeg -loglevel error -y -i "$P/DSC_3754.jpg" -vf "scale=1200:-2,crop=1200:630" -q:v 3 -frames:v 1 public/og-image.jpg </dev/null

# ---------- Hero videos (muted, looping) ----------
X264="-c:v libx264 -preset slow -pix_fmt yuv420p -profile:v high -movflags +faststart -an"
col() { echo "[$1:v]fps=24,scale=640:-2,crop=640:1080,setsar=1[c$1]"; }
if [ ! -f $MED/hero-desktop.mp4 ]; then
  # Desktop: three vertical reels side by side (studio tour | fashion | automotive) = 1920x1080
  ffmpeg -loglevel error -y \
    -ss 3 -t 16 -i "$V/Wepic promo 4.mp4" \
    -ss 1 -t 16 -i "$V/fashion video Ultra HD.mp4" \
    -ss 1 -t 16 -i "$V/ferrari.mp4" \
    -filter_complex "$(col 0);$(col 1);$(col 2);[c0][c1][c2]hstack=3,fade=in:st=0:d=0.6,fade=out:st=15.4:d=0.6[v]" \
    -map "[v]" $X264 -crf 27 $MED/hero-desktop.mp4 </dev/null
  echo "vid  hero-desktop"
fi
if [ ! -f $MED/hero-mobile.mp4 ]; then
  ffmpeg -loglevel error -y -ss 3 -t 20 -i "$V/Wepic promo 4.mp4" \
    -vf "fps=24,scale=720:1280,fade=in:st=0:d=0.6,fade=out:st=19.4:d=0.6" $X264 -crf 27 $MED/hero-mobile.mp4 </dev/null
  echo "vid  hero-mobile"
fi
[ -f public/images/hero-poster.jpg ] || ffmpeg -loglevel error -y -ss 5 -i $MED/hero-desktop.mp4 -frames:v 1 -q:v 3 public/images/hero-poster.jpg </dev/null
[ -f public/images/hero-poster-mobile.jpg ] || ffmpeg -loglevel error -y -ss 5 -i $MED/hero-mobile.mp4 -frames:v 1 -q:v 3 public/images/hero-poster-mobile.jpg </dev/null

# ---------- Reels (with sound, click to play) ----------
reel() { # reel <source> <slug> [start] [duration] [portrait|landscape]
  local out=$MED/reels/$2.mp4 ss=${3:-0} t=${4:-60} o=${5:-portrait} vf
  if [ "$o" = landscape ]; then vf="scale=1280:-2"; else vf="scale=540:-2"; fi
  if [ ! -f $out ]; then
    ffmpeg -loglevel error -y -ss $ss -t $t -i "$V/$1" -vf "fps=25,$vf" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p \
      -c:a aac -b:a 96k -movflags +faststart $out </dev/null
    echo "reel $2"
  fi
  [ -f $MED/reels/$2.jpg ] || ffmpeg -loglevel error -y -ss 1.5 -i $out -frames:v 1 -q:v 4 $MED/reels/$2.jpg </dev/null
}
reel "Wepic promo 4.mp4"           studio-tour
reel "Podcast Services.mov"        podcast-services
reel "fashion video Ultra HD.mp4"  fashion-editorial
reel "ferrari.mp4"                 ferrari-reel
reel "orange juice.mp4"            orange-juice
reel "perfume drft 1.mp4"          perfume
reel "watch draft 1.mp4"           watch
reel "zeekr speed ramp.mp4"        zeekr-speed-ramp
reel "Le Bleu full video.mp4"      le-bleu
reel "cinematic draft 3.mp4"       volvo-xc90-film 0 60 landscape
echo "done"
