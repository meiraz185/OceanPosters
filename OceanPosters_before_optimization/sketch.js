/* =========================================================
   OCEAN PLASTIC POSTERS — Mobile Interactive Experience
   ========================================================= */

let fontRegular;
let fontBold;

let posters = [];
let activePoster = -1; // -1 = home screen

let posterW = 650;
let posterH = 975;

let activeScale = 1;
let activeX;
let activeY;

let galleryCards = [];

// "Learn more" chip button geometry (inside poster space)
let btnX = 30;
let btnY = 895;
let btnW = 150;
let btnH = 42;

// App state: 'home' | 'poster'
let appState = 'home';

// swipe / slide transition between posters
let slideOffset = 0;       // current horizontal slide offset (px, in poster space)
let slideTarget = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartOffset = 0;
let dragDeltaForTap = 0;
let swipeLocked = false;

// presentation / mockup mode
let presentationMode = false;
let fakeFingerT = 0;

// particles + confetti
let particles = [];
let confetti = [];

// share feedback
let shareMsg = '';
let shareMsgTimer = 0;

function preload() {
  fontRegular = loadFont("ArchivoBlack-Regular.ttf");
  fontBold = loadFont("Bungee-Regular.ttf");

  posters = [
    {
      name: "Seal",
      bg: loadImage("seal.png"),
      plastic: loadImage("Gemini_Generated_Image_za4p9jza4p9jzגגa4p (1).png"),
      bgX: -100,
      bgY: -300,
      dark: 70,
      title1: "PLASTIC ",
      title2: "SUFFOCATES",
      title1Size: 135,
      title2Size: 94,
      title1Y: 865,
      title2Y: 960,
      title1Offset: -99,
      title2Offset: -105,
      sideText: [
        "Every piece ",
        "Of plastic ",
        "You discard",
        "Stays forever.",
        "It tightens.",
        "It strangles.",
      ],
      thinkY: 655,
      popupText:
        "Seals, sea lions and other animals can't tell plastic from jellyfish.\nThey swallow it. They choke on it. They die from it.\n\n" +
        "They struggle for hours. For days.\nUntil they can't anymore.\n\n" +
        "Your trash. Their extinction.",
      itemType: "plastic",
    },

    {
      name: "Whale",
      bg: loadImage("whale.png"),
      plastic: loadImage("Gemini_Generated_Image_2rijc92rijc92rij.png"),
      bgX: -330,
      bgY: -90,
      dark: 70,
      title1: "PLASTIC ",
      title2: "STARVES",
      title1Size: 135,
      title2Size: 131,
      title1Y: 841,
      title2Y: 960,
      title1Offset: -99,
      title2Offset: -105,
      sideText: [
        "Every piece ",
        "Of plastic ",
        "You discard",
        "Stays forever.",
        "It is swallowed.",
        "It starves.",
      ],
      thinkY: 631,
      popupText:
        "Whales swallow hundreds of plastic pieces a day.\nTheir stomachs fill up but they get no nutrition.\nThey feel full. They stop eating. They starve.\n\n" +
        "Seabirds feed plastic to their chicks.\nSea turtles, fish, whales, all dying hungry.\nWith stomachs full of your trash.\n\n" +
        "Your trash. Their extinction.",
      itemType: "plastic",
    },

    {
      name: "Sea Turtle",
      bg: loadImage("9B31B070-C374-4143-858F-F08E009188A7 (1).PNG"),
      plastic: loadImage("bag.png"),
      bgX: -100,
      bgY: -300,
      dark: 70,
      title1: "PLASTIC ",
      title2: "ENTANGLES",
      title1Size: 135,
      title2Size: 101,
      title1Y: 860,
      title2Y: 960,
      title1Offset: -99,
      title2Offset: -105,
      sideText: [
        "Every piece ",
        "Of plastic ",
        "You discard",
        "Stays forever.",
        "It traps.",
        "It hurts.",
      ],
      thinkY: 649,
      popupText:
        "Sea turtles and other marine animals are injured by plastic every day.\n\n" +
        "Nets, rings and other sharp objects trap and kill them.\nSlowly. Tightly. Without mercy.\n\n" +
        "Your trash. Their extinction.",
      itemType: "bag",
    },

    {
      name: "Fish",
      bg: loadImage("nemo.png"),
      plastic: loadImage("plate1.png"),
      bgX: -140,
      bgY: -370,
      dark: 45,
      title1: "PLASTIC ",
      title2: "DESTROYS",
      title1Size: 135,
      title2Size: 113,
      title1Y: 841,
      title2Y: 960,
      title1Offset: -92,
      title2Offset: -105,
      sideText: [
        "Every piece ",
        "Of plastic ",
        "You discard",
        "Stays forever.",
        "It invades.",
        "It buries.",
      ],
      thinkY: 639,
      popupText:
        "Plastic smothers coral reefs.\nIt blocks sunlight. It kills algae.\nWithout algae there is no reef. Without reef there are no fish.\n\n" +
        "Fish don't just lose their home.\nThey lose their shelter, their food, their future.\n\n" +
        "Your trash. Their extinction.",
      itemType: "straw",
    },

    {
      name: "Dolphin",
      bg: loadImage("783D18C3-2A77-40C3-B7A0-8D0218BA5D65.PNG"),
      plastic: loadImage("straw.png"),
      bgX: -330,
      bgY: -400,
      dark: 45,
      title1: "PLASTIC ",
      title2: "POISONS",
      title1Size: 135,
      title2Size: 131,
      title1Y: 850,
      title2Y: 960,
      title1Offset: -110,
      title2Offset: -105,
      sideText: [
        "Every piece ",
        "Of plastic ",
        "You discard",
        "Stays forever.",
        "It contaminates.",
        "It lingers.",
      ],
      thinkY: 629,
      popupText:
        "Plastic doesn't disappear.\nIt breaks into microplastics and poisons everything it touches.\n\n" +
        "Dolphins absorb toxins through every fish they eat.\n" +
        "Their immune systems collapse.\n" +
        "Their calves are born poisoned.\n\n" +
        "Your trash. Their extinction.",
      itemType: "straw",
    },
  ];
}

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.elt.style.touchAction = 'none';
  pixelDensity(min(2, window.devicePixelRatio || 1));
  frameRate(30);

  computeActiveTransform();

  setupGalleryCards();

  for (let i = 0; i < posters.length; i++) {
    resetPoster(i);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computeActiveTransform();
}

