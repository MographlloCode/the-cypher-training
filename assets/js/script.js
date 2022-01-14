const screens = document.querySelectorAll(".master-container");
const timeList = document.querySelector("#time-list");
const crosshairList = document.querySelector("#crosshair-list");

const startButton = document.querySelector("#start-button");
const gridShot = document.querySelector("#grid-shot");

const chooseTime = document.querySelectorAll(".choose-time");
const chooseCrosshair = document.querySelectorAll(".choose-crosshair");

const timerBoard = document.querySelector("#timer-board");
const pointBoard = document.querySelector("#point-board");
const gameArea = document.querySelector("#game-area");

const thirtySec = document.getElementById("thirty-seconds");
const fortyFiveSec = document.getElementById("forty-five-seconds");
const sixtySec = document.getElementById("sixty-seconds");

const openCrosshair = document.querySelector("#open-crosshair");
const dotCrosshair = document.querySelector("#dot-crosshair");
const dottedCrosshair = document.querySelector("#dotted-crosshair");

let preGameCounter = 4;
let timer = 3;
let score = 0;
let targetsHitten = 0;
let missedHits = 0;
let storeTimer = 0;
let crosshair;
let clickHistory = [];
let clickHistoryMs = [];
let lastCalc;
let CalcMs;
let ReducedCalcMs;

const preGameText = document.querySelector("#pre-game");

const showTimer = document.querySelector("#timer");
const showPoints = document.querySelector("#points");
const showTargets = document.querySelector("#targets");
const showAccuracy = document.querySelector("#accuracy");
const showAverageSpeed = document.querySelector("#average-speed");
const showMissedTargets = document.querySelector("#missed-targets");
const playAgain = document.querySelector("#play-again");

const chooseGamePage = document.querySelector("#choose-game");
const selectTimePage = document.querySelector("#select-time");
const selectCrosshairPage = document.querySelector("#select-crosshair");
const gridShotPage = document.querySelector("#hide-grid");
const stats = document.querySelector("#statistics");

window.onload = hideOnLoad();

// Roll and Hide Pages
startButton.addEventListener("click", (event) => {
  event.preventDefault();
  chooseGamePage.style.display = "flex";
  screens[0].classList.add("up");
});

gridShot.addEventListener("click", (event) => {
  event.preventDefault();
  selectTimePage.style.display = "flex";
  screens[1].classList.add("up");
});

timeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("choose-time")) {
    timer = parseInt(event.target.getAttribute(`data-time`));
    selectCrosshairPage.style.display = "flex";
    screens[2].classList.add("up");
  }
});

crosshairList.addEventListener("click", (event) => {
  if (event.target.classList.contains("choose-crosshair")) {
    crosshair = event.target.getAttribute(`crosshair-type`);

    console.log(crosshair);

    if (crosshair === "open") {
      gridShotPage.style.cursor = "url('assets/imgs/open-ch.svg'), auto";
    } else if (crosshair === "dot") {
      gridShotPage.style.cursor = "url('assets/imgs/dot-ch.svg'), auto";
    } else if (crosshair === "dotted") {
      gridShotPage.style.cursor = "url('assets/imgs/dotted-ch.svg'), auto";
    }

    gridShotPage.style.display = "flex";
    screens[3].classList.add("up");

    preGame();
  }
});

gameArea.addEventListener("click", (event) => {
  if (event.target.classList.contains("circle")) {
    score = score + 100;
    ++targetsHitten;
    scoreIncrease();
    event.target.remove();
    createRandomCircle();

    let lastClick = new Date().getMilliseconds();
    clickHistory.push(lastClick);

    const somaClicks = clickHistory.reduce(add, 0);
    lastCalc = somaClicks - lastClick;

    function add(accumulator, a) {
      return accumulator + a;
    }

    clickHistoryMs.push(lastCalc);
    CalcMs = lastCalc / clickHistoryMs.length;

    ReducedCalcMs = CalcMs.toFixed(0);

    console.log(CalcMs);
  } else if (!event.target.classList.contains("circle")) {
    ++missedHits;
  }
  showStats();
});

playAgain.addEventListener("click", (event) => {
  event.preventDefault();
  gridShotPage.style.display = "flex";
  window.location.reload();
});

// Functions
function preGame() {
  setInterval(decreasePreGameTime, 1000);
  storeTimer = JSON.parse(JSON.stringify(timer));

  function decreasePreGameTime() {
    let currentPreGame = --preGameCounter;
    preGameText.innerHTML = `${currentPreGame}`;
    if (preGameCounter === 0) {
      startGame();
      if (preGameCounter === null) {
      } else {
        let preGameElement = document.getElementById("pre-game");
        preGameElement.parentNode.removeChild(preGameElement);
      }
    }
  }
}

function startGame() {
  setInterval(decreaseTime, 1000);
  createRandomCircle();
  createRandomCircle();
  createRandomCircle();
  setTime(timer);
}

function setTime(value) {
  timerBoard.innerHTML = `00:${value}`;
  if (value < 10) {
    timerBoard.innerHTML = `00:0${value}`;
  } else if (value > 59) {
    timerBoard.innerHTML = `01:00`;
  }
}

function decreaseTime() {
  if (timer === 0) {
    finishGame();
  } else {
    let current = --timer;

    setTime(current);
  }
}

function createRandomCircle() {
  function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function setColor(element) {
    element.style.background = "rgba(255, 240, 0, 1)";
  }

  const circle = document.createElement("div");
  const size = getRandomNumber(80, 80);
  const { width, height } = gameArea.getBoundingClientRect();
  const x = getRandomNumber(0, width - size);
  const y = getRandomNumber(0, height - size);
  const color = setColor(circle);

  circle.classList.add("circle");
  circle.setAttribute("id", "bola");
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.top = `${y}px`;
  circle.style.left = `${x}px`;
  circle.style.background = `${color}`;

  gameArea.append(circle);
}

function scoreIncrease() {
  pointBoard.innerHTML = `00${score}`;

  if (score > 900) {
    pointBoard.innerHTML = `0${score}`;
  } else if (score > 9900) {
    pointBoard.innerHTML = `${score}`;
  }
}

function finishGame() {
  if (timer === 0) {
    removeBall();
    removeBall();
    removeBall();
    stats.style.display = "flex";
    screens[4].classList.add("up");
  }
}

function removeBall() {
  let elem = document.getElementById("bola");
  if (elem === null) {
  } else {
    elem.parentNode.removeChild(elem);
  }
}

function showStats() {
  showTimer.innerHTML = `00:${storeTimer}`;
  if (storeTimer > 59) {
    showTimer.innerHTML = `01:00`;
  }
  showTargets.innerHTML = `0${targetsHitten}`;
  if (targetsHitten > 9) {
    showTargets.innerHTML = `${targetsHitten}`;
  }
  showAverageSpeed.innerHTML = `${ReducedCalcMs}ms`;
  showMissedTargets.innerHTML = `0${missedHits}`;
  if (missedHits > 9) {
    showMissedTargets.innerHTML = `${missedHits}`;
  }
  calculateAccuracy();
  showPoints.innerHTML = `${score}`;
}

function calculateAccuracy() {
  let calcAccuracy = ((targetsHitten - missedHits) / targetsHitten) * 100;
  let roundedAccuracy = calcAccuracy.toFixed(2);
  showAccuracy.innerHTML = `${roundedAccuracy}%`;
}

function hideOnLoad() {
  chooseGamePage.style.display = "none";
  selectTimePage.style.display = "none";
  selectCrosshairPage.style.display = "none";
  gridShotPage.style.display = "none";
  stats.style.display = "none";
}
