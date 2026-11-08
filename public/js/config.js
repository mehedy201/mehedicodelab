/* js/config.js — behaviour settings: where each icon floats, how many stars, speeds and distances. */
window.PF = window.PF || {};
PF.config = (() => {
// [icon, desktop X%, desktop Y%, mobile X%, mobile Y%]
const ICONS = [
  ["html",64,16,14,70],  ["css",88,8,84,70],    ["js",76,32,32,93],   ["react",58,48,6,86],
  ["node",70,68,92,90],  ["mongo",92,84,72,76], ["wp",60,88,28,78],   ["php",82,60,66,95],
  ["git",96,24,46,70],   ["next",74,92,14,96],  ["ts",54,24,4,76],    ["tw",84,40,66,69],
  ["vscode",66,6,86,95], ["figma",52,62,90,80], ["ps",66,30,54,97]
];
const STARS = 80;            // tiny twinkling dots
const DOT_COLORS = ["#FF4D1F","#7C5CFF","#00B894","#0984E3","#F7B731","#E84393","#121212"];   // random dot colors
const REPEL_RADIUS = 140;    // cursor distance that pushes icons (px)
const REPEL_FORCE = 90;      // how far they move away (px)
const HEADLINE_WAIT = 3;     // seconds each headline stays
const PHOTO_X = -0.23;       // photo position in About (share of screen width)
const TABLET = 1024;         // at or below this width the mobile layout is used
const TEXT = "h1,h2,h3,p,li,.l,.menu li a,.meta a,nav b";   // elements that show the glass lens
return { ICONS, STARS, DOT_COLORS, REPEL_RADIUS, REPEL_FORCE, HEADLINE_WAIT, PHOTO_X, TABLET, TEXT };
})();