function computeActiveTransform() {
  // Fit the poster (650x975) inside the current window, mobile-first.
  let s = min(width / posterW, height / posterH) * 0.98;
  activeScale = s;
  activeX = (width - posterW * s) / 2;
  activeY = (height - posterH * s) / 2;
}

function setupGalleryCards() {
  // Cards used purely for the "stacked deck" visual on the home screen.
  galleryCards = [];
  for (let i = 0; i < posters.length; i++) {
    galleryCards.push({ posterIndex: i });
  }
}

/* =========================================================
   FLOATING PLASTIC (unchanged core logic)
   ========================================================= */

class FloatingPlastic {
  constructor(poster, sizeType) {
    this.poster = poster;
    this.angle = random(-0.9, 0.9);

    if (poster.name === "Seal") {
      if (sizeType === "large") this.w = random(360, 520);
      else if (sizeType === "medium") this.w = random(250, 380);
      else this.w = random(165, 260);
      this.h = this.w * (poster.plastic.height / poster.plastic.width);
      this.opacity = random(185, 255);
      this.whiteLayerOpacity = random(65, 130);
    } else if (poster.name === "Whale") {
      if (sizeType === "large") this.w = random(340, 500);
      else if (sizeType === "medium") this.w = random(240, 360);
      else this.w = random(160, 250);
      this.h = this.w * (poster.plastic.height / poster.plastic.width);
      this.opacity = random(185, 255);
      this.whiteLayerOpacity = random(65, 125);
    } else if (poster.itemType === "bag") {
      if (sizeType === "large") this.w = random(185, 270);
      else if (sizeType === "medium") this.w = random(125, 190);
      else this.w = random(85, 135);
      this.h = this.w * 1.28;
      this.opacity = random(85, 155);
      this.whiteLayerOpacity = random(28, 60);
    } else if (poster.itemType === "straw") {
      if (sizeType === "large") this.w = random(280, 390);
      else if (sizeType === "medium") this.w = random(190, 280);
      else this.w = random(120, 190);
      this.h = this.w * (poster.plastic.height / poster.plastic.width);
      this.opacity = random(200, 255);
      this.whiteLayerOpacity = random(55, 115);
    } else {
      if (sizeType === "large") this.w = random(190, 285);
      else if (sizeType === "medium") this.w = random(130, 200);
      else this.w = random(85, 140);
      this.h = this.w * (poster.plastic.height / poster.plastic.width);
      this.opacity = random(165, 245);
      this.whiteLayerOpacity = random(40, 90);
    }

    this.fitInsidePoster();

    this.vx = random(-0.35, 0.35);
    this.vy = random(-0.25, 0.25);

    if (abs(this.vx) < 0.06) this.vx = this.vx < 0 ? -0.06 : 0.06;
    if (abs(this.vy) < 0.04) this.vy = this.vy < 0 ? -0.04 : 0.04;

    this.rotationSpeed = random(-0.004, 0.004);
    this.floatOffset = random(TWO_PI);
    this.floatSpeed = random(0.01, 0.025);
    this.floatAmount = random(0.15, 0.65);
  }

