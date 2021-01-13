/*
TODO:
graphics:
asset creation
- animation stack
  - win
- undo button
- add tutorial
- add levels
*/

//initialize canvas
const c = document.getElementById("canvas");
const ctx = c.getContext("2d", { alpha: false });
c.style.backgroundColor = "red";
c.width = window.innerWidth;
c.height = window.innerHeight;
//check for mobile
function isMobile() {
  let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  let mq = function(query) {
    return window.matchMedia(query).matches;
  }

  if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }
  let query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}

//initialize variables and constants
let w = c.width,
  h = c.height,
  mobile = isMobile(),
  last = true,
  mouseIsPressed = false;
let keys = [];
let mouseX = 0,
  mouseY = 0;
//check aspect ratio
let ARType = 1,
  min, minx, miny;

function getARType(AR) {
  if(AR < 0.8) { ARType = 1; } else if(AR > 1.2) { ARType = 3; } else { ARType = 2; }
  min = w > h ? h : w;
  minx = min;
  miny = min;
}
getARType(w / h);

let version = "0.4.3";
let level = 0;
let abcLevels=[
  [
    {
      title: "A1",
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[4, 3],[4,-2],[4,-2]],
        [[0,-1],[2,-1],[0,-1],[3, 2],[0,-1]],
        [[2,-1],[2, 1],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[2,-1],[0,-1],[1,-1],[0,-1]],
        [[0,-1],[0,-1],[1,-1],[1,-1],[1, 0]],
      ],
      stepGoals: [43, 53, 75, 100],
      best: 0
    },
    {
      title: "G1",
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[1, 0],[1,-1],[1,-1],[2,-1],[2,-1]],
        [[1,-1],[0,-1],[0,-1],[0,-1],[2,-1]],
        [[5, 4],[0,-1],[0,-1],[0,-1],[2, 1]],
        [[5,-2],[0,-1],[4,-1],[0,-1],[3, 2]],
        [[0,-1],[0,-1],[4, 3],[4,-1],[0,-1]],
      ],
      stepGoals: [162, 185, 200, 250],
      best: 0
    },
    {
      title: "G2",
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[1,-1],[1, 0],[2,-1],[2, 1],[2,-1]],
        [[1,-1],[0,-1],[0,-1],[0,-1],[3,-1]],
        [[4,-1],[0,-1],[0,-1],[0,-1],[3, 2]],
        [[4, 3],[0,-1],[5,-2],[0,-1],[3,-1]],
        [[0,-1],[0,-1],[5, 4],[5,-2],[0,-1]],
      ],
      stepGoals: [207, 225, 250, 300],
      best: 0
    },
  ],
  // 2nd hardest
  [

  ],
  // 3rd hardest
  [
    {
      title: "G3",
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[1, 0],[1, -1],[1, -1],[4, 3],[4, -1]],
        [[1, -1],[0, -1],[0, -1],[0, -1],[4, -1]],
        [[3, 2],[0, -1],[0, -1],[0, -1],[5, -2]],
        [[3, -1],[0, -1],[2, -1],[0, -1],[5, 4]],
        [[0, -1],[0, -1],[2, 1],[2, -1],[0, -1]]
      ],
      stepGoals: [101, 110, 120, 130],
      best: 0
    }
  ],
  // hardest under 75
  [

  ],
];

