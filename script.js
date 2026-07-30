// ======================================
// Premium Stopwatch - Part 1
// ======================================

// Elements
const display = document.getElementById("display");

const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");

const lapList = document.getElementById("lapList");

const lapCounter = document.getElementById("lapCounter");
const fastestLap = document.getElementById("fastestLap");
const slowestLap = document.getElementById("slowestLap");

// Stopwatch Variables
let startTime = 0;
let elapsed = 0;
let running = false;
let animationFrame = null;

// Lap Variables
let lapCount = 1;
let lastLapElapsed = 0;
let lapTimes = [];

// Initial Button State
pauseBtn.disabled = true;
lapBtn.disabled = true;

// ======================================
// Format Time
// ======================================

function formatTime(ms){

    const milliseconds = ms % 1000;

    const seconds = Math.floor(ms / 1000) % 60;

    const minutes = Math.floor(ms / (1000 * 60)) % 60;

    const hours = Math.floor(ms / (1000 * 60 * 60));

    return (
        String(hours).padStart(2,"0") +
        " : " +
        String(minutes).padStart(2,"0") +
        " : " +
        String(seconds).padStart(2,"0") +
        " . " +
        String(milliseconds).padStart(3,"0")
    );

}

// ======================================
// Animation Loop
// ======================================

function animate(){

    if(!running) return;

    elapsed = Date.now() - startTime;

    display.textContent = formatTime(elapsed);

    animationFrame = requestAnimationFrame(animate);

}

// ======================================
// Start
// ======================================

function startStopwatch(){

    if(running) return;

    running = true;

    startTime = Date.now() - elapsed;

    animationFrame = requestAnimationFrame(animate);

    startBtn.disabled = true;

    pauseBtn.disabled = false;

    lapBtn.disabled = false;

}

// ======================================
// Pause
// ======================================

function pauseStopwatch(){

    if(!running) return;

    running = false;

    cancelAnimationFrame(animationFrame);

    startBtn.disabled = false;

    pauseBtn.disabled = true;

}

// ======================================
// Reset
// ======================================

function resetStopwatch(){

    running = false;

    cancelAnimationFrame(animationFrame);

    elapsed = 0;

    lapCount = 1;

    lastLapElapsed = 0;

    lapTimes = [];

    display.textContent = "00 : 00 : 00 . 000";

    lapList.innerHTML = "";

    lapCounter.textContent = "0";

    fastestLap.textContent = "--";

    slowestLap.textContent = "--";

    startBtn.disabled = false;

    pauseBtn.disabled = true;

    lapBtn.disabled = true;

}
// ======================================
// Add Lap
// ======================================

function addLap(){

    if(!running) return;

    // Calculate lap duration
    const lapDuration = elapsed - lastLapElapsed;

    lastLapElapsed = elapsed;

    // Store lap information
    lapTimes.push({

        number: lapCount,

        duration: lapDuration,

        total: elapsed

    });

    // Find fastest & slowest lap durations
    const durations = lapTimes.map(lap => lap.duration);

    const fastest = Math.min(...durations);

    const slowest = Math.max(...durations);

    // Update statistics
    const fastestObj = lapTimes.find(lap => lap.duration === fastest);

    const slowestObj = lapTimes.find(lap => lap.duration === slowest);

    fastestLap.textContent =
        `Lap ${fastestObj.number} • ${formatTime(fastestObj.duration)}`;

    slowestLap.textContent =
        `Lap ${slowestObj.number} • ${formatTime(slowestObj.duration)}`;

    // Rebuild lap list
    lapList.innerHTML = "";

    [...lapTimes].reverse().forEach(lap => {

        const li = document.createElement("li");

        let badge = "";

        if(lap.duration === fastest){

            badge =
            `<span class="lap-badge fastest">
                Fastest
            </span>`;

        }

        if(lap.duration === slowest && fastest !== slowest){

            badge =
            `<span class="lap-badge slowest">
                Slowest
            </span>`;

        }

        li.innerHTML = `

            <div>

                <strong>Lap ${lap.number}</strong>

                ${badge}

            </div>

            <div>

                <div>${formatTime(lap.duration)}</div>

                <small>Total ${formatTime(lap.total)}</small>

            </div>

        `;

        lapList.appendChild(li);

    });

    lapCount++;

    // Update lap counter
    lapCounter.textContent = lapTimes.length;

}

// ======================================
// Button Events
// ======================================

startBtn.addEventListener("click", startStopwatch);

pauseBtn.addEventListener("click", pauseStopwatch);

resetBtn.addEventListener("click", resetStopwatch);

lapBtn.addEventListener("click", addLap);

// ======================================
// Keyboard Shortcuts
// ======================================

document.addEventListener("keydown", function(e){

    if(e.code === "Space"){

        e.preventDefault();

        if(running){

            pauseStopwatch();

        }else{

            startStopwatch();

        }

    }

    if(e.key.toLowerCase() === "l"){

        addLap();

    }

    if(e.key.toLowerCase() === "r"){

        resetStopwatch();

    }

});