  fitInsidePoster() {
    let boxW = abs(this.w * cos(this.angle)) + abs(this.h * sin(this.angle));
    let boxH = abs(this.w * sin(this.angle)) + abs(this.h * cos(this.angle));
    this.x = random(boxW / 2 + 5, posterW - boxW / 2 - 5);
    this.y = random(boxH / 2 + 5, posterH - boxH / 2 - 5);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.x += sin(frameCount * this.floatSpeed + this.floatOffset) * this.floatAmount;
    this.y += cos(frameCount * this.floatSpeed + this.floatOffset) * this.floatAmount;

    this.angle += this.rotationSpeed;

    let boxW = abs(this.w * cos(this.angle)) + abs(this.h * sin(this.angle));
    let boxH = abs(this.w * sin(this.angle)) + abs(this.h * cos(this.angle));

    if (this.x < boxW / 2 || this.x > posterW - boxW / 2) {
      this.vx *= -1;
      this.x = constrain(this.x, boxW / 2, posterW - boxW / 2);
    }
    if (this.y < boxH / 2 || this.y > posterH - boxH / 2) {
      this.vy *= -1;
      this.y = constrain(this.y, boxH / 2, posterH - boxH / 2);
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    blendMode(SCREEN);
    tint(255, this.opacity);
    image(this.poster.plastic, -this.w / 2, -this.h / 2, this.w, this.h);

    blendMode(LIGHTEST);
    tint(255, 255, 255, this.whiteLayerOpacity);
    image(this.poster.plastic, -this.w / 2, -this.h / 2, this.w, this.h);

    blendMode(BLEND);
    noTint();
    pop();
  }

  isClicked(mx, my) {
    let dx = mx - this.x;
    let dy = my - this.y;
    let ca = cos(-this.angle);
    let sa = sin(-this.angle);
    let lx = dx * ca - dy * sa;
    let ly = dx * sa + dy * ca;
    return abs(lx) < this.w * 0.62 && abs(ly) < this.h * 1.0;
  }
}

/* =========================================================
   FEEDBACK: small collect particles + end-game confetti
   ========================================================= */

class CollectParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 255;
    this.vy = -0.9;
    this.vx = random(-0.3, 0.3);
    this.scale = random(0.9, 1.3);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 6;
  }
  draw() {
    push();
    noStroke();
    fill(255, 255, 255, this.life);
    textFont(fontBold);
    textSize(20 * this.scale);
    textAlign(CENTER, CENTER);
    text("+1", this.x, this.y);
    pop();
  }
  isDead() {
    return this.life <= 0;
  }
}

class SparklePiece {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    let a = random(TWO_PI);
    let sp = random(1.2, 3.2);
    this.vx = cos(a) * sp;
    this.vy = sin(a) * sp;
    this.life = 255;
    this.size = random(2, 5);
    this.col = random([
      [255, 255, 255],
      [120, 220, 255],
      [180, 255, 230],
    ]);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.04;
    this.life -= 8;
  }
  draw() {
    push();
    noStroke();
    fill(this.col[0], this.col[1], this.col[2], this.life);
    ellipse(this.x, this.y, this.size);
    pop();
  }
  isDead() {
    return this.life <= 0;
  }
}

function spawnCollectFeedback(x, y) {
  particles.push(new CollectParticle(x, y));
  for (let i = 0; i < 8; i++) particles.push(new SparklePiece(x, y));
}

class ConfettiPiece {
  constructor() {
    this.x = random(0, posterW);
    this.y = random(-200, -20);
    this.vy = random(2, 5);
    this.vx = random(-1, 1);
    this.size = random(6, 12);
    this.rot = random(TWO_PI);
    this.rotSpeed = random(-0.1, 0.1);
    this.col = random([
      [255, 195, 0],
      [0, 200, 255],
      [255, 90, 130],
      [120, 255, 170],
      [255, 255, 255],
    ]);
  }
  update() {
    this.y += this.vy;
    this.x += this.vx;
    this.rot += this.rotSpeed;
  }
  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.rot);
    noStroke();
    fill(this.col[0], this.col[1], this.col[2]);
    rectMode(CENTER);
    rect(0, 0, this.size, this.size * 0.5);
    pop();
  }
}

function spawnConfettiBurst() {
  confetti = [];
  for (let i = 0; i < 120; i++) confetti.push(new ConfettiPiece());
}

/* =========================================================
   POSTER RESET
   ========================================================= */