abcLevels = [
  [
    {
      title: "A-1",
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1,-1],[1,-1],[1, 0]],
        [[0,-1],[3,-1],[0,-1],[2,-1],[0,-1]],
        [[3,-1],[3, 2],[0,-1],[2, 1],[0,-1]],
        [[0,-1],[3,-1],[0,-1],[2,-1],[0,-1]],
        [[0,-1],[0,-1],[4,-2],[4,-2],[4, 3]],
      ],
      stepGoals: [47, 55, 65, 80],
      best: 0
    },
    {
      title: "A-1",
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[4, 3],[1, 0],[1,-1]],
        [[0,-1],[5, 4],[0,-1],[3,-1],[0,-1]],
        [[5,-2],[5,-2],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[5,-2],[0,-1],[3, 2],[0,-1]],
        [[0,-1],[0,-1],[2, 1],[2,-1],[2,-1]],
      ],
      stepGoals: [40, 45, 55, 75],
      best: 0
    },
    {
      title: "A-2",
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[4, 3],[1,-1],[1, 0]],
        [[0,-1],[5,-2],[0,-1],[3,-1],[0,-1]],
        [[5,-2],[5, 4],[0,-1],[3, 2],[0,-1]],
        [[0,-1],[5,-2],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[0,-1],[2,-1],[2,-1],[2, 1]],
      ],
      stepGoals: [52, 60, 75, 90],
      best: 0
    },
    {
      title: "A-3",// puzzle 288
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[4, 3],[1,-1],[1, 0]],
        [[0,-1],[3,-1],[0,-1],[5, 4],[0,-1]],
        [[3, 2],[3,-1],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[3,-1],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[0,-1],[2,-1],[2,-1],[2, 1]],
      ],
      stepGoals: [71, 78, 90, 110],
      best: 0
    },
    {
      title: "A-4",// puzzle 712
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[2, 1],[1, 0],[1,-1]],
        [[0,-1],[5,-2],[0,-1],[4,-1],[0,-1]],
        [[5,-2],[5,-2],[0,-1],[4, 3],[0,-1]],
        [[0,-1],[5, 4],[0,-1],[4,-1],[0,-1]],
        [[0,-1],[0,-1],[3,-1],[3,-1],[3, 2]],
      ],
      stepGoals: [70, 80, 95, 120],
      best: 0
    },
    {
      title: "A-5",// puzzle 2448
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[4, 3],[2, 1],[2,-1]],
        [[0,-1],[1,-1],[0,-1],[5, 4],[0,-1]],
        [[1, 0],[1,-1],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[1,-1],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[0,-1],[3,-1],[3, 2],[3,-1]],
      ],
      stepGoals: [85, 95, 110, 130],
      best: 0
    },
    {
      title: "A-1",// puzzle 540
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[4, 3],[4,-2],[4,-2]],
        [[0,-1],[2,-1],[0,-1],[3, 2],[0,-1]],
        [[2,-1],[2, 1],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[2,-1],[0,-1],[1,-1],[0,-1]],
        [[0,-1],[0,-1],[1,-1],[1,-1],[1, 0]],
      ],
      stepGoals: [43, 48, 60, 75],
      best: 0
    },
    {
      title: "A-1",// puzzle 60
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1,-1],[1,-1],[1, 0]],
        [[0,-1],[5, 4],[0,-1],[3,-1],[0,-1]],
        [[5,-2],[5,-2],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[5,-2],[0,-1],[3, 2],[0,-1]],
        [[0,-1],[0,-1],[2, 1],[3,-1],[4, 3]],
      ],
      stepGoals: [47, 52, 60, 75],
      best: 0
    },// 100// 150// 200// 350// 300// 250
    {
      title: "A-2",// puzzle 480
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1,-1],[1,-1],[1, 0]],
        [[0,-1],[2,-1],[0,-1],[5, 4],[0,-1]],
        [[2, 1],[2,-1],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[2,-1],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[0,-1],[3, 2],[5,-2],[4, 3]],
      ],
      stepGoals: [52, 60, 70, 85],
      best: 0
    },
    {
      title: "A-3",// puzzle 1344
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[2,-1],[2,-1],[2, 1]],
        [[0,-1],[3,-1],[0,-1],[5, 4],[0,-1]],
        [[3, 2],[3,-1],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[3,-1],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[0,-1],[1, 0],[5,-2],[4, 3]],
      ],
      stepGoals: [61, 70, 80, 100],
      best: 0
    },
    {
      title: "A-4",// puzzle 3792
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[4,-1],[4,-1],[4, 3]],
        [[0,-1],[5,-2],[0,-1],[1,-1],[0,-1]],
        [[5, 4],[5,-2],[0,-1],[1, 0],[0,-1]],
        [[0,-1],[5,-2],[0,-1],[1,-1],[0,-1]],
        [[0,-1],[0,-1],[2, 1],[1,-1],[3, 2]],
      ],
      stepGoals: [87, 95, 110, 130],
      best: 0
    },// 3950// 3500// 3400// 2950// 3600// 3450// 4250
    {
      title: "A-5",// puzzle 3900
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[4, 3],[4,-1],[4,-1]],
        [[0,-1],[5, 4],[0,-1],[3,-1],[0,-1]],
        [[5,-2],[5,-2],[0,-1],[3, 2],[0,-1]],
        [[0,-1],[5,-2],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[0,-1],[2, 1],[3,-1],[1, 0]],
      ],
      stepGoals: [93, 100, 120, 150],
      best: 0
    },// 3800// 3700// 3900// 3250// 3750// 4550// 4000// 4200// 4100// 4850// 3550// 4300// 4050// 5150// 4500// 4400// 5450// 3850
    {
      title: "A-6",// puzzle 4776
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[5, 4],[5,-2],[5,-2]],
        [[0,-1],[4,-1],[0,-1],[3,-1],[0,-1]],
        [[4,-1],[4, 3],[0,-1],[3, 2],[0,-1]],
        [[0,-1],[4,-1],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[0,-1],[1, 0],[3,-1],[2, 1]],
      ],
      stepGoals: [90, 100, 115, 140],
      best: 0
    },

    {
      title: "A-1",// puzzle 88
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
        [[0,-1],[4, 3],[0,-1],[3,-1],[0,-1]],
        [[5, 4],[5,-2],[0,-1],[3, 2],[0,-1]],
        [[0,-1],[5,-2],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[0,-1],[2,-1],[2, 1],[2,-1]],
      ],
      stepGoals: [40, 45, 55, 70],
      best: 0
    },
    {
      title: "A-2",// puzzle 80
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
        [[0,-1],[4, 3],[0,-1],[3, 2],[0,-1]],
        [[5, 4],[5,-2],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[5,-2],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[0,-1],[2,-1],[2, 1],[2,-1]],
      ],
      stepGoals: [106, 115, 130, 160],
      best: 0
    },
    {
      title: "A-3",// puzzle 80
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
        [[0,-1],[4, 3],[0,-1],[3, 2],[0,-1]],
        [[5, 4],[5,-2],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[5,-2],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[0,-1],[2, 1],[2,-1],[2,-1]],
      ],
      stepGoals: [124, 130, 150, 200],
      best: 0
    },
    {
      title: "A-4",// puzzle 240
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1, 0],[1,-1],[1,-1]],
        [[0,-1],[3, 2],[0,-1],[4, 3],[0,-1]],
        [[5, 4],[5,-2],[0,-1],[4,-1],[0,-1]],
        [[0,-1],[5,-2],[0,-1],[4,-1],[0,-1]],
        [[0,-1],[0,-1],[2,-1],[2, 1],[2,-1]],
      ],
      stepGoals: [137, 145, 200, 250],
      best: 0
    },
    {
      title: "A-5",// puzzle 312
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1, 0],[1,-1],[1,-1]],
        [[0,-1],[3, 2],[0,-1],[4,-1],[0,-1]],
        [[5,-2],[5,-2],[0,-1],[4,-1],[0,-1]],
        [[0,-1],[5, 4],[0,-1],[4, 3],[0,-1]],
        [[0,-1],[0,-1],[2, 1],[2,-1],[2,-1]],
      ],
      stepGoals: [105, 115, 140, 180],
      best: 0
    },// 400
    {
      title: "G-6",// puzzle 456
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1, 0],[1,-1],[1,-1]],
        [[0,-1],[3, 2],[0,-1],[5, 4],[0,-1]],
        [[4,-1],[4,-1],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[4, 3],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[0,-1],[2,-1],[2, 1],[2,-1]],
      ],
      stepGoals: [107, 115, 140, 180],
      best: 0
    },// 450
    {
      title: "G-7",// puzzle 400
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
        [[0,-1],[4, 3],[0,-1],[5,-2],[0,-1]],
        [[3,-1],[3,-1],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[3, 2],[0,-1],[5, 4],[0,-1]],
        [[0,-1],[0,-1],[2,-1],[2,-1],[2, 1]],
      ],
      stepGoals: [156, 165, 200, 275],
      best: 0
    },// 500// 550// 600// 650// 750// 700
    {
      title: "G-8",// puzzle 728
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
        [[0,-1],[2, 1],[0,-1],[4, 3],[0,-1]],
        [[5, 4],[5,-2],[0,-1],[4,-1],[0,-1]],
        [[0,-1],[5,-2],[0,-1],[4,-1],[0,-1]],
        [[0,-1],[0,-1],[3, 2],[3,-1],[3,-1]],
      ],
      stepGoals: [126, 135, 160, 200],
      best: 0
    },// 800// 950// 850// 900
    {
      title: "G-9",// puzzle 968
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
        [[0,-1],[2, 1],[0,-1],[5,-2],[0,-1]],
        [[4,-1],[4,-1],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[4, 3],[0,-1],[5, 4],[0,-1]],
        [[0,-1],[0,-1],[3,-1],[3,-1],[3, 2]],
      ],
      stepGoals: [154, 165, 200, 275],
      best: 0
    },// 1000// 1050// 1150// 1100// 1200// 1350// 1250
    {
      title: "G-10",// puzzle 1248
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
        [[0,-1],[2, 1],[0,-1],[3,-1],[0,-1]],
        [[5,-2],[5, 4],[0,-1],[3, 2],[0,-1]],
        [[0,-1],[5,-2],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[0,-1],[4, 3],[4,-1],[4,-1]],
      ],
      stepGoals: [138, 150, 170, 200],
      best: 0
    },// 1300
    {
      title: "G-11",// puzzle 1472
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
        [[0,-1],[4, 3],[0,-1],[2,-1],[0,-1]],
        [[3, 2],[3,-1],[0,-1],[2,-1],[0,-1]],
        [[0,-1],[3,-1],[0,-1],[2, 1],[0,-1]],
        [[0,-1],[0,-1],[5, 4],[5,-2],[5,-2]],
      ],
      stepGoals: [149, 160, 200, 260],
      best: 0
    },// 1550// 1400// 1450// 1500// 1750
    {
      title: "G-12",// puzzle 1744
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
        [[0,-1],[2, 1],[0,-1],[3,-1],[0,-1]],
        [[4,-1],[4, 3],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[4,-1],[0,-1],[3, 2],[0,-1]],
        [[0,-1],[0,-1],[5,-2],[5, 4],[5,-2]],
      ],
      stepGoals: [153, 165, 200, 275],
      best: 0
    },
    {
      title: "A-13",// puzzle 2312
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[2,-1],[2,-1],[2, 1]],
        [[0,-1],[4, 3],[0,-1],[5,-2],[0,-1]],
        [[3,-1],[3, 2],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[3,-1],[0,-1],[5, 4],[0,-1]],
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
      ],
      stepGoals: [183, 190, 240, 300],
      best: 0
    },
    {
      title: "A-14",// puzzle 2312
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[2, 1],[2,-1],[2,-1]],
        [[0,-1],[4, 3],[0,-1],[5,-2],[0,-1]],
        [[3,-1],[3, 2],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[3,-1],[0,-1],[5, 4],[0,-1]],
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
      ],
      stepGoals: [181, 190, 240, 300],
      best: 0
    },
    {
      title: "G-15",// puzzle 4336
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[3,-1],[3,-1],[3, 2]],
        [[0,-1],[2, 1],[0,-1],[5,-2],[0,-1]],
        [[4,-1],[4, 3],[0,-1],[5,-2],[0,-1]],
        [[0,-1],[4,-1],[0,-1],[5, 4],[0,-1]],
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
      ],
      stepGoals: [185, 195, 240, 300],
      best: 0
    },
    {
      title: "A-16",// puzzle 8016
      size: { width: 5, height: 5 },
      start: { x: 2, y: 2 },
      board: [
        [[0,-1],[0,-1],[5,-2],[5, 4],[5,-2]],
        [[0,-1],[2, 1],[0,-1],[3, 2],[0,-1]],
        [[4, 3],[4,-1],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[4,-1],[0,-1],[3,-1],[0,-1]],
        [[0,-1],[0,-1],[1,-1],[1, 0],[1,-1]],
      ],
      stepGoals: [193, 200, 240, 300],
      best: 0
    }
  ],// a
  [

  ],// b
  [

  ],// c
  [

  ],// d
  [

  ],// e
  [

  ],// f
  [

  ],// g
  [

  ],// h
  [

  ],// i
  [

  ],// j
  [

  ],// k
  [

  ],// l
  [

  ],// m
  [

  ],// n
  [

  ],// o
  [

  ],// p
  [

  ],// q
  [

  ],// r
  [

  ],// s
  [

  ],// t
  [

  ],// u
  [

  ],// v
  [

  ],// w
  [

  ],// x
  [

  ],// y
  [

  ],// z
];
for(var i=0;i<abcLevels.length;i++){
  abcLevels[i].sort((a,b)=>{return a.stepGoals[0] - b.stepGoals[0]});
  while(abcLevels[i].length>24){abcLevels[i].pop();}
}
/*[
  {
    title: "U",
    size: { width: 5, height: 5 },
    start: { x: 2, y: 4 },
    board: [
      [[0, -1],[0, -1],[0, -1],[0, -1],[0, -1]],
      [[2, -1],[2, -1],[3, 2],[3, 1],[0, -1]],
      [[0, -1],[0, -1],[0, -1],[3, 0],[0, -1]],
      [[1, -2],[1, -1],[3, -1],[3, -1],[0, -1]],
      [[0, -1],[0, -1],[0, -1],[0, -1],[0, -1]]
    ],
    stepGoals: [19, 20, 21, 23],
    best: -1
  },
  {
    title: "N",
    size: { width: 5, height: 5 },
    start: { x: 2, y: 0 },
    board: [
      [[3, -1],[3, 2],[1, -1],[1, 0],[1, -1]],
      [[0, -1],[3, -1],[0, -1],[0, -1],[0, -1]],
      [[0, -1],[0, -1],[5, -2],[0, -1],[0, -1]],
      [[0, -1],[0, -1],[0, -1],[2, -1],[0, -1]],
      [[4, 3],[4, 5],[4, 5],[2, 1],[2, -1]]
    ],
    stepGoals: [51, 55, 60, 70],
    best: 0
  },
  {
    title: "Y",
    size: { width: 5, height: 5 },
    start: { x: 2, y: 1 },
    board: [
      [[1, -1],[0, -1],[0, -1],[0, -1],[0, -1]],
      [[1, 4],[1, 2],[3, -1],[0, -1],[0, -1]],
      [[0, -1],[0, -1],[3, 0],[4, -1],[4, -2]],
      [[2, -1],[2, 3],[3, -1],[4, -1],[0, -1]],
      [[2, -1],[0, -1],[0, -1],[0, -1],[0, -1]]
    ],
    stepGoals: [40, 42, 52, 69],
    best: 0
  },
  {
    title: "G",
    size: { width: 5, height: 5 },
    start: { x: 2, y: 2 },
    board: [
      [[1, 0],[1, -1],[1, -1],[4, 3],[4, -1]],
      [[1, -1],[0, -1],[0, -1],[0, -1],[4, -1]],
      [[3, 2],[0, -1],[0, -1],[0, -1],[5, -2]],
      [[3, -1],[0, -1],[2, -1],[0, -1],[5, 4]],
      [[0, -1],[0, -1],[2, 1],[2, -1],[0, -1]]
    ],
    stepGoals: [101, 110, 120, 130],
    best: 0
  }
];
*/
function hash(str){
  var hash = 0, i, chr;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
let levels = [
  {
    title: "Objectives",
    size: { width: 5, height: 5 },
    start: { x: 1, y: 1 },
    board: [
      [[0, -1],[0, -1],[0, -1],[0, -1],[0, -1]],
      [[0, -1],[0, -1],[0, -1],[0, -1],[0, -1]],
      [[0, -1],[0, -1],[0, -1],[0, -1],[0, -1]],
      [[0, -1],[0, -1],[0, -1],[0, -2],[0, -1]],
      [[0, -1],[0, -1],[0, -1],[0, -1],[0, -1]]
    ],
    stepGoals: [4, 5, 6, 7],
    best: -1
  },
  {
    title: "First step",
    size: { width: 5, height: 5 },
    start: { x: 2, y: 1 },
    board: [
      [[0, -1],[0, -1],[0, -1],[1, -1],[1, -1]],
      [[0, -1],[0, -1],[0, -1],[1, 0],[1, -1]],
      [[0, -1],[0, -1],[0, -1],[1, -1],[1, -1]],
      [[0, -1],[0, -1],[0, -1],[1, -2],[1, -1]],
      [[0, -1],[0, -1],[0, -1],[1, -1],[1, -1]]
    ],
    stepGoals: [5, 6, 7, 8],
    best: 0
  },
  {
    title: "Stepping up",
    size: { width: 5, height: 5 },
    start: { x: 0, y: 1 },
    board: [
      [[0, -1],[0, -1],[1, -1],[0, -1],[0, -1]],
      [[0, -1],[1, -1],[1, -1],[2, 0],[0, -1]],
      [[0, -1],[0, -1],[1, -1],[2, -2],[0, -1]],
      [[0, -1],[0, -1],[1, -1],[2, -1],[0, -1]],
      [[0, -1],[0, -1],[0, -1],[0, -1],[0, -1]]
    ],
    stepGoals: [6, 8, 12, 16],
    best: 0
  },
  {
    title: "Baby steps",
    size: { width: 5, height: 5 },
    start: { x: 0, y: 1 },
    board: [
      [[0, -1],[0, -1],[1, -1],[0, -1],[0, -1]],
      [[0, -1],[1, -2],[1, -1],[2, 0],[0, -1]],
      [[0, -1],[0, -1],[1, -1],[2, -1],[0, -1]],
      [[0, -1],[0, -1],[1, 2],[2, -1],[0, -1]],
      [[0, -1],[0, -1],[0, -1],[0, -1],[0, -1]]
    ],
    stepGoals: [14, 16, 18, 21],
    best: 0
  },
  {
    title: "Walking",
    size: { width: 4, height: 4 },
    start: { x: 0, y: 3 },
    board: [
      [
        [3, -2],
        [2, -1],
        [1, -1],
        [0, -1]
      ],
      [
        [3, -1],
        [2, 1],
        [1, -1],
        [0, -1]
      ],
      [
        [3, -1],
        [2, -1],
        [1, -1],
        [0, -1]
      ],
      [
        [3, -1],
        [3, 2],
        [1, 0],
        [0, -1]
      ],
    ],
    stepGoals: [13, 15, 17, 20],
    best: 0
  },
  {
    title: "Push",
    size: { width: 4, height: 4 },
    start: { x: 0, y: 2 },
    board: [
      [
        [2, -2],
        [0, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [2, -1],
        [1, -1],
        [1, -1],
        [1, -1]
      ],
      [
        [2, 0],
        [0, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [2, -1],
        [0, -1],
        [0, -1],
        [0, -1]
      ]
    ],
    stepGoals: [7, 8, 9, 10],
    best: 0
  },
  {
    title: "Pull",
    size: { width: 4, height: 4 },
    start: { x: 0, y: 3 },
    board: [
      [
        [2, 1],
        [0, -1],
        [1, -1],
        [0, -1]
      ],
      [
        [2, -1],
        [0, -1],
        [1, 0],
        [0, -1]
      ],
      [
        [2, -2],
        [0, -1],
        [1, -1],
        [0, -1]
      ],
      [
        [1, -1],
        [1, -1],
        [1, -1],
        [1, -1]
      ]
    ],
    stepGoals: [8, 9, 10, 12],
    best: 0
  },
  {
    title: "Drag",
    size: { width: 3, height: 3 },
    start: { x: 0, y: 0 },
    board: [
      [
        [0, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [1, -1],
        [1, -1]
      ],
      [
        [0, -1],
        [2, -2],
        [2, 0]
      ],
    ],
    stepGoals: [7, 8, 9, 10],
    best: 0
  },
  {
    title: "Move around",
    size: { width: 6, height: 6 },
    start: { x: 0, y: 0 },
    board: [
      [
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1],
        [1, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [0, -1],
        [2, -1],
        [2, -2],
        [1, 0],
        [0, -1]
      ],
      [
        [0, -1],
        [0, -1],
        [2, 1],
        [2, -1],
        [1, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1],
        [1, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1]
      ],
    ],
    stepGoals: [17, 18, 20, 22],
    best: 0
  },
  {
    title: "Drag on",
    size: { width: 4, height: 4 },
    start: { x: 0, y: 0 },
    board: [
      [
        [0, -1],
        [1, -1],
        [2, -1],
        [3, -2]
      ],
      [
        [0, -1],
        [1, -1],
        [2, -1],
        [3, -1]
      ],
      [
        [0, -1],
        [1, 2],
        [0, -1],
        [3, -1]
      ],
      [
        [0, -1],
        [1, 0],
        [0, -1],
        [3, 2]
      ]
    ],
    stepGoals: [15, 16, 18, 20],
    best: -1
  },
  {
    title: "More complex",
    size: { width: 5, height: 5 },
    start: { x: 0, y: 0 },
    board: [
      [
        [0, -1],
        [3, -2],
        [3, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [3, -1],
        [3, 2],
        [0, -1],
        [0, -1]
      ],
      [
        [1, -1],
        [1, -1],
        [1, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [2, -1],
        [2, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [2, -1],
        [2, 0],
        [0, -1],
        [0, -1]
      ]
    ],
    stepGoals: [24, 25, 26, 28],
    best: -1
  },
  {
    title: "A variation",
    size: { width: 5, height: 5 },
    start: { x: 0, y: 0 },
    board: [
      [
        [0, -1],
        [2, -1],
        [2, 1],
        [0, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [0, -1],
        [2, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [3, 2],
        [3, -1],
        [3, -2],
        [0, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [0, -1],
        [1, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [1, -1],
        [1, 0],
        [0, -1],
        [0, -1]
      ]
    ],
    stepGoals: [32, 33, 34, 36],
    best: 0
  },
  {
    title: "On top",
    size: { width: 4, height: 4 },
    start: { x: 2, y: 1 },
    board: [
      [
        [1, -1],
        [1, -1],
        [1, -1],
        [1, -1]
      ],
      [
        [2, -1],
        [0, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [2, -1],
        [3, 1],
        [0, -1],
        [4, -2]
      ],
      [
        [2, -1],
        [3, 2],
        [0, -1],
        [4, 3]
      ]
    ],
    stepGoals: [15, 18, 20, 22],
    best: 0
  },
  {
    title: "Pinwheel",
    size: { width: 5, height: 5 },
    start: { x: 2, y: 2 },
    board: [
      [
        [0, -1],
        [4, -2],
        [4, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [4, -1],
        [4, 3],
        [1, -1],
        [1, -1]
      ],
      [
        [3, -1],
        [3, 2],
        [0, -1],
        [1, 0],
        [1, -1]
      ],
      [
        [3, -1],
        [3, -1],
        [2, -1],
        [2, 1],
        [0, -1]
      ],
      [
        [0, -1],
        [0, -1],
        [2, -1],
        [2, -1],
        [0, -1]
      ]
    ],
    stepGoals: [17, 19, 22, 24],
    best: 0
  },
  {
    title: "Locomotion",
    size: { width: 6, height: 6 },
    start: { x: 0, y: 2 },
    board: [
      [
        [0, -1],
        [0, -1],
        [1, -1],
        [0, -1],
        [0, -1],
        [4, -2]
      ],
      [
        [0, -1],
        [2, -1],
        [1, 2],
        [0, -1],
        [0, -1],
        [4, -1]
      ],
      [
        [0, -1],
        [2, 3],
        [0, -1],
        [0, -1],
        [0, -1],
        [4, -1]
      ],
      [
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1],
        [4, -1]
      ],
      [
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1],
        [4, -1]
      ],
      [
        [3, -1],
        [3, -1],
        [3, -1],
        [0, -1],
        [0, -1],
        [4, 3]
      ],
    ],
    stepGoals: [38, 40, 44, 48],
    best: 0
  },
  {
    title: "Box",
    size: { width: 4, height: 4 },
    start: { x: 0, y: 0 },
    board: [
      [
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [1, 0],
        [2, -1],
        [2, -1],
        [0, -1]
      ],
      [
        [3, 2],
        [3, -2],
        [2, -1],
        [0, -1]
      ],
      [
        [0, -1],
        [0, -1],
        [2, 1],
        [0, -1]
      ]
    ],
    stepGoals: [13, 15, 20, 25],
    best: 0
  },
  {
    title: "Alternatives",
    size: { width: 4, height: 4 },
    start: { x: 0, y: 0 },
    board: [
      [
        [0, -1],
        [0, -1],
        [1, 3],
        [1, 0]
      ],
      [
        [0, -1],
        [0, -1],
        [1, -1],
        [1, -1]
      ],
      [
        [2, -2],
        [2, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [2, -1],
        [2, 3],
        [0, -1],
        [0, -1]
      ]
    ],
    stepGoals: [13, 14, 16, 17],
    best: 0
  },
  {
    title: "Tight spaces",
    size: { width: 5, height: 5 },
    start: { x: 0, y: 1 },
    board: [
      [
        [1, -1],
        [0, -1],
        [0, -1],
        [4, 1],
        [0, -1]
      ],
      [
        [1, -1],
        [1, -1],
        [0, -1],
        [4, -1],
        [4, -2]
      ],
      [
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [3, 0],
        [3, -1],
        [0, -1],
        [2, -1],
        [2, -1]
      ],
      [
        [3, 2],
        [0, -1],
        [0, -1],
        [2, 1],
        [0, -1]
      ]
    ],
    stepGoals: [49, 65, 80, 98],
    best: 0
  },
  {
    title: "Claustrophobic",
    size: { width: 5, height: 5 },
    start: { x: 2, y: 2 },
    board: [
      [
        [4, -1],
        [4, -2],
        [0, -1],
        [3, 2],
        [0, -1]
      ],
      [
        [4, 3],
        [0, -1],
        [0, -1],
        [3, -1],
        [3, -1]
      ],
      [
        [0, -1],
        [1, -1],
        [0, -1],
        [0, -1],
        [0, -1]
      ],
      [
        [1, 0],
        [1, -1],
        [0, -1],
        [2, -1],
        [2, 1]
      ],
      [
        [0, -1],
        [1, -1],
        [0, -1],
        [2, -1],
        [0, -1]
      ]
    ],
    stepGoals: [52, 74, 80, 84],
    best: 0
  },,,,,,,,,,,,,,
  ...abcLevels.flat(),
];

let steps = 0,
  counter = 0;
let gameGrid = [];
let player = { x: 0, y: 0, facing: 0 };

//asset stuff
const colors = ["white", "grey", "#151515", "white", "blue"];

const tiles = [
  {
    img: groundTile,
    elevator: groundTile,
    elevatorTube: elevator0
  },
  {
    img: tile1,
    elevator: elevatorTile1,
    elevatorTube: elevator1
  },
  {
    img: tile2,
    elevator: elevatorTile2,
    elevatorTube: elevator2
  },
  {
    img: tile3,
    elevator: elevatorTile3,
    elevatorTube: elevator3
  },
  {
    img: tile4,
    elevator: elevatorTile4,
    elevatorTube: elevator4
  },
  {
    img: tile5,
    elevator: elevatorTile5,
    elevatorTube: elevator5
  },
  {
    img: tile6,
    elevator: elevatorTile6,
    elevatorTube: elevator6
  },
];

function button(x, y, w, h, callback, img, imgb) {
  if(img) {
    if(mouseX > x &&
      mouseX < x + w &&
      mouseY > y &&
      mouseY < y + h) {
      document.body.style.cursor = 'pointer';
      if(!last && mouseIsPressed) {
        callback();
        last = true;
      }
      ctx.drawImage(imgb, x >> 0, y >> 0, w >> 0, h >> 0);
    } else {
      ctx.drawImage(img, x >> 0, y >> 0, w >> 0, h >> 0);
    }
    return;
  }

  if(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    document.body.style.cursor = 'pointer';
    if(!last && mouseIsPressed) {
      callback();
      last = true;
    }
    ctx.fillRect(x >> 0, y >> 0, w >> 0, h >> 0);
  } else if(!img) {
    ctx.fillStyle = colors[2];
    ctx.fillRect(x >> 0, y >> 0, w >> 0, h >> 0);
  }
}

//animations
let moveHistory = [];
const abc = "_-___________A0BCDEFGHIJKLM1NOPQRSTUVWXY2Zabcdefghijk3lmnopqrstuvw4xyzÀÁÂÃ5ÄÅÆÇ5ÈÉÊËÌÍÎÏÐÑÒÓ6ÔÕÖØÙÚÛÜÝÞßà7áâãäåæçèéêëì8íîïðñòóôõöøù!úû$&()@[]{}";

function stateString(state) {
  let w = levels[level].size.width;
  let h = levels[level].size.height;
  let t = '' + state[1] + state[2] + state[3];
  for(let i = 0; i < w; i++) {
    for(let j = 0; j < h; j++) {
      t += abc[state[0][i][j][0] * 13 + state[0][i][j][1] + 2];
    }
  }
  return t;
}

function parseState(str) {
  let w = levels[level].size.width;
  let h = levels[level].size.height;
  let state = [
    [], str[0] * 1, str[1] * 1, str[2] * 1
  ];
  for(let i = 0; i < w; i++) {
    state[0].push([]);
    for(let j = 0; j < h; j++) {
      state[0][i].push([abc.indexOf(str[3 + i * w + j]) / 13 >> 0, abc.indexOf(str[3 + i * w + j]) % 13 - 2]);
    }
  }
  return state;
}

let animationQueue = [];

function animate(keep) {
  if(animationQueue.length <= 0) { return; }
  switch (animationQueue[0][0]) {
    case ('facing'):
      if(player.facing === animationQueue[0][1]) {
        animationQueue.shift();
        animate();
        break;
      }
      if(player.facing === 0 && animationQueue[0][1] === 3) {
        player.facing = 4;
      } else if(player.facing === 3 && animationQueue[0][1] === 0) {
        player.facing = -1;
      }
      player.facing += (animationQueue[0][1] - player.facing) * 0.2;
      if(player.facing - animationQueue[0][1] < 0) {
        player.facing += 0.2;
      } else {
        player.facing -= 0.2;
      }
      if(Math.abs(player.facing - animationQueue[0][1]) < 0.2) {
        player.facing = animationQueue[0][1];
        animationQueue.shift();
      }
      break;
    case ('playerPos'):
      if(player.x - animationQueue[0][1] < 0) {
        player.x += 0.2;
      } else if(player.x - animationQueue[0][1] > 0) {
        player.x -= 0.2;
      } else if(player.y - animationQueue[0][2] < 0) {
        player.y += 0.2;
      } else if(player.y - animationQueue[0][2] > 0) {
        player.y -= 0.2;
      }
      if(Math.abs(player.x - animationQueue[0][1]) < 0.05 && Math.abs(player.y - animationQueue[0][2]) < 0.2) {
        player.x = animationQueue[0][1];
        player.y = animationQueue[0][2];
        animationQueue.shift();
        if(!keep && gameGrid[player.x][player.y][1] === -2) {
          beatLevel();
        }
      }
      break;
    case ('moveBlock'):
      if(animationQueue[0][5] === 0) {
        for(let i = animationQueue[0][4].length - 1; i >= 0; i--) {
          gameGrid[animationQueue[0][4][i][0]][animationQueue[0][4][i][1]] = [0, -1];
        }
      }
      if(player.x - animationQueue[1][1] < 0) {
        player.x += 0.2;
      } else if(player.x - animationQueue[1][1] > 0) {
        player.x -= 0.2;
      } else if(player.y - animationQueue[1][2] < 0) {
        player.y += 0.2;
      } else if(player.y - animationQueue[1][2] > 0) {
        player.y -= 0.2;
      }

      animationQueue[0][5] += 0.2;
      if(animationQueue[0][5] >= 1) {
        for(let i = animationQueue[0][4].length - 1; i >= 0; i--) {
          gameGrid[animationQueue[0][4][i][0] + animationQueue[0][2]][animationQueue[0][4][i][1] + animationQueue[0][3]] = [animationQueue[0][1], animationQueue[0][4][i][2]];
        }
        animationQueue.shift();
        player.x = animationQueue[0][1];
        player.y = animationQueue[0][2];
        animationQueue.shift();
        if(!keep && gameGrid[player.x][player.y][1] === -2) {
          beatLevel();
        }
      };
      break;
  }
}

//game Objects
function moveBlock(block, x, y) {
  let W = levels[level].size.width;
  let H = levels[level].size.height;
  let ar = [];
  for(let i = W - 1; i >= 0; i--) {
    for(let j = H - 1; j >= 0; j--) {
      if(gameGrid[i][j][0] === block && (i + x < 0 || j + y < 0 || i + x >= W || j + y >= H || gameGrid[i + x][j + y][0] && gameGrid[i + x][j + y][0] != block)) {
        return;
      } else if(gameGrid[i][j][0] === block) {
        ar.push([i, j, gameGrid[i][j][1]]);
      }
    }
  }

  animationQueue.push(["moveBlock", block, x, y, ar, 0]);
  return true;
}

//game functions
function setupLevel(L) {
  keys[10] = false;
  moveHistory = [];
  animationQueue = [];
  steps = 0;
  gameGrid = [];
  player.x = L.start.x;
  player.y = L.start.y;
  player.facing = 0;
  for(let i = 0; i < L.size.width; i++) {
    gameGrid.push([]);
    for(let j = 0; j < L.size.height; j++) {
      gameGrid[i].push(L.board[i][j]);
    }
  }
}

function imageInSquare(img, x, y, W, H, tx, ty) {
  switch (ARType) {
    case (1):
      ctx.drawImage(img, x * min, ty + y * min, W * min, H * min);
      break;
    case (2):
      if(w > h * 0.85) {
        ctx.drawImage(img, 0.5 * (w - h * 0.85) + x * (h * 0.85), 0.15 * h + y * (h * 0.85), W * h * 0.85, H * h * 0.85);
      } else {
        ctx.drawImage(img, x * min, 0.15 * h + y * min, W * min, H * min);
      }
      break;
    case (3):
      let mn = 0,
        px = 0,
        py = 0;
      if(min > 0.6 * w) {
        mn = 0.6 * w;
        px = (w - 0.6 * w) / 2;
        py = (h - 0.6 * w);
        if((h - (0.6 * w)) * 3.2 < w * 0.2) {
          py /= 2;
        }
      } else {
        mn = min;
        px = (w - min) / 2;
      }
      ctx.drawImage(img, px + mn * x, py + mn * y, mn * W, mn * H);
      break;
  }
}

function drawPlayer(x, y, facing, W, H, tx, ty, playerImg) {
  switch (ARType) {
    case (1):
      ctx.save();
      ctx.translate(W * x * min + 0.5 * W * min, ty + H * y * min + 0.5 * H * min);
      ctx.rotate(facing * Math.PI * 0.5);
      ctx.drawImage(playerImg, -0.5 * W * min, -0.5 * H * min, W * min, H * min);
      ctx.restore();
      break;
    case (2):
      if(w > h * 0.85) {
        ctx.save();
        ctx.translate(0.5 * (w - h * 0.85) + W * x * h * 0.85 + 0.5 * W * h * 0.85,
          0.15 * h + H * y * h * 0.85 + 0.5 * H * h * 0.85);
        ctx.rotate(facing * Math.PI * 0.5);
        ctx.drawImage(playerImg, -0.5 * W * h * 0.85, -0.5 * H * h * 0.85, W * h * 0.85, H * h * 0.85);
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(W * x * min + 0.5 * W * min, 0.15 * h + H * y * min + 0.5 * H * min);
        ctx.rotate(facing * Math.PI * 0.5);
        ctx.drawImage(playerImg, -0.5 * W * min, -0.5 * H * min, W * min, H * min);
        ctx.restore();
      }
      break;
    case (3):
      let mn = 0,
        px = 0,
        py = 0;
      if(min > 0.6 * w) {
        mn = 0.6 * w;
        px = (w - 0.6 * w) / 2;
        py = (h - 0.6 * w);
        if((h - (0.6 * w)) * 3.2 < w * 0.2) {
          py /= 2;
        }
      } else {
        mn = min;
        px = (w - min) / 2;
      }
      ctx.save();
      ctx.translate(px + W * x * mn + 0.5 * mn * W, py + H * y * mn + 0.5 * mn * H);
      ctx.rotate(facing * Math.PI * 0.5);
      ctx.drawImage(playerImg, -0.5 * mn * W, -0.5 * mn * H, mn * W, mn * H);
      ctx.restore();
      break;
  }
}

function movePlayer(x, y) {
  steps++;
  let ret = false;
  let curs = gameGrid[player.x][player.y];
  let nexs = [0, 0];
  if(player.x + x >= 0 && player.x + x < levels[level].size.width &&
    player.y + y >= 0 && player.y + y < levels[level].size.height) {
    nexs = gameGrid[player.x + x][player.y + y];
    var fc = [0, 0];
    switch (player.facing) {
      case (0):
        fc = [0, 1];
        break;
      case (1):
        fc = [-1, 0];
        break;
      case (2):
        fc = [0, -1];
        break;
      case (3):
        fc = [1, 0];
        break;
    }
    let fcns = [0, 0];
    if(player.x + fc[0] >= 0 && player.y + fc[1] >= 0 && player.x + fc[0] < gameGrid.length && player.y + fc[1] < gameGrid[0].length) {
      fcns = gameGrid[player.x + fc[0]][player.y + fc[1]];
    }
    let rmp = curs[1] > 0;
    if((keys[32] || keys[16] || keys[10] || keys[13]) && (player.x + fc[0] < 0 || player.y + fc[1] < 0 || player.x + fc[0] >= levels[level].size.width || player.y + fc[1] >= levels[level].size.height)) {
      ret = true;
    } else if((keys[32] || keys[16] || keys[10] || keys[13]) && (curs[0] === nexs[0] || (fcns[0] === nexs[0] && (rmp || !curs[0] || !curs[1])) || !nexs[0] && (!curs[0] || rmp || !curs[1]))) {
      if(rmp && ((fc[0] === x && fc[1] === y && curs[0]) || nexs[0] === 0)) {
        steps--;
        return true;
      }
      ret = true;
      if(player.x + fc[0] >= 0 && player.y + fc[1] >= 0 && player.x + fc[0] < levels[level].size.width && player.y + fc[1] < levels[level].size.height) {
        if(fcns[0] > 0 && fcns[0] !== curs[0] && moveBlock(fcns[0], x, y)) {
          animationQueue.push(['playerPos', player.x + x, player.y + y]);
          return true;
        }
        if(fcns[0] !== curs[0] && fcns[0] !== 0) {
          steps--;
          return true;
        }
      }
    } else if((keys[32] || keys[16] || keys[10] || keys[13]) && nexs[0] > 0 && nexs[1] === curs[0]) {
      if(fcns[0] > 0 && (x !== fc[0] || y !== fc[1]) && fcns[0] !== curs && moveBlock(fcns[0], x, y)) {
        animationQueue.push(['playerPos', player.x + x, player.y + y]);
        return true;
      }
      if(fcns[0] !== curs[0] && fcns[0] !== 0) {
        steps--;
        return true;
      }
    } else if((keys[32] || keys[16] || keys[10] || keys[13]) && curs[0] > 0 && nexs[0] === curs[1]) {
      if(fcns[0] > 0 && fcns[0] !== nexs && moveBlock(fcns[0], x, y)) {
        if(fcns[0] === curs[0]) {
          animationQueue.pop();
        }
        animationQueue.push(['playerPos', player.x + x, player.y + y]);
        return true;
      } else if(fcns[0] !== nexs[0] && fcns[0] !== 0) {
        if(fcns[0] === curs[0]) {
          animationQueue.push(['playerPos', player.x + x, player.y + y]);
        } else { steps--; }
        return true;
      }
    }
    if(keys[32] || keys[16] || keys[10] || keys[13]) { ret = true; }
    if(player.x + x < 0 || player.x + x >= levels[level].size.width ||
      player.y + y < 0 || player.y + y >= levels[level].size.height) {
      if(ret) { steps--; return true; }
      return;
    }
    if(curs[0] === nexs[0]) {
      animationQueue.push(['playerPos', player.x + x, player.y + y]);
      return ret;
    }
    if(nexs[0] > 0 && nexs[1] === curs[0]) {
      animationQueue.push(['playerPos', player.x + x, player.y + y]);
      return ret;
    }
    if(curs[0] > 0 && nexs[0] === curs[1]) {
      animationQueue.push(['playerPos', player.x + x, player.y + y]);
      return ret;
    }
    if(curs[1] > 0 && curs[1] === nexs[1]) {
      animationQueue.push(['playerPos', player.x + x, player.y + y]);
      return ret;
    }
  }
  if(keys[32] || keys[16] || keys[10] || keys[13]) { steps--; return true; }
  if(ret) { steps--; return true; }
}

function undoMove() {
  if(animationQueue.length === 0 && moveHistory.length > 0) {
    let state = parseState(moveHistory.pop());
    gameGrid = state[0];
    player.x = state[1];
    player.y = state[2];
    player.facing = state[3];
    steps--;
  }
}

function drawBoard(L, tx, ty) {
  var W = 1 / (L.size.width),
    H = 1 / (L.size.height);
  for(let i = L.size.width - 1; i >= 0; i--) {
    for(let j = L.size.height - 1; j >= 0; j--) {
      imageInSquare(groundTile, W * i, H * j, W, H, tx, ty);
    }
  }
  let tempAnimationQueue = JSON.stringify(animationQueue);
  let tempPlayer = JSON.stringify(player);
  let tempGrid = JSON.stringify(gameGrid);
  let tempSteps = steps;
  let len = animationQueue.length;
  while(animationQueue.length > 0 && animationQueue.length === len) {
    animate(true);
  }

  let accessQ = [
    [player.x >> 0, player.y >> 0]
  ];
  let access = [(player.x >> 0) + ',' + (player.y >> 0)];
  const OS = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ];
  let w = L.size.width,
    h = L.size.height;
  let targeta = gameGrid[player.x >> 0][player.y >> 0][0];
  let targetb = gameGrid[player.x >> 0][player.y >> 0][1];
  while(accessQ.length > 0) {
    let p = accessQ.shift();

    for(let i = 0; i < 4; i++) {
      let X = p[0] + OS[i][0];
      let Y = p[1] + OS[i][1];
      if(access.indexOf(X + ',' + Y) < 0 && X >= 0 && Y >= 0 && X < w && Y < h &&
        (gameGrid[X][Y][0] === targeta || gameGrid[X][Y][1] === targeta ||
          (targetb >= 0 && (gameGrid[X][Y][0] === targetb || gameGrid[X][Y][1] === targetb)))) {
        accessQ.push([X, Y]);
        access.push(X + ',' + Y);
      }
    }
  }

  animationQueue = JSON.parse(tempAnimationQueue);
  gameGrid = JSON.parse(tempGrid);
  player = JSON.parse(tempPlayer);

  for(let i = L.size.width - 1; i >= 0; i--) {
    for(let j = L.size.height - 1; j >= 0; j--) {
      if(access.indexOf(i + ',' + j) < 0) {
        imageInSquare(outside, W * i, H * j, W, H, tx, ty);
      }
    }
  }

  if(animationQueue.length > 0 && animationQueue[0][0] === 'moveBlock') {
    for(let i = 0; i < animationQueue[0][4].length; i++) {
      let good = false;
      for(let j = 0; j < 4; j++) {
        if(((OS[j][0] !== 0 && OS[j][0] !== -animationQueue[0][2]) ||
            (OS[j][1] !== 0 && OS[j][1] !== -animationQueue[0][3])) &&
          access.indexOf((animationQueue[0][2] + animationQueue[0][4][i][0] + OS[j][0]) + ',' + (animationQueue[0][3] + animationQueue[0][4][i][1] + OS[j][1]))) {
          //console.log(' - - - ' + (animationQueue[0][2] + animationQueue[0][4][i][0] + OS[j][0]) + ',' + (animationQueue[0][3] + animationQueue[0][4][i][1] + OS[j][1]));
          //console.log(OS[j][0] + ' - ' + animationQueue[0][2]);
          //console.log(OS[j][1] + ' - ' + animationQueue[0][3]);
          good = true;
          j = 4;
        }
      }
      if(good) {
        //imageInSquare(groundTile,W*(animationQueue[0][2]+animationQueue[0][4][i][0]),H*(animationQueue[0][3]+animationQueue[0][4][i][1]),W,H,tx,ty);
      }
    }
  }

  for(let j = 0; j < L.size.height; j++) {
    let bots = [];
    for(let i = gameGrid.length - 1; i >= 0; i--) {
      bots.push([]);
    }

    for(let i = gameGrid.length - 1; i >= 0; i--) {
      let nd = -1;
      if(animationQueue.length > 0 && animationQueue[0][0] === 'moveBlock') {
        for(let k = 0; k < animationQueue[0][4].length; k++) {
          if(animationQueue[0][4][k][0] === i && animationQueue[0][4][k][1] === j) {
            if(animationQueue[0][4][k][2] >= 0) {
              imageInSquare(tiles[animationQueue[0][4][k][2]].elevatorTube, W * (i + animationQueue[0][2] * animationQueue[0][5]), H * (j + animationQueue[0][3] * animationQueue[0][5]), W, H, tx, ty);
              imageInSquare(tiles[animationQueue[0][1]].elevator, W * (i + animationQueue[0][2] * animationQueue[0][5]), H * (j + animationQueue[0][3] * animationQueue[0][5]), W, H, tx, ty);
            } else {
              imageInSquare(tiles[animationQueue[0][1]].img, W * (i + animationQueue[0][2] * animationQueue[0][5]), H * (j + animationQueue[0][3] * animationQueue[0][5]), W, H, tx, ty);
            }
            if(animationQueue[0][4][k][2] === -2) {
              imageInSquare(goal, W * (i + animationQueue[0][2] * animationQueue[0][5]), H * (j + animationQueue[0][3] * animationQueue[0][5]), W, H, tx, ty);
            }
            if(animationQueue[0][4][k][2] !== gameGrid[player.x >> 0][player.y >> 0][0] || (player.x - (i + animationQueue[0][2] * animationQueue[0][5])) + (player.y - (j + animationQueue[0][3] * animationQueue[0][5])) > 1.5) {
              imageInSquare(outside, W * (i + animationQueue[0][2] * animationQueue[0][5]), H * (j + animationQueue[0][3] * animationQueue[0][5]), W, H, tx, ty);
            }
          }
        }
      }
      if(gameGrid[i][j][0]) {
        if(gameGrid[i][j][1] >= 0) {
          imageInSquare(tiles[gameGrid[i][j][1]].elevatorTube, W * i, H * j, W, H, tx, ty);
          imageInSquare(tiles[gameGrid[i][j][0]].elevator, W * i, H * j, W, H, tx, ty);
        } else {
          imageInSquare(tiles[gameGrid[i][j][0]].img, W * i, H * j, W, H, tx, ty);
        }
        if(access.indexOf(i + ',' + j) < 0) {
          imageInSquare(outside, W * i, H * j, W, H, tx, ty);
        }
      }
      if(gameGrid[i][j][1] === -2) {
        imageInSquare(goal, W * i, H * j, W, H, tx, ty);
      }
    }
  }

  let img = playerImg;
  if((keys[32] || keys[16] || keys[10] || keys[13]) && counter % 4 < 2) {
    img = playerImgA;
  } else if(keys[32] || keys[16] || keys[10] || keys[13]) {
    img = playerImgB;
  }
  drawPlayer(player.x, player.y, player.facing, W, H, tx, ty, img);
}

//scenes
const stars = [stars1, stars2, stars3, stars4];

function s0(tx, ty) {
  ctx.drawImage(title, tx >> 0, ty >> 0, min >> 0, min >> 0);
  switch (ARType) {
    case (1):
      button(0.1 * w, 0.55 * h, 0.8 * w, 0.3 * w, () => { sb = 1 }, play, playb);
      if(window.innerHeight == screen.height) {
        button(0.84 * w, h - 0.16 * w, 0.15 * w, 0.15 * w, () => { document.exitFullscreen() }, exitFullscreen, exitFullscreenb);
      } else {
        button(0.75 * w, h - 0.25 * w, 0.2 * w, 0.2 * w, () => { document.body.requestFullscreen() }, fullscreen, fullscreenb);
      }
      break;
    case (2):
      button(0.2 * w, 0.6 * h, 0.6 * w, 0.2 * w, () => { sb = 1 }, play, playb);
      if(window.innerHeight == screen.height) {
        button(0.84 * w, h - 0.16 * w, 0.15 * w, 0.15 * w, () => { document.exitFullscreen() }, exitFullscreen, exitFullscreenb);
      } else {
        button(0.82 * w, h - 0.18 * w, 0.15 * w, 0.15 * w, () => { document.body.requestFullscreen() }, fullscreen, fullscreenb);
      }
      break;
    case (3):
      button(0.5 * (w - min) + min * 0.2, 0.6 * h, 0.6 * min, 0.2 * min, () => { sb = 1 }, play, playb);
      if(window.innerHeight == screen.height) {
        button(0.89 * w, h - 0.11 * w, 0.1 * w, 0.1 * w, () => { document.exitFullscreen() }, exitFullscreen, exitFullscreenb);
      } else {
        button(0.89 * w, h - 0.11 * w, 0.1 * w, 0.1 * w, () => { document.body.requestFullscreen() }, fullscreen, fullscreenb);
      }
      break;
  }
  ctx.fillStyle = colors[0];
  ctx.textAlign = 'left';
  ctx.font = (0.03 * min >> 0) + "px sans-serif";
  ctx.fillText("v" + version, 0.05 * w, h - 0.01 * min);
  ctx.textAlign = 'center';
  ctx.fillText("By Edward Haas @efhiii", w / 2, h - 0.01 * min);
}

let warpImages = {
  "start": homeImg,
  "A": plainImg,
    "A2": right,
  "B": duneImg,
  "art": artImg,
  "abc": abcImg,
    "abc2": right,
  "E": lock,
  "expert": hotImg,
  "a": AImg,
};

let levelSelect = {
  "start": {
    map: [
      ["art", 0, "abc", 0, "expert"],
      [6, 8, 9, -1, -1],
      [3, 4, 7, 0, "E"],
      [1, 2, 5, "B", 0],
      [-1, 0, "A", 0, 0],
    ],
    startX: 0,
    startY: 4
  },

  "A": {
    map: [
      ["start", 10, 14, 18, 22],
      [11, 12, 16, 20, 26],
      [13, 15, 19, 24, 30],
      [17, 21, 25, 28, 32],
      [23, 27, 29, 31, "A2"],
    ],
    startX: 0,
    startY: 0
  },

  /*"abc": {
    map: [
      [  0   ,   0  , "abc1",   0  ,   0  ],
      [  0   ,   0  ,   -1  ,   0  ,   0  ],
      ["abc2",  -1  ,"start",  -1  ,"abc3"],
      [  0   ,   0  ,   -1  ,   0  ,   0  ],
      [  0   ,   0  ,"abc4",    0  ,   0  ],
    ],
    startX: 0,
    startY: 0
  },
  "abc": {
    map: [
      ["abc",    1 + 32,  5 + 32,  9 + 32, 13 + 32],
      [ 2 + 32,  3 + 32,  7 + 32, 11 + 32, 17 + 32],
      [ 4 + 32,  6 + 32, 10 + 32, 15 + 32, 21 + 32],
      [ 8 + 32, 12 + 32, 16 + 32, 19 + 32, 23 + 32],
      [14 + 32, 18 + 32, 20 + 32, 22 + 32, "abc1b"],
    ],
    startX: 0,
    startY: 0
  },
  "abc1b": {
    map: [
      [0, 0,    0,0, 0],
      [0, 0,    0,0, 0],
      [0,57,  56,58, 0],
      [0,0,"abc1",0, 0],
      [0, 0,    0,0, 0],
    ],
    startX: 2,
    startY: 3
  },
  "abc2": {
    map: [
      ["abc",    1 + 58,  5 + 58,  9 + 58, 13 + 58],
      [ 2 + 58,  3 + 58,  7 + 58, 11 + 58, 17 + 58],
      [ 4 + 58,  6 + 58, 10 + 58, 15 + 58, 21 + 58],
      [ 8 + 58, 12 + 58, 16 + 58, 19 + 58, 23 + 58],
      [14 + 58, 18 + 58, 20 + 58, 22 + 58, "abc2b"],
    ],
    startX: 0,
    startY: 0
  },
  "abc2b": {
    map: [
      [0, 0,    0,0, 0],
      [0, 0,    0,0, 0],
      [0,83,  82,84, 0],
      [0,0,"abc2",0, 0],
      [0, 0,    0,0, 0],
    ],
    startX: 0,
    startY: 0
  },
  */
  "abc": {
    map: [
      ["start","a","b","c","d"],
      "efghi",
      "jklmn",
      "opqrs",
      ["t","u","v","w", "abc2"],
    ],
    startX: 0,
    startY: 0
  },
  "abc2": {
    map: [
      [0, 0,    0,0, 0],
      [0, 0,    0,0, 0],
      [0,"x","y","z", 0],
      [0,0,"abc",0, 0],
      [0, 0,    0,0, 0],
    ],
    startX: 2,
    startY: 3
  },
};
var mabcs="abcdefghijklmnopqrstuvwxyz";
for(var i=0;i<26;i++){
  var p = 32 + i * 24;
  levelSelect[mabcs[i]] = {
    map: [
      [i<23?"abc":"abc2", 1 + p,  5 + p,  9 + p, 13 + p],
      [ 2 + p,  3 + p,  7 + p, 11 + p, 17 + p],
      [ 4 + p,  6 + p, 10 + p, 15 + p, 21 + p],
      [ 8 + p, 12 + p, 16 + p, 19 + p, 23 + p],
      [14 + p, 18 + p, 20 + p, 22 + p, 24 + p],
    ],
    startX: 0,
    startY: 0
  };
  if(levels[p]){levels[p].best = -1;}
  if(levels[1 + p]){levels[1 + p].best = -1;}
}


let levelSelectPos = { menu: "start", x: 0, y: 4 };

function miniTile(img, mn, px, py, W, H, blockSize, i, j, k, l){
  ctx.drawImage(img,
    px + ((i * blockSize) + (W * k) * blockSize * 0.9 +blockSize * 0.05) * mn,
    py + ((j * blockSize) + (H * l) * blockSize * 0.9 +blockSize * 0.05) * mn,
    blockSize * W * mn * 0.9,
    blockSize * H * mn * 0.9);
}

function miniBoard(onL, mn, px, py, i, j, blockSize){
  var W = 1 / (onL.size.width),
    H = 1 / (onL.size.height);
  for(let k = onL.size.width - 1; k >= 0; k--) {
    for(let l = onL.size.height - 1; l >= 0; l--) {
      let params = [mn, px, py, W, H, blockSize, i, j, k, l];

      miniTile(groundTile, ...params);

      if(onL.board[k][l][0]) {
        if(onL.board[k][l][1] >= 0) {
          miniTile(tiles[onL.board[k][l][1]].elevatorTube, ...params);
          miniTile(tiles[onL.board[k][l][0]].elevator, ...params);
        } else {
          miniTile(tiles[onL.board[k][l][0]].img, ...params);
        }
      }
      if(onL.board[k][l][1] === -2) {
        miniTile(goal, ...params);
      }
    }
  }
}

function s1(tx, ty) {
  //animate
  let levelMap = levelSelect[levelSelectPos.menu].map;
  if(animationQueue.length > 0){
    if(animationQueue[0][2] < 8){
      levelSelectPos.x += 1/8 * animationQueue[0][0];
      levelSelectPos.y += 1/8 * animationQueue[0][1];
      if(!--animationQueue[0][2]){
        animationQueue.shift();
      }
    }
    else if(levelMap[levelSelectPos.y + animationQueue[0][1]]){
      let lvl = levelMap[levelSelectPos.y + animationQueue[0][1]][levelSelectPos.x + animationQueue[0][0]];
      if(typeof lvl == "string" || lvl < 0 || (lvl > 0 && levels[lvl-1] && levels[lvl-1].best != 0)){
        levelSelectPos.x += 1/8 * animationQueue[0][0];
        levelSelectPos.y += 1/8 * animationQueue[0][1];
        if(!--animationQueue[0][2]){
          animationQueue.shift();
        }
      }
      else{
        animationQueue.shift();
      }
    }
    else{
      animationQueue.shift();
    }
  }

  // draw
  let mn = 0, px = 0, py = 0;

  mn = min;
  px = (w - min) / 2;
  if(h > w) {
    py = (h - w) / 2;
    if(py > 0.05 * w){
      let mpy = Math.min(0.15 * w, py);
      button(0, 0, 2.5 * mpy, mpy, () => { sb = 0 }, back, backb);
      ctx.fillStyle = "white";
      ctx.font=(0.25*mpy>>0)+'px sans-serif';
      ctx.textAlign='center';
      let sum = [0,0,0,0,0];
      let total = 0;
      for(let i = 0; i < levels.length; i++){
        if(levels[i]){
          total++;
          if(levels[i].best <= 0){

          } else if(levels[i].best < levels[i].stepGoals[0]) {
            sum[4]++;
          } else if(levels[i].best <= levels[i].stepGoals[0]) {
            sum[3]++;
          } else if(levels[i].best <= levels[i].stepGoals[1]) {
            sum[2]++;
          } else if(levels[i].best <= levels[i].stepGoals[2]) {
            sum[1]++;
          } else {
            sum[0]++;
          }
        }
      }
      let stars=[stars1,stars2,stars3,stars4,stars5];
      for(let i = 0; i < (sum[4] > 0 ? 5 : 4); i++){
        ctx.drawImage(stars[i], w - ((sum[4] > 0 ? 5 : 4) - i) * mpy/2, mpy * 1 / 10, mpy * 0.5, mpy * 0.5);
        ctx.fillText(sum[i], w - ((sum[4] > 0 ? 4.5 : 3.5) - i) * mpy/2, mpy * 4 / 5);
      }

      ctx.font=(0.4*mpy>>0)+'px sans-serif';

      ctx.fillText((sum[0]+sum[1]+sum[2]+sum[3]+sum[4])+"/"+total, w - (sum[4] > 0 ? 6.5 : 5.5) * mpy/2, mpy * 3 / 5);
    }
  }
  else{
    if(px > 0.125 * w){
      let mpx = Math.min(0.375 * h, px);
      button(0, 0, mpx, mpx/2.5, () => { sb = 0 }, back, backb);

      let mpy = mpx / 2.5;

      ctx.fillStyle = "white";
      ctx.font=(0.25*mpy>>0)+'px sans-serif';
      ctx.textAlign='center';
      let sum = [0,0,0,0,0];
      let total = 0;
      for(let i = 0; i < levels.length; i++){
        if(levels[i]){
          total++;
          if(levels[i].best <= 0){

          } else if(levels[i].best < levels[i].stepGoals[0]) {
            sum[4]++;
          } else if(levels[i].best <= levels[i].stepGoals[0]) {
            sum[3]++;
          } else if(levels[i].best <= levels[i].stepGoals[1]) {
            sum[2]++;
          } else if(levels[i].best <= levels[i].stepGoals[2]) {
            sum[1]++;
          } else {
            sum[0]++;
          }
        }
      }
      let stars=[stars1,stars2,stars3,stars4,stars5];
      for(let i = 0; i < (sum[4] > 0 ? 5 : 4); i++){
        ctx.drawImage(stars[i], w - ((sum[4] > 0 ? 5 : 4.5) - i) * mpy/2, mpy * 1 / 10, mpy * 0.5, mpy * 0.5);
        ctx.fillText(sum[i], w - ((sum[4] > 0 ? 4.5 : 4) - i) * mpy/2, mpy * 4 / 5);
      }

      ctx.font=(0.5*mpy>>0)+'px sans-serif';

      ctx.fillText((sum[0]+sum[1]+sum[2]+sum[3]+sum[4])+"/"+total, w - 2.5 * mpy/2, mpy * 1.5);
    }
  }

  let cm = levelSelect[levelSelectPos.menu].map;//current map

  let blockSize = 1/cm.length;

  let lx = px, ly = py;
  let blockPX

  ctx.font = (0.15/cm.length * min >> 0) + 'px sans-serif';
  ctx.textAlign = 'center';

  for(let i = cm.length - 1; i >= 0; i--) {
    for(let j = cm.length - 1; j >= 0; j--) {
      let imgToDraw = false;

      if(cm[j][i] < 0){
        imgToDraw = groundTile;
      }
      else if(cm[j][i] == 0){

      }
      else if(cm[j][i] > 0){
        let onL = levels[cm[j][i]-1];
        imgToDraw = lock;
        if(onL && onL.best > 0 && onL.best <= onL.stepGoals[3]) {
          if(onL.best < onL.stepGoals[0]) {
            imgToDraw = stars5;
          } else if(onL.best <= onL.stepGoals[0]) {
            imgToDraw = stars4;
          } else if(onL.best <= onL.stepGoals[1]) {
            imgToDraw = stars3;
          } else if(onL.best <= onL.stepGoals[2]) {
            imgToDraw = stars2;
          } else {
            imgToDraw = stars1;
          }
        }
        else if(onL && onL.best < 0){
          imgToDraw = false;
        }

        if(onL){
          miniBoard(onL, mn, px, py, i, j, blockSize);
          if(imgToDraw){
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(
              px + ((i * blockSize) + 0.05 * blockSize) * mn,
              py + ((j * blockSize) + 0.05 * blockSize) * mn,
              blockSize * 0.9 * mn,
              blockSize * 0.9 * mn);
          }
        }
      }
      else{
        imgToDraw = warpImages[cm[j][i]];
      }

      if(imgToDraw){
        ctx.drawImage(imgToDraw,
          px + (i * blockSize) * mn,
          py + (j * blockSize) * mn,
          blockSize * mn,
          blockSize * mn);
      }
    }
  }

  ctx.drawImage(fullscreen,
    px + ((levelSelectPos.x * blockSize) + blockSize * 0.05) * mn,
    py + ((levelSelectPos.y * blockSize) + blockSize * 0.05) * mn,
    blockSize * 0.9 * mn,
    blockSize * 0.9 * mn);
}

function s2(tx, ty) {
  ctx.fillStyle = colors[0];
  switch (ARType) {
    case (1):
      ctx.font = (min / 15 >> 0) + "px sans-serif";
      ctx.textAlign = 'center';
      //ctx.fillText(steps+"/"+levels[level].stepGoals[3],0.3*w,0.1*(h-min)+min/16);
      ctx.fillText(steps + "/" + levels[level].stepGoals[3], 0.3 * w, 0.25 * (h - min) + (min / 15 >> 0) / 5);
      ctx.font = (min / 20 >> 0) + "px sans-serif";
      for(let i = 0; i < 4; i++) {
        ctx.drawImage(stars[i], (0.4 + 0.1 * i) * w, -0.06 * w + 0.25 * (h - min), 0.1 * w, 0.1 * w);
        ctx.fillText(levels[level].stepGoals[3 - i], (0.45 + 0.1 * i) * w, 0.06 * w + 0.25 * (h - min));
      }

      if(levels[level].best > 0) {
        ctx.font = (min / 24 >> 0) + "px sans-serif";
        ctx.fillText("best: " + levels[level].best, 0.3 * w, 0.25 * (h - min) + (min / 15 >> 0) * 0.8);
      }
      if(h / w > 1.4) {
        //if(mobile){
        //  button(w,h-0.5*(h-min),w,0.5*(h-min),()=>{keys[10]=!keys[10]});
        //  ctx.drawImage(grab,0.4*w,h-(h-min)*0.25-0.1*w,0.2*w,0.2*w);
        //}
        //else{
        //button(0.4 * w, h - (h - min) * 0.25 - 0.1 * w, 0.2 * w, 0.2 * w, () => { keys[10] = !keys[10] }, grab, grabb);
        button(0.8 * w, h - (h - min) * 0.25 - 0.1 * w, 0.2 * w, 0.2 * w, () => { undoMove() }, undo, undob);
        //}

        button(0.8 * w, (h - min) * 0.25 - 0.1 * w, 0.2 * w, 0.2 * w, () => { setupLevel(levels[level]) }, restart, restartb);
        button(0, (h - min) * 0.25 - 0.1 * w, 0.2 * w, 0.2 * w, () => { sb = 1 }, backMini, backMinib);
      } else {
        //if(mobile){
        //button(0,h-0.5*(h-min),w,0.5*(h-min),()=>{keys[10]=!keys[10]});
        //  ctx.drawImage(grab,0.5*w-0.25*(h-min),h-0.5*(h-min),0.5*(h-min),0.5*(h-min));
        //}
        //else{
        //button(0.5 * w - 0.25 * (h - min), h - 0.5 * (h - min), 0.5 * (h - min), 0.5 * (h - min), () => { keys[10] = !keys[10] }, grab, grabb);
        button(0.9 * w - 0.25 * (h - min), h - 0.5 * (h - min), 0.5 * (h - min), 0.5 * (h - min), () => { undoMove() }, undo, undob);
        //}

        button(w - 0.5 * (h - min), 0, 0.5 * (h - min), 0.5 * (h - min), () => { setupLevel(levels[level]) }, restart, restartb);
        button(0, 0, 0.5 * (h - min), 0.5 * (h - min), () => { sb = 1 }, backMini, backMinib);
      }
      break;
    case (2):
      ctx.font = (min / 14 >> 0) + "px sans-serif";
      ctx.textAlign = 'left';
      ctx.fillText(steps + "/" + levels[level].stepGoals[3], 0.15 * h, 0.08 * h);

      ctx.font = (0.03 * w * w / h >> 0) + "px sans-serif";
      ctx.textAlign = 'center';
      for(let i = 0; i < 4; i++) {
        ctx.drawImage(stars[i], (0.6 - (4 * 0.07 * w / h) + 0.07 * w / h * (i + 0.5)) * w, 0, 0.07 * w * w / h, 0.07 * w * w / h);
        ctx.fillText(levels[level].stepGoals[3 - i], (0.6 - (3.5 * 0.07 * w / h) + 0.07 * w / h * (i + 0.5)) * w, 0.08 * w * w / h);
      }

      if(levels[level].best > 0) {
        ctx.textAlign = 'left';
        ctx.font = (min / 30 >> 0) + "px sans-serif";
        ctx.fillText("best: " + levels[level].best, 0.15 * h, 0.08 * h + (min / 14 >> 0) * 0.5);
      }

      button(w - 0.25 * h - w / h * (w / h) * 50, 0, 0.14 * h, 0.14 * h, () => { undoMove() }, undo, undob);
      button(w - 0.13 * h - w / h * (w / h) * 20, 0, 0.14 * h, 0.14 * h, () => { setupLevel(levels[level]) }, restart, restartb);

      button(0, 0, 0.14 * h, 0.14 * h, () => { sb = 1 }, backMini, backMinib);
      break;
    case (3):
      if(w / h > 2.6) {
        ctx.font = (h / 8 >> 0) + "px sans-serif";
        ctx.textAlign = 'right';
        ctx.fillText(steps + "/" + levels[level].stepGoals[3], 0.5 * (w - h), 0.2 * h + h / 8);

        if(levels[level].best > 0) {
          ctx.font = (h / 20 >> 0) + "px sans-serif";
          ctx.fillText("best: " + levels[level].best, 0.5 * (w - h), 0.2 * h + (h / 8) * 1.5);
        }

        ctx.textAlign = 'center';
        let SZ = 0.2 * h;
        ctx.font = (SZ / 3 >> 0) + "px sans-serif";
        for(let i = 0; i < 4; i++) {
          ctx.drawImage(stars[i], SZ * i + 0.5 * w + 0.5 * h, 0, SZ, SZ);
          ctx.fillText(levels[level].stepGoals[3 - i], SZ * (i + 0.5) + 0.5 * w + 0.5 * h, SZ);
        }

        button(0.5 * w - h, 0, 0.5 * h, 0.2 * h, () => { sb = 1 }, back, backb);
        button(0.5 * w + 0.75 * h, 0.5 * h - 0.125 * h, 0.25 * h, 0.25 * h, () => { setupLevel(levels[level]) }, restart, restartb);
        button(0.5 * w + 0.5 * h, 0.5 * h - 0.125 * h, 0.25 * h, 0.25 * h, () => { undoMove() }, undo, undob);
      } else {
        ctx.font = (w / 20 >> 0) + "px sans-serif";
        ctx.textAlign = 'center';

        let SZ = Math.min(w * 0.15, (h - (0.6 * w)) * 0.8);
        if(SZ >= 0.05 * w) {
          ctx.fillText(steps + "/" + levels[level].stepGoals[3], 0.1 * w, 0.13 * w);

          ctx.font = (SZ / 3 >> 0) + "px sans-serif";
          for(let i = 0; i < 4; i++) {
            ctx.drawImage(stars[i], SZ * i + 0.2 * w, 0, SZ, SZ);
            ctx.fillText(levels[level].stepGoals[3 - i], SZ * (i + 0.5) + 0.2 * w, SZ);
          }

          if(levels[level].best > 0) {
            ctx.font = (w / 50 >> 0) + "px sans-serif";
            ctx.fillText("best: " + levels[level].best, 0.1 * w, 0.13 * w + (w / 20 >> 0) * 0.5);
          }
          //button(0.05 * w, 0.5 * h - 0.05 * w, 0.1 * w, 0.1 * w, () => { keys[10] = !keys[10] }, grab, grabb);
        } else {
          ctx.fillText(steps + "/" + levels[level].stepGoals[3], 0.1 * w, 0.2 * w);

          SZ = 0.05 * w;
          ctx.font = (SZ / 3 >> 0) + "px sans-serif";
          for(let i = 0; i < 4; i++) {
            ctx.drawImage(stars[i], SZ * i, 0.08 * w, SZ, SZ);
            ctx.fillText(levels[level].stepGoals[3 - i], SZ * (i + 0.5), SZ + 0.08 * w);
          }

          if(levels[level].best > 0) {
            ctx.font = (w / 50 >> 0) + "px sans-serif";
            ctx.fillText("best: " + levels[level].best, 0.1 * w, 0.21 * w + (w / 50 >> 0) * 0.75);
          }
          //button(0.05 * w, 0.26 * w, 0.1 * w, 0.1 * w, () => { keys[10] = !keys[10] }, grab, grabb);
        }

        button(0.85 * w, 0, 0.1 * w, 0.1 * w, () => { setupLevel(levels[level]) }, restart, restartb);
        button(0.85 * w, 0.5 * h - 0.05 * w, 0.1 * w, 0.1 * w, () => { undoMove() }, undo, undob);

        button(0, 0, 0.2 * w, 0.08 * w, () => { sb = 1 }, back, backb);
      }
      break;
  }
  animate();
  drawBoard(levels[level], tx, ty);
  if(sb != 2){animationQueue = [];}
}
let scene = 0,
  sb = 0;
const scenes = [s0, s1, s2];

//draw
let lt = 0;

function drawCanvas(t) {
  ctx.imageSmoothingQuality = "high";
  document.body.style.cursor = 'default';
  ctx.fillStyle = "#242729";
  ctx.fillRect(0, 0, w, h);
  /*
  target ARs:
  16:9
  1:1
  9:16
  */
  let tx = 0;
  let ty = 0;
  if(w > h) {
    tx = (w - min) / 2;
  } else {
    ty = (h - min) / 2;
  }

  scenes[scene](tx, ty);
  scene = sb;

  ctx.fillStyle = 'white';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'left';
  //ctx.fillText((1000/(t-lt)>>0)+" FPS",5,20);
  lt = t;

  if(t) {
    window.requestAnimationFrame(drawCanvas);
    counter++;
    if(counter > 127) { counter = 0; }
  }
}
window.requestAnimationFrame(drawCanvas);

function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function saveCookie(){
  let cookie = [];
  for(let i = 0; i < levels.length; i++){
    /*
    {
      title: "Objectives",
      size: { width: 5, height: 5 },
      start: { x: 1, y: 1 },
      board: [
        [[0, -1],[0, -1],[0, -1],[0, -1],[0, -1]],
        [[0, -1],[0, -1],[0, -1],[0, -1],[0, -1]],
        [[0, -1],[0, -1],[0, -1],[0, -1],[0, -1]],
        [[0, -1],[0, -1],[0, -1],[0, -2],[0, -1]],
        [[0, -1],[0, -1],[0, -1],[0, -1],[0, -1]]
      ],
      stepGoals: [4, 5, 6, 7],
      best: -1
    }
    */
    if(levels[i] && levels[i].best != 0){
      cookie.push([i,hash(JSON.stringify({t:levels[i].title,s:levels[i].size,x:levels[i].start,b:levels[i].board})),levels[i].best]);
    }
  }
  console.log(JSON.stringify(cookie));
  setCookie("shapush",JSON.stringify(cookie),365*200);
}

function loadCookie(){
  let cookie = getCookie("shapush");
  if(cookie){
    try{
      cookie = JSON.parse(cookie);
      for(let c = 0; c < cookie.length; c++){
        let i = cookie[c][0]
        if(levels[i] && hash(JSON.stringify({t:levels[i].title,s:levels[i].size,x:levels[i].start,b:levels[i].board})) === cookie[c][1]){
          levels[i].best = cookie[c][2];
        }
      }
    }catch(e){}
  }
}
loadCookie();

//event listeners
var beatLevel = function() {
  if(levels[level].best < 0 || levels[level].best > steps) {
    levels[level].best = steps ? steps : levels[level].stepGoals[3];
  }
  if(levels[level].stepGoals[3] - steps < 0) {
    setupLevel(levels[level]);
    return;
  }
  drawCanvas(false);
  sb = 1;

  let onL = levelSelect[levelSelectPos.menu].map;
  let dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  for(let i = 0; i < dirs.length; i++){
    if(onL[levelSelectPos.y + dirs[i][0]]){
      let cOnL = onL[levelSelectPos.y + dirs[i][0]][levelSelectPos.x + dirs[i][1]] - 1;
      if(cOnL >= 0 && levels[cOnL] && levels[cOnL].best === 0){
        levels[cOnL].best = -1;
      }
    }
  }
  saveCookie();
};

window.onresize = () => {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  w = c.width;
  h = c.height;
  getARType(w / h);
}

const keyDown = (event) => {
  keys[event.keyCode] = true;
  if(scene === 1){
    switch (event.keyCode) {
      case (37): //LEFT_ARROW
      case (65):
        animationQueue.push([-1, 0, 8]);
        break;
      case (39): //RIGHT_ARROW
      case (68):
        animationQueue.push([1, 0, 8]);
        break;
      case (38): //UP_ARROW
      case (87):
        animationQueue.push([0, -1, 8]);
        break;
      case (40): //DOWN_ARROW
      case (83):
        animationQueue.push([0, 1, 8]);
        break;
      case (32): //SPACE
      case (13): //ENTER
      case (16): //SHIFT
        if(levelSelectPos.x % 1 == 0 && levelSelectPos.y % 1 == 0){
          if(animationQueue.length === 0 && levelSelect[levelSelectPos.menu].map[levelSelectPos.y][levelSelectPos.x] > 0 && levels[levelSelect[levelSelectPos.menu].map[levelSelectPos.y][levelSelectPos.x]-1]){
            sb = 2;
            level = levelSelect[levelSelectPos.menu].map[levelSelectPos.y][levelSelectPos.x]-1;
            setupLevel(levels[level]);
          }
          else if(animationQueue.length === 0 && typeof levelSelect[levelSelectPos.menu].map[levelSelectPos.y][levelSelectPos.x] === "string"){
            let onL = levelSelect[levelSelectPos.menu].map[levelSelectPos.y][levelSelectPos.x];
            if(levelSelect[onL]){
              levelSelect[levelSelectPos.menu].startX = levelSelectPos.x;
              levelSelect[levelSelectPos.menu].startY = levelSelectPos.y;

              levelSelectPos.menu = onL;
              levelSelectPos.x = levelSelect[onL].startX;
              levelSelectPos.y = levelSelect[onL].startY;
            }
          }
        }
        break;
    }
    return;
  }
  if(scene === 2) {
    if(event.keyCode === 90) {
      undoMove();
      return;
    }
    if(event.keyCode === 82) {
      setupLevel(levels[level]);
      return;
    }
    if(event.keyCode === 32 || event.keyCode === 13 || event.keyCode === 16) {
      keys[10] = false;
      return;
    }
    if(animationQueue.length > 4) { return; }
    let tempAnimationQueue = JSON.stringify(animationQueue);
    let tempPlayer = JSON.stringify(player);
    let tempGrid = JSON.stringify(gameGrid);
    let tempSteps = steps;
    while(animationQueue.length > 0) {
      animate();
    }
    if(tempSteps > 0 && steps === 0) {
      animationQueue = JSON.parse(tempAnimationQueue).concat(animationQueue);
      gameGrid = JSON.parse(tempGrid);
      player = JSON.parse(tempPlayer);
      steps = tempSteps;
      return;
    }
    switch (event.keyCode) {
      case (37): //LEFT_ARROW
      case (65):
        if(!movePlayer(-1, 0)) {
          if(player.facing === 1 && animationQueue.length === 0) { steps--; }
          animationQueue.unshift(["facing", 1]);
        }
        break;
      case (39): //RIGHT_ARROW
      case (68):
        if(!movePlayer(1, 0)) {
          if(player.facing === 3 && animationQueue.length === 0) { steps--; }
          animationQueue.unshift(["facing", 3]);
        }
        break;
      case (38): //UP_ARROW
      case (87):
        if(!movePlayer(0, -1)) {
          if(player.facing === 2 && animationQueue.length === 0) { steps--; }
          animationQueue.unshift(["facing", 2]);
        }
        break;
      case (40): //DOWN_ARROW
      case (83):
        if(!movePlayer(0, 1)) {
          if(player.facing === 0 && animationQueue.length === 0) { steps--; }
          animationQueue.unshift(["facing", 0]);
        }
        break;
    }
    if(steps > tempSteps) {
      moveHistory.push(stateString([gameGrid, player.x, player.y, player.facing]));
    }
    animationQueue = JSON.parse(tempAnimationQueue).concat(animationQueue);
    gameGrid = JSON.parse(tempGrid);
    player = JSON.parse(tempPlayer);
  }
}

window.onkeydown = keyDown;

window.onkeyup = (event) => {
  keys[event.keyCode] = false;
}

window.onmousemove = (event) => {
  if(!mobile || mouseIsPressed) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
}

window.onmouseup = (event) => {
  if(!mobile) {
    mouseIsPressed = true;
    last = false;
    drawCanvas(false);
    mouseIsPressed = false;
    last = true;
  }
}

window.onmouseleave = (event) => {
  mouseIsPressed = false;
  last = true;
}

let ltouch = [0, 0];
window.ontouchstart = (event) => {
  mouseX = event.touches[0].clientX;
  mouseY = event.touches[0].clientY;
  ltouch = [mouseX, mouseY];
  mouseIsPressed = true;
}
window.ontouchend = (event) => {
  if(animationQueue.length > 0) { return }
  if(scene === 2 && (mouseX - ltouch[0]) * (mouseX - ltouch[0]) + (mouseY - ltouch[1]) * (mouseY - ltouch[1]) > 200) {
    moveHistory.push(stateString([gameGrid, player.x, player.y, player.facing]));
    if((mouseX - ltouch[0]) / Math.abs(mouseY - ltouch[1]) < -2) {
      if(!movePlayer(-1, 0)) {
        if(player.facing === 1 && animationQueue.length === 0) { steps--;
          moveHistory.pop(); }
        animationQueue.splice(animationQueue.length - 1, 0, ["facing", 1]);
      }
    } else if((mouseX - ltouch[0]) / Math.abs(mouseY - ltouch[1]) > 2) {
      if(!movePlayer(1, 0)) {
        if(player.facing === 3 && animationQueue.length === 0) { steps--;
          moveHistory.pop(); }
        animationQueue.splice(animationQueue.length - 1, 0, ["facing", 3]);
      }
    } else if((mouseY - ltouch[1]) / Math.abs(mouseX - ltouch[0]) < -2) {
      if(!movePlayer(0, -1)) {
        if(player.facing === 2 && animationQueue.length === 0) { steps--;
          moveHistory.pop(); }
        animationQueue.splice(animationQueue.length - 1, 0, ["facing", 2]);
      }
    } else if((mouseY - ltouch[1]) / Math.abs(mouseX - ltouch[0]) > 2) {
      if(!movePlayer(0, 1)) {
        if(player.facing === 0 && animationQueue.length === 0) { steps--;
          moveHistory.pop(); }
        animationQueue.splice(animationQueue.length - 1, 0, ["facing", 0]);
      }
    }
  }

  mouseIsPressed = true;
  last = false;
  drawCanvas(false);
  mouseIsPressed = false;
  last = true;
  mouseX = -1;
  mouseY = -1;
}
/*
window.ontouchcancel = (event)=>{
  mouseX=-1;
  mouseY=-1;
  mouseIsPressed=false;
}*/

window.ontouchmove = (event) => {
  if(mouseIsPressed) {
    mouseX = event.touches[0].clientX;
    mouseY = event.touches[0].clientY;
  }
};

document.addEventListener('contextmenu', event => event.preventDefault());
