// colors
let blueFont = '#25325D';
let white = '#ffffff';

// size vars
let outerRadius = 430;

// helpers
const degToRad = (deg) => {
  return (Math.PI * deg) / 180;
}
// --random number
const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// --shuffle the array
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
// --alert the prize
const alertPrize = (el) => {
  let winningSegment = theWheel.getIndicatedSegment();

  // Basic alert of the segment text which is the prize name.
  alert("You have won " + winningSegment.text + "!");
}

// -- clear the canvas 
const clearCanvas = (ctx, canvas) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// elements
const $button = $('#spinButton');


// canvas adornment
let canvas2 = document.getElementById('wheel__adornment');
let ctx2 = canvas2.getContext('2d');

// canvas adornment
let canvas3 = document.getElementById('wheel__adornment2');
let ctx3 = canvas3.getContext('2d');

// canvas styling
let canvas = document.getElementById('wheel__canvas');
let ctx = canvas.getContext('2d');




// *** Setting up the gradients ***
let canvasCenter = canvas.height / 2;
let canvasCenterByWith = canvas.width / 2;

// * Red gradient
// x0,y0,r0,x1,y1,r1
let redGradient = ctx.createRadialGradient(canvasCenter, canvasCenter, 50, canvasCenter, canvasCenter, canvas.height / 2 );
redGradient.addColorStop(0, "#FE0C0C");
redGradient.addColorStop(1, "#CB2C2C");

// * Yellow gradient
// x0,y0,r0,x1,y1,r1
let yellowGradient = ctx.createRadialGradient(canvasCenter, canvasCenter, 50, canvasCenter, canvasCenter, canvas.height / 2 );
yellowGradient.addColorStop(0, "#FFA800");
yellowGradient.addColorStop(1, "#FEC049");

// * White gradient
// x0,y0,r0,x1,y1,r1
let whiteGradient = ctx.createRadialGradient(canvasCenter, canvasCenter, 50, canvasCenter, canvasCenter, canvas.height / 2 );
whiteGradient.addColorStop(0, "#F6F6F6");
whiteGradient.addColorStop(1, "#FCFCFC");

// drawing triangle 
const drawTriangle = () => {
  ctx.strokeStyle = '#000000';
  ctx.fillStyle   = 'aqua';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.moveTo(30, canvasCenter - 140);
  ctx.lineTo(canvasCenterByWith, canvasCenter);
  ctx.lineTo(0, canvasCenter + 140);
  ctx.lineTo(30, canvasCenter - 140);
  ctx.stroke();
  ctx.fill();
}

// draw adornments
const drawAdornments = () => {
  console.log(degreesPerSegment);
  
  ctx2.beginPath();
  ctx2.arc(canvasCenterByWith, canvasCenter, outerRadius - 10, 0, 360)
  ctx2.strokeStyle = '#25325D';
  ctx2.lineWidth = 30;
  ctx2.fillStyle = 'transparent';
  ctx2.stroke();
  ctx2.fill();

  ctx3.beginPath();
  ctx3.moveTo(20, canvasCenter - 40);
  ctx3.lineTo(20, canvasCenter + 40);
  ctx3.lineTo(100, canvasCenter);
  ctx3.lineTo(20, canvasCenter - 40);
  ctx3.closePath();
  ctx3.strokeStyle = '#ffffff';
  ctx3.lineWidth = 5;
  ctx3.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx3.shadowColor = "#FFA800";
  ctx3.shadowBlur = 3;
  ctx3.stroke();
  ctx3.fill();
  // ctx2.arc(canvasCenterByWith, canvasCenter, 430 - 10, Math.PI - degToRad(degreesPerSegment) / 2, Math.PI + degToRad(degreesPerSegment) / 2)
  
  

  // ctx.fill();
}


// getting settings
let settingsChilds = $('.options').children().toArray();