function resetPoster(index) {
  let p = posters[index];

  p.items = [];
  p.collectedCount = 0;
  p.timeLeft = 30;
  p.lastSecondTime = millis();
  p.showPopup = false;
  p.showEndPopup = false;
  p.confettiFired = false;

  if (p.name === "Seal" || p.name === "Whale") {
    for (let i = 0; i < 36; i++) p.items.push(new FloatingPlastic(p, "large"));
    for (let i = 0; i < 48; i++) p.items.push(new FloatingPlastic(p, "medium"));
    for (let i = 0; i < 56; i++) p.items.push(new FloatingPlastic(p, "small"));
  } else if (p.itemType === "bag") {
    for (let i = 0; i < 24; i++) p.items.push(new FloatingPlastic(p, "large"));
    for (let i = 0; i < 32; i++) p.items.push(new FloatingPlastic(p, "medium"));
    for (let i = 0; i < 40; i++) p.items.push(new FloatingPlastic(p, "small"));
  } else if (p.itemType === "straw") {
    for (let i = 0; i < 26; i++) p.items.push(new FloatingPlastic(p, "large"));
    for (let i = 0; i < 36; i++) p.items.push(new FloatingPlastic(p, "medium"));
    for (let i = 0; i < 44; i++) p.items.push(new FloatingPlastic(p, "small"));
  } else {
    for (let i = 0; i < 24; i++) p.items.push(new FloatingPlastic(p, "large"));
    for (let i = 0; i < 34; i++) p.items.push(new FloatingPlastic(p, "medium"));
    for (let i = 0; i < 42; i++) p.items.push(new FloatingPlastic(p, "small"));
  }
}

/* =========================================================
   MAIN DRAW
   ========================================================= */

function draw() {
  background(8, 18, 26);

  if (appState === 'home') {
    drawHomeScreen();
  } else {
    drawActivePoster();
  }

  if (presentationMode) {
    drawPresentationFrame();
  }

  drawShareToast();
}

/* =========================================================
   HOME SCREEN — headline + blurred stacked deck
   ========================================================= */

function drawHomeScreen() {
  push();

  // soft background gradient
  noStroke();
  for (let i = 0; i < height; i += 4) {
    let t = i / height;
    let c = lerpColor(color(6, 22, 34), color(10, 40, 56), t);
    fill(c);
    rect(0, i, width, 4);
  }

  // headline
  textAlign(CENTER, TOP);
  textFont(fontBold);
  let headSize = constrain(width * 0.09, 24, 40);
  textSize(headSize);
  fill(255);
  text("EVERY PIECE\nYOU COLLECT\nSAVES A LIFE", width / 2, height * 0.07);

  textFont(fontRegular);
  textSize(constrain(width * 0.035, 12, 16));
  fill(255, 200);
  text("Tap the deck to start collecting plastic\nand turn it into real ocean donations", width / 2, height * 0.07 + headSize * 3.4);

  pop();

  drawDeck();

  // hint
  push();
  textAlign(CENTER, CENTER);
  fill(255, 180);
  textFont(fontRegular);
  textSize(13);
  let pulse = 150 + 80 * sin(frameCount * 0.06);
  fill(255, pulse);
  text("▲ Tap to open ▲", width / 2, height * 0.93);
  pop();

  cursor(HAND);
}

function getDeckGeometry() {
  let cardW = min(width * 0.62, 280);
  let cardH = cardW * 1.5;
  let cx = width / 2;
  let cy = height * 0.55;
  return { cardW, cardH, cx, cy };
}

function drawDeck() {
  let { cardW, cardH, cx, cy } = getDeckGeometry();

  // draw back-to-front so card 0 ends on top
  for (let i = posters.length - 1; i >= 0; i--) {
    let p = posters[i];
    let depth = i; // 0 = top/front
    let offX = depth * 6;
    let offY = depth * 8;
    let rotAmt = (depth - 2) * 0.025;

    push();
    translate(cx + offX - (posters.length - 1) * 3, cy + offY - (posters.length - 1) * 4);
    rotate(rotAmt);

    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.roundRect ?
      drawingContext.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 18) :
      drawingContext.rect(-cardW / 2, -cardH / 2, cardW, cardH);
    drawingContext.clip();

    // blurred poster thumbnail
    drawingContext.filter = 'blur(7px) brightness(0.55) saturate(1.1)';
    let s = cardW / posterW;
    push();
    translate(-cardW / 2, -cardH / 2);
    scale(s);
    drawPosterBase(p);
    pop();
    drawingContext.filter = 'none';

    // dark glass tint
    fill(8, 20, 30, depth === 0 ? 70 : 130);
    noStroke();
    rect(-cardW / 2, -cardH / 2, cardW, cardH);

    drawingContext.restore();

    // border / glass edge
    noFill();
    stroke(255, depth === 0 ? 200 : 90);
    strokeWeight(depth === 0 ? 2 : 1);
    rect(-cardW / 2, -cardH / 2, cardW, cardH, 18);

    if (depth === 0) {
      // front card label
      fill(255);
      noStroke();
      textAlign(CENTER, CENTER);
      textFont(fontBold);
      textSize(16);
      text("5 POSTERS", 0, cardH / 2 - 28);
      textFont(fontRegular);
      textSize(11);
      fill(255, 200);
      text("Tap to begin", 0, cardH / 2 - 10);
    }

    pop();
  }
}

function isTapOnDeck(mx, my) {
  let { cardW, cardH, cx, cy } = getDeckGeometry();
  return mx > cx - cardW / 2 - 10 && mx < cx + cardW / 2 + 10 &&
         my > cy - cardH / 2 - 10 && my < cy + cardH / 2 + 10;
}

/* =========================================================
   ACTIVE POSTER VIEW (with swipe navigation)
   ========================================================= */

function drawActivePoster() {
  // smooth slide animation toward target
  slideOffset = lerp(slideOffset, slideTarget, isDragging ? 1 : 0.18);

  fill(0, 0, 0, 230);
  noStroke();
  rect(0, 0, width, height);

  // draw neighboring posters slightly visible during swipe for context
  drawSinglePoster(activePoster, slideOffset);

  let neighborGap = posterW * activeScale * 1.06;
  if (slideOffset > 2 && activePoster > 0) {
    drawSinglePoster(activePoster - 1, slideOffset - neighborGap / activeScale);
  }
  if (slideOffset < -2 && activePoster < posters.length - 1) {
    drawSinglePoster(activePoster + 1, slideOffset + neighborGap / activeScale);
  }

  drawDotsIndicator();
  cursor(HAND);
}

function drawSinglePoster(index, offsetXInPosterSpace) {
  if (index < 0 || index >= posters.length) return;
  let p = posters[index];

  push();
  translate(activeX + offsetXInPosterSpace * activeScale, activeY);
  scale(activeScale);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(0, 0, posterW, posterH);
  drawingContext.clip();

  drawPosterBase(p);

  if (!p.showPopup && !p.showEndPopup && index === activePoster) {
    updateTimer(p);
  }

  for (let i = 0; i < p.items.length; i++) {
    if (!p.showEndPopup) p.items[i].update();
    p.items[i].draw();
  }

  drawPosterText(p);
  drawUnifiedCounterAndTimer(p);
  drawLearnMoreButton();

  // collect particles (only render on the active poster slot)
  if (index === activePoster) {
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].isDead()) particles.splice(i, 1);
    }
  }

  if (p.showPopup) drawPopup(p);

  if (p.showEndPopup) {
    if (p.collectedCount > 0 && !p.confettiFired) {
      spawnConfettiBurst();
      p.confettiFired = true;
    }
    if (p.collectedCount > 0) {
      for (let i = confetti.length - 1; i >= 0; i--) {
        confetti[i].update();
        confetti[i].draw();
        if (confetti[i].y > posterH + 40) confetti.splice(i, 1);
      }
    }
    drawEndPopup(p);
  }

  drawPosterCloseX();

  drawingContext.restore();

  noFill();
  stroke(255, 190);
  strokeWeight(2);
  rect(0, 0, posterW, posterH);

  pop();
}

function drawDotsIndicator() {
  let n = posters.length;
  let spacing = 22;
  let totalW = (n - 1) * spacing;
  let startX = width / 2 - totalW / 2;
  let y = activeY + posterH * activeScale + 26;
  if (y > height - 16) y = height - 16;

  for (let i = 0; i < n; i++) {
    let x = startX + i * spacing;
    push();
    noStroke();
    if (i === activePoster) {
      fill(255);
      ellipse(x, y, 11, 11);
    } else {
      fill(255, 110);
      ellipse(x, y, 7, 7);
    }
    pop();
  }
}

/* =========================================================
   POSTER BASE / TEXT (layout updated: text left, HUD right)
   ========================================================= */

function drawPosterBase(p) {
  push();
  fill(50);
  noStroke();
  rect(0, 0, posterW, posterH);

  imageMode(CORNER);
  image(p.bg, p.bgX, p.bgY);

  fill(0, 0, 0, p.dark);
  noStroke();
  rect(0, 0, posterW, posterH);
  pop();
}

function drawPosterText(p) {
  push();
  translate(11, p.title1Y);
  textFont(fontBold);
  textSize(p.title1Size);
  fill(255);
  text(p.title1, 0, p.title1Offset);
  pop();

  push();
  translate(11, p.title2Y);
  textFont(fontBold);
  textSize(p.title2Size);
  fill(255);
  text(p.title2, 0, p.title2Offset);
  pop();

  push();
  textFont(fontRegular);
  textSize(24);
  fill(255);
  text("USE LESS.", 20, 760);
  text("THROW BETTER.", 20, 787);
  text("ACT NOW.", 20, 814);
  pop();

  // sideText now LEFT, in the upper-left quiet area
  push();
  textFont(fontRegular);
  textSize(18);
  fill(255);
  for (let i = 0; i < p.sideText.length; i++) {
    text(p.sideText[i], 24, 50 + i * 22);
  }
  pop();

  push();
  textFont(fontRegular);
  textSize(20);
  fill(255);
  text("THINK BEFORE YOU THROW", 20, 712);
  pop();
}

/* =========================================================
   COUNTER + TIMER — now on the RIGHT, redesigned
   ========================================================= */