const makeSettingsArr = (arr) => {
  // put data into array of objects
  let mapped = arr.map(el => ({
    order: parseInt($(el).attr('data-pos')),
    rate: parseInt($(el).attr('data-rate')),
    fill: $(el).attr('data-fill'),
    text: $(el).html().replace('<br>', `\n`)
  }));

  // generate settings for plugin
  let settings = mapped.map((el) => {
    
    let fill, textColor;
    switch (el.fill) {
      case "red":
        fill = redGradient;
        textColor = white;
        break;
      case "yellow":
        fill = yellowGradient;
        textColor = blueFont;
        break;
      case "white":
        fill = whiteGradient;
        textColor = blueFont;
        break;
      default:
        break;
    }

    // let text = 

    return {
      'fillStyle': fill,
      'text': el.text,
      'textFillStyle': textColor,
      'textFontFamily' : 'gilroy',
      'textFontSize' : 20,
    }
  })


  return {mapped, settings};
}

let {mapped, settings} = makeSettingsArr(settingsChilds);
let degreesPerSegment = Math.floor(360 / mapped.length);
console.log('settingsArr: ', settings)

// get the winner before spin
function calculatePrize() {
  let rand = randomInteger(1, 100);
  // rand = 100
  console.log('rand: ', rand);
  // generating array according to % of win
  let probArr = [];
  mapped.forEach(el => {
    for (let i = 1; i <= el.rate; i++) {
      probArr.push(el.order);
    }
  });
  let shuffled = shuffle(probArr);
  let wonDegrees = shuffled[rand - 1] * degreesPerSegment - degreesPerSegment / 2;
  console.log(shuffled[rand - 1], wonDegrees);
  return {winnerNumber: shuffled[rand], winnedDegrees: wonDegrees};
}

// main wheel call
let theWheel = new Winwheel({
  'canvasId'        : 'wheel__canvas',
  'numSegments'     : settings.length,
  'outerRadius'     : outerRadius,
  'innerRadius'     : 60,
  // 'fillStyle'    : '#e7706f',
  'strokeStyle'     : 'transparent',
  'pointerAngle'    : 270,
  'textOrientation' : 'horizontal',
  'textDirection'   : 'reversed', 
  'lineWidth'       : 0,
  'segments'        : settings,
  'animation'       :
    {
      'type'             : 'spinToStop',
      'duration'         : 5,
      'spins'            : 8,
      'callbackFinished' : 'alertPrize()',
      'callbackAfter'    : 'drawAdornments()'
    }
})

drawAdornments();


// button click event
$button.click(() => {
  const {winnedDegrees} = calculatePrize();
  theWheel.animation.stopAngle = winnedDegrees;
  $button.attr('disabled','disabled');
  theWheel.startAnimation();
})


// media queries for wheel

// const mediaMatch = (media1) => {
//   if(media1.matches) {
//     outerRadius = 200;
//     theWheel.draw();
//   }

// }

// // --breakpoints
// let bp1620 = window.matchMedia("(max-width: 1620px)")

// mediaMatch(bp1620);
// bp1620.addListener(mediaMatch);


// const resizeCanvas = (width) => {
//   // Get the canvas
// 	let wheelCanvas = document.getElementById('wheel__canvas');

//   // Get width of window.
// 	// var w = window.innerWidth;
//   if (width <= 1400) {
//     outerRadius = 300
//     theWheel.outerRadius = 300;
//     // wheelCanvas.width = 400;
//   } else if (width > 1400) {
//     outerRadius = 430
//     theWheel.outerRadius = 430;
//   }

  

  

//   // theWheel.centerX = (canvas.width / 2);
// 	// theWheel.centerY = (canvas.height / 2);

//   // Re-draw the wheel.
//   clearCanvas(ctx2, canvas2);
//   drawAdornments();
// 	theWheel.draw();
// }

// const ro = new ResizeObserver(entries => {
//   for (let entry of entries) {
//     const width = entry.contentRect.width

//     // console.log(width);
//     // console.log(entry.target.className === 'wheelScreen');

//     if (entry.target.className === 'wheelScreen') resizeCanvas(width)
//   }
// })

// // console.log(typeof document.getElementsByClassName('wheelScreen'));

// let wheelScreen = document.querySelector('.wheelScreen')

// ro.observe(wheelScreen);