function drawUnifiedCounterAndTimer(p) {
  push();

  let hudW = 175;
  let hudH = 76;
  let hudX = posterW - hudW - 18;
  let hudY = 18;

  // glass card
  fill(10, 60, 90, 215);
  stroke(255, 255, 255, 170);
  strokeWeight(1.5);
  rect(hudX, hudY, hudW, hudH, 16);

  fill(255, 255, 255, 18);
  noStroke();
  rect(hudX, hudY, hudW, hudH / 2, 16, 16, 0, 0);

  // label
  textFont(fontRegular);
  textAlign(LEFT, TOP);
  fill(255, 200);
  textSize(11);
  text("PLASTIC COLLECTED", hudX + 14, hudY + 8);

  // big count with a little icon dot
  fill(255);
  textFont(fontBold);
  textAlign(LEFT, CENTER);
  textSize(30);
  text(p.collectedCount, hudX + 14, hudY + 38);

  // small unit chip
  let numW = textWidth(String(p.collectedCount));
  textFont(fontRegular);
  textSize(13);
  fill(190, 230, 255);
  text("pcs", hudX + 22 + numW, hudY + 40);

  // divider
  stroke(255, 90);
  strokeWeight(1);
  line(hudX + 14, hudY + 54, hudX + hudW - 14, hudY + 54);

  // timer row
  noStroke();
  fill(255, 210);
  textFont(fontRegular);
  textAlign(LEFT, CENTER);
  textSize(13);
  text("⏱ " + p.timeLeft + "s left", hudX + 14, hudY + 65);

  pop();
}

function updateTimer(p) {
  if (millis() - p.lastSecondTime >= 1000) {
    p.timeLeft--;
    p.lastSecondTime = millis();

    if (p.timeLeft <= 0) {
      p.timeLeft = 0;
      p.showEndPopup = true;
    }
  }
}

/* =========================================================
   LEARN MORE — redesigned as a real chip/button
   ========================================================= */

function drawLearnMoreButton() {
  push();

  let hovering = false; // hover concept not critical on touch devices

  fill(255, 255, 255, hovering ? 235 : 210);
  stroke(255);
  strokeWeight(1.2);
  rect(btnX, btnY, btnW, btnH, 22);

  noStroke();
  fill(10, 40, 60);
  textFont(fontBold);
  textAlign(CENTER, CENTER);
  textSize(14);
  text("ℹ  Learn more", btnX + btnW / 2, btnY + btnH / 2 + 1);

  pop();
}

function isMouseOverButton(mx, my) {
  return mx >= btnX && mx <= btnX + btnW && my >= btnY && my <= btnY + btnH;
}

function drawPosterCloseX() {
  push();
  fill(255);
  noStroke();
  textFont(fontRegular);
  textSize(28);
  textAlign(CENTER, CENTER);
  text("X", posterW - 37, 39);
  pop();
}

function isMouseOverPosterCloseX(mx, my) {
  return mx >= posterW - 58 && mx <= posterW - 16 && my >= 17 && my <= 58;
}

/* =========================================================
   LEARN-MORE POPUP (unchanged visuals, same logic)
   ========================================================= */

function drawPopup(p) {
  push();

  fill(0, 0, 0, 120);
  noStroke();
  rect(0, 0, posterW, posterH);

  let popX = 50;
  let popY = 200;
  let popW = 550;
  let popH = 500;

  fill(10, 60, 90, 210);
  stroke(255, 255, 255, 180);
  strokeWeight(2);
  rect(popX, popY, popW, popH, 15);

  fill(255, 255, 255, 15);
  noStroke();
  rect(popX, popY, popW, popH / 2, 15, 15, 0, 0);

  fill(255);
  noStroke();
  textFont(fontRegular);
  textSize(24);
  textAlign(LEFT, BASELINE);
  text("X", popX + popW - 30, popY + 35);

  textFont(fontBold);
  textSize(22);
  textAlign(LEFT, TOP);
  text("THE OCEAN IS NOT A TRASH CAN.", popX + 30, popY + 60, popW - 60);

  stroke(255);
  strokeWeight(1.5);
  line(popX + 30, popY + 105, popX + popW - 30, popY + 105);
  noStroke();

  textFont(fontRegular);
  textSize(16);
  fill(255);
  textAlign(LEFT, TOP);
  textWrap(WORD);
  text(p.popupText, popX + 30, popY + 150, popW - 60);

  pop();
}

/* =========================================================
   END POPUP — persuasive empty state + share buttons
   ========================================================= */

function drawEndPopup(p) {
  push();

  fill(0, 0, 0, 170);
  noStroke();
  rect(0, 0, posterW, posterH);

  let popX = 45;
  let popY = 230;
  let popW = 560;
  let popH = 500;

  fill(10, 60, 90, 235);
  stroke(255, 255, 255, 200);
  strokeWeight(2);
  rect(popX, popY, popW, popH, 18);

  fill(255, 255, 255, 18);
  noStroke();
  rect(popX, popY, popW, popH / 2, 18, 18, 0, 0);

  fill(255);
  textFont(fontRegular);
  textSize(28);
  textAlign(CENTER, CENTER);
  text("X", popX + popW - 35, popY + 35);

  textAlign(CENTER, TOP);

  if (p.collectedCount > 0) {
    textFont(fontBold);
    textSize(32);
    fill(255);
    text("Mission accomplished!", popX + popW / 2, popY + 80, popW - 60);

    textFont(fontRegular);
    textSize(19);
    textWrap(WORD);
    text(
      "The " + p.collectedCount + " plastic units you collected equal $" +
        p.collectedCount + " donated to protecting marine life and cleaning our oceans.",
      popX + 55, popY + 155, popW - 110
    );
  } else {
    textFont(fontBold);
    textSize(28);
    textLeading(36);
    fill(255);
    text("The ocean needed you.", popX + 40, popY + 75, popW - 80, 90);

    textFont(fontRegular);
    textSize(19);
    textLeading(28);
    textWrap(WORD);
    text(
      "Right now, real animals are choking, starving and dying from plastic just like what you saw here. " +
      "You collected nothing this time — but it's not too late to make a difference.",
      popX + 55, popY + 150, popW - 110
    );
  }

  // Try again button
  let btnAW = 220, btnAH = 50;
  let btnAX = popX + popW / 2 - btnAW / 2;
  let btnAY = popY + popH - 170;

  fill(255);
  noStroke();
  rect(btnAX, btnAY, btnAW, btnAH, 25);
  fill(10, 60, 90);
  textFont(fontBold);
  textSize(17);
  textAlign(CENTER, CENTER);
  text(p.collectedCount > 0 ? "🔁 Play again" : "🔁 Try again", btnAX + btnAW / 2, btnAY + btnAH / 2 + 1);

  p._tryAgainBox = { x: btnAX, y: btnAY, w: btnAW, h: btnAH };

  // Share with friends button
  let btnSW = 220, btnSH = 50;
  let btnSX = popX + popW / 2 - btnSW / 2;
  let btnSY = btnAY + btnAH + 16;

  fill(40, 170, 220);
  noStroke();
  rect(btnSX, btnSY, btnSW, btnSH, 25);
  fill(255);
  textFont(fontBold);
  textSize(17);
  textAlign(CENTER, CENTER);
  text("📤 Share with friends", btnSX + btnSW / 2, btnSY + btnSH / 2 + 1);

  p._shareBox = { x: btnSX, y: btnSY, w: btnSW, h: btnSH };

  pop();
}

function isMouseOverEndCloseBox(mx, my) {
  // matches the X drawn in drawEndPopup (popX+popW-35, popY+35) for popX=45,popY=230,popW=560
  return mx >= 560 && mx <= 605 && my >= 280 && my <= 325;
}

function isMouseOverCloseBox(mx, my) {
  return mx >= 550 && mx <= 590 && my >= 210 && my <= 250;
}

/* =========================================================
   SHARE FEATURE
   ========================================================= */

function buildShareText(p) {
  return "I collected " + p.collectedCount + " pieces of plastic and donated $" +
    p.collectedCount + " to ocean conservation. Can you beat me?";
}

function doShare(p) {
  let text = buildShareText(p);

  if (navigator.share) {
    navigator.share({ title: "Ocean Plastic Challenge", text: text }).catch(() => {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showShareToast("Copied!");
    }).catch(() => {
      showShareToast(text);
    });
  } else {
    showShareToast(text);
  }
}

function showShareToast(msg) {
  shareMsg = msg;
  shareMsgTimer = 150;
}

function drawShareToast() {
  if (shareMsgTimer <= 0) return;
  shareMsgTimer--;

  push();
  let alpha = min(255, shareMsgTimer * 6);
  let toastW = min(width * 0.85, 360);
  let toastX = width / 2 - toastW / 2;
  let toastY = height - 90;

  fill(20, 20, 20, alpha * 0.9);
  noStroke();
  rect(toastX, toastY, toastW, 50, 14);

  fill(255, alpha);
  textFont(fontRegular);
  textSize(13);
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  text(shareMsg, toastX + toastW / 2, toastY + 25, toastW - 24);
  pop();
}

/* =========================================================
   COLLECTING PLASTIC
   ========================================================= */

function collectPlasticAt(p, mx, my) {
  if (p.showEndPopup) return;

  for (let i = p.items.length - 1; i >= 0; i--) {
    if (p.items[i].isClicked(mx, my)) {
      let item = p.items[i];
      p.items.splice(i, 1);
      p.collectedCount++;
      spawnCollectFeedback(item.x, item.y);
      return;
    }
  }
}

/* =========================================================
   PRESENTATION / MOCKUP MODE
   ========================================================= */

function drawPresentationFrame() {
  push();
  noFill();
  stroke(0);
  strokeWeight(18);
  rect(9, 9, width - 18, height - 18, 46);

  stroke(60);
  strokeWeight(3);
  rect(20, 20, width - 40, height - 40, 36);

  // notch
  noStroke();
  fill(0);
  rectMode(CENTER);
  rect(width / 2, 30, 90, 18, 10);
  rectMode(CORNER);

  // simulated finger / tap pulse to suggest interaction (purely decorative)
  fakeFingerT += 0.02;
  let fx = width / 2 + sin(fakeFingerT) * width * 0.18;
  let fy = height * 0.7 + cos(fakeFingerT * 1.3) * height * 0.06;
  noStroke();
  fill(255, 200, 120, 90);
  ellipse(fx, fy, 46, 46);
  fill(255, 200, 120, 160);
  ellipse(fx, fy, 18, 18);

  pop();
}

/* =========================================================
   INPUT HANDLING (mouse + touch, with swipe)
   ========================================================= */

function mousePressed() {
  dragDeltaForTap = 0;

  if (appState === 'home') {
    if (isTapOnDeck(mouseX, mouseY)) {
      activePoster = 0;
      appState = 'poster';
      slideOffset = 0;
      slideTarget = 0;
    }
    return;
  }

  // poster view — remember the start point, but do NOT move anything yet
  dragStartX = mouseX;
  dragStartY = mouseY;
  dragStartOffset = slideOffset;
  isDragging = false;      // becomes true only once real swipe intent is detected
  swipeLocked = false;     // once we decide it's a tap, never let it become a swipe
}

function mouseDragged() {
  if (appState !== 'poster') return;
  if (swipeLocked) return;

  let dx = mouseX - dragStartX;
  let dy = mouseY - dragStartY;

  // Only start treating this as a swipe once movement is clearly horizontal
  // and big enough — small finger jitter while tapping must NOT move the poster.
  if (!isDragging) {
    if (abs(dx) > 14 && abs(dx) > abs(dy) * 1.4) {
      isDragging = true;
    } else if (abs(dy) > 14) {
      // vertical movement -> this is not a swipe, lock it as a tap gesture
      swipeLocked = true;
      return;
    } else {
      return; // not enough movement yet to decide
    }
  }

  dragDeltaForTap = dx;
  slideOffset = dragStartOffset + dx / activeScale;
}

function mouseReleased() {
  if (appState !== 'poster') return;

  if (isDragging) {
    isDragging = false;

    let threshold = 60;
    if (dragDeltaForTap > threshold && activePoster > 0) {
      activePoster--;
      slideOffset = -(posterW * 1.06);
      slideTarget = 0;
    } else if (dragDeltaForTap < -threshold && activePoster < posters.length - 1) {
      activePoster++;
      slideOffset = (posterW * 1.06);
      slideTarget = 0;
    } else {
      slideTarget = 0;
    }
  } else {
    // never became a swipe -> treat as a tap, regardless of tiny jitter
    handlePosterTap(mouseX, mouseY);
  }

  dragDeltaForTap = 0;
  swipeLocked = false;
}

function handlePosterTap(screenX, screenY) {
  let p = posters[activePoster];

  let mx = (screenX - activeX) / activeScale - slideOffset;
  let my = (screenY - activeY) / activeScale;

  if (mx < 0 || mx > posterW || my < 0 || my > posterH) return;

  if (isMouseOverPosterCloseX(mx, my)) {
    appState = 'home';
    return;
  }

  if (p.showEndPopup) {
    if (p._tryAgainBox && pointInBox(mx, my, p._tryAgainBox)) {
      resetPoster(activePoster);
      return;
    }
    if (p._shareBox && pointInBox(mx, my, p._shareBox)) {
      doShare(p);
      return;
    }
    if (isMouseOverEndCloseBox(mx, my)) {
      resetPoster(activePoster);
    }
    return;
  }

  if (p.showPopup) {
    if (isMouseOverCloseBox(mx, my) || mx < 50 || mx > 600 || my < 200 || my > 700) {
      p.showPopup = false;
      p.lastSecondTime = millis();
    }
    return;
  }

  if (isMouseOverButton(mx, my)) {
    p.showPopup = true;
    return;
  }

  collectPlasticAt(p, mx, my);
}

function pointInBox(x, y, box) {
  return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h;
}

function touchStarted() {
  mousePressed();
  return false;
}

function touchMoved() {
  mouseDragged();
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}

function keyPressed() {
  if (key === 'm' || key === 'M') {
    presentationMode = !presentationMode;
  }
  if (key === 'ArrowLeft' && appState === 'poster' && activePoster > 0) {
    activePoster--;
  }
  if (key === 'ArrowRight' && appState === 'poster' && activePoster < posters.length - 1) {
    activePoster++;
  }
  if (key === 'Escape') {
    appState = 'home';
  }
}