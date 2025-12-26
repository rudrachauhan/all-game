/* LEVEL SYSTEM */
const totalLevels = 10;
let unlockedLevel = Number(localStorage.getItem("unlockedLevel")) || 1;
let currentLevel = 1;
let activeIntervals = [];

// નવું ફંક્શન: જે બધા ટાઈમરને ટ્રેક કરશે
function setGameInterval(fn, time) {
    const id = setInterval(fn, time);
    activeIntervals.push(id);
    return id;
}

// બધા ટાઈમર બંધ કરવા માટેનું ફંક્શન
function clearAllIntervals() {
    activeIntervals.forEach(clearInterval);
    activeIntervals = [];
}

// જૂના ઓબ્જેક્ટ્સ સાફ કરવા
function clearGameObjects() {
    const selectors = ".tile, .falling-object, .avoid-obstacle, .boss-fire, .bullet, .enemy";
    document.querySelectorAll(selectors).forEach(el => el.remove());
}

function backToMenu() {
    clearAllIntervals(); 
    clearGameObjects();
    document.onkeydown = null;

    // ૧. ગેમ એરિયા છુપાવો
    document.getElementById("game-play-area").classList.add("hidden");

    // ૨. મેનુના બધા ભાગો પાછા બતાવો (Reset બટન સાથે)
    document.getElementById("level-grid").classList.remove("hidden");
    document.getElementById("main-title").classList.remove("hidden");
    document.getElementById("reset-btn").classList.remove("hidden"); // આ લાઈન બટન પાછું લાવશે
    
    // ૩. બધી સબ-ગેમ્સને સંપૂર્ણપણે સંતાડી દો
    const games = ["music-game", "catch-game", "avoid-game", "boss-game", "gun-game", "maze-game", "reaction-game", "coming-soon"];
    games.forEach(g => {
        const el = document.getElementById(g);
        if(el) {
            el.classList.add("hidden");
            el.style.display = "none"; 
        }
    });
    
    initGame();
}
function resetGame(){
    if(confirm("શું તમે ગેમ રીસેટ કરવા માંગો છો? બધી પ્રગતિ જતી રહેશે.")){
        localStorage.removeItem("unlockedLevel") ;
        unlockedLevel = 1;
        backToMenu();
    }
}

function initGame(){
    const grid = document.getElementById("level-grid");
    grid.innerHTML = "";
    for(let i=1; i<=totalLevels; i++){
        const div = document.createElement("div");
        div.innerText = i;
        div.className = i <= unlockedLevel ? "level-card" : "level-card locked";
        if(i <= unlockedLevel) div.onclick = () => startLevel(i);
        grid.appendChild(div);
    }
}

function startLevel(level) {
    currentLevel = level;

    // 1. મેનુ છુપાવો
    document.getElementById("level-grid").classList.add("hidden");
    document.getElementById("main-title").classList.add("hidden");
    document.getElementById("reset-btn").classList.add("hidden");

    // 2. પ્લે એરિયા બતાવો
    document.getElementById("game-play-area").classList.remove("hidden");

    // 3. બધી જ ગેમ્સના ID
    const allGames = [
        "music-game", "catch-game", "avoid-game", 
        "boss-game", "gun-game", "maze-game", 
        "reaction-game", "coming-soon"
    ];

    // 4. લૂપ ચલાવીને બધી ગેમ્સને "Display None" કરી દો
    allGames.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add("hidden");
            el.style.display = "none"; // આ લાઈન લેવલ 6 ને નીચે દેખાતું બંધ કરશે
        }
    });

    document.getElementById("current-level-title").innerText = "Level " + level;

    // 5. જે લેવલ છે તેને બતાવો
    if (level === 1) { 
        document.getElementById("music-game").style.display = "block";
        document.getElementById("music-game").classList.remove("hidden");
        startMusicGame(); 
    }
    else if (level === 2) { 
        document.getElementById("catch-game").style.display = "block";
        document.getElementById("catch-game").classList.remove("hidden");
        startCatchGame(); 
    }
    else if (level === 3) {
        document.getElementById("avoid-game").style.display = "block";
        document.getElementById("avoid-game").classList.remove("hidden");
        startAvoidGame();
    }
    else if (level === 4) {
        document.getElementById("boss-game").style.display = "block";
        document.getElementById("boss-game").classList.remove("hidden");
        startBossGame();
    }
    else if (level === 5) {
        document.getElementById("gun-game").style.display = "block";
        document.getElementById("gun-game").classList.remove("hidden");
        startGunGame();
    }
    else if (level === 6) { 
        // Maze game માટે flex વાપરવું જરૂરી હોય તો અહીં આપો
        document.getElementById("maze-game").style.display = "flex"; 
        document.getElementById("maze-game").classList.remove("hidden");
        startMazeGame(); 
    }
    else if (level === 7) {
        document.getElementById("reaction-game").style.display = "block";
        document.getElementById("reaction-game").classList.remove("hidden");
        startReactionGame();
    }
    else {
        document.getElementById("coming-soon").style.display = "block";
        document.getElementById("coming-soon").classList.remove("hidden");
    }
}

function levelComplete(){
    if(currentLevel === unlockedLevel){
        unlockedLevel++;
        localStorage.setItem("unlockedLevel", unlockedLevel);
    }
    alert("Level Cleared!");
    backToMenu();
}

/* ================= LEVEL 1 : MUSIC GAME ================= */
function startMusicGame(){
    const game = document.getElementById("music-game");
    game.classList.remove("hidden");
    let musicScore = 0;
    document.getElementById("music-score").innerText = "Score: 0";

    setGameInterval(()=>{
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.style.left = Math.floor(Math.random()*4)*90+"px";
        tile.style.top = "-150px";
        game.appendChild(tile);

        let y = -150;
        const fall = setGameInterval(()=>{
            y += 5;
            tile.style.top = y + "px";
            if(y > 600) tile.remove();
        }, 20);

        tile.onclick = () => {
            musicScore++;
            document.getElementById("music-score").innerText = "Score: " + musicScore;
            tile.remove();
            if(musicScore >= 50) levelComplete();
        };
    }, 600);
}

/* ================= LEVEL 2 : CATCH GAME ================= */
function startCatchGame(){
    const game = document.getElementById("catch-game");
    game.classList.remove("hidden");
    let score = 0;
    let pX = 170;
    const player = document.getElementById("player");
    document.getElementById("score-board").innerText = "Score: 0";

    document.onkeydown = (e) => {
        if(e.key === "ArrowLeft" && pX > 0) pX -= 30;
        if(e.key === "ArrowRight" && pX < 340) pX += 30;
        player.style.left = pX + "px";
    };

    setGameInterval(() => {
        const obj = document.createElement("div");
        obj.className = "falling-object";
        obj.style.left = Math.random() * 360 + "px";
        game.appendChild(obj);

        let y = -40;
        setGameInterval(() => {
            y += 5;
            obj.style.top = y + "px";
            if(y > 520 && obj.offsetLeft+35 > pX && obj.offsetLeft < pX+60){
                score += 10;
                document.getElementById("score-board").innerText = "Score: " + score;
                obj.remove();
                if(score >= 100) levelComplete();
            }
            if(y > 600) obj.remove();
        }, 20);
    }, 1000);
}

/* ================= LEVEL 3 : AVOID GAME ================= */
function startAvoidGame(){
    const game = document.getElementById("avoid-game");
    game.classList.remove("hidden");
    let aTime = 0;
    let aX = 175;
    const player = document.getElementById("avoid-player");

    document.onkeydown = (e) => {
        if(e.key === "ArrowLeft" && aX > 0) aX -= 25;
        if(e.key === "ArrowRight" && aX < 350) aX += 25;
        player.style.left = aX + "px";
    };

    setGameInterval(() => {
        aTime++;
        document.getElementById("avoid-timer").innerText = "Time: " + aTime;
        if(aTime >= 20) levelComplete();
    }, 1000);

    setGameInterval(() => {
        const obs = document.createElement("div");
        obs.className = "avoid-obstacle";
        obs.style.left = Math.random() * 360 + "px";
        game.appendChild(obs);

        let y = -40;
        setGameInterval(() => {
            y += 6;
            obs.style.top = y + "px";
            if(y > 520 && obs.offsetLeft < aX+50 && obs.offsetLeft+40 > aX){
                alert("Game Over!");
                backToMenu();
            }
            if(y > 600) obs.remove();
        }, 20);
    }, 800);
}

/* ================= LEVEL 4 : BOSS GAME ================= */
function startBossGame(){
    const game = document.getElementById("boss-game");
    game.classList.remove("hidden");
    let bTime = 0;
    let bX = 175;
    const player = document.getElementById("boss-player");

    document.onkeydown = (e) => {
        if(e.key === "ArrowLeft" && bX > 0) bX -= 25;
        if(e.key === "ArrowRight" && bX < 350) bX += 25;
        player.style.left = bX + "px";
    };

    setGameInterval(() => {
        bTime++;
        document.getElementById("boss-timer").innerText = "Survive: " + bTime + "s";
        if(bTime >= 30) levelComplete();
    }, 1000);

    setGameInterval(() => {
        const fire = document.createElement("div");
        fire.className = "boss-fire";
        fire.style.left = (document.getElementById("boss").offsetLeft + 50) + "px";
        fire.style.top = "120px";
        game.appendChild(fire);

        let y = 120;
        setGameInterval(() => {
            y += 7;
            fire.style.top = y + "px";
            if(y > 520 && fire.offsetLeft < bX+50 && fire.offsetLeft+20 > bX){
                alert("Boss Killed You!");
                backToMenu();
            }
            if(y > 600) fire.remove();
        }, 20);
    }, 600);
}

/* ================= LEVEL 5 : GUN GAME ================= */
function startGunGame(){
    const game = document.getElementById("gun-game");
    game.classList.remove("hidden");
    let kills = 0;
    let gX = 175;
    const player = document.getElementById("gun-player");
    document.getElementById("gun-score").innerText = "Kills: 0";

    document.onkeydown = (e) => {
        if(e.key === "ArrowLeft" && gX > 0) gX -= 20;
        if(e.key === "ArrowRight" && gX < 350) gX += 20;
        if(e.key === " ") shoot();
        player.style.left = gX + "px";
    };

    function shoot(){
        const b = document.createElement("div");
        b.className = "bullet";
        b.style.left = (gX + 22) + "px";
        b.style.bottom = "70px";
        game.appendChild(b);
        let bY = 530;
        setGameInterval(() => {
            bY -= 10;
            b.style.top = bY + "px";
            document.querySelectorAll(".enemy").forEach(en => {
                if(Math.abs(en.offsetLeft - b.offsetLeft) < 30 && Math.abs(en.offsetTop - bY) < 30){
                    en.remove(); b.remove(); kills++;
                    document.getElementById("gun-score").innerText = "Kills: " + kills;
                    if(kills >= 10) levelComplete();
                }
            });
            if(bY < 0) b.remove();
        }, 20);
    }

    setGameInterval(() => {
        const en = document.createElement("div");
        en.className = "enemy";
        en.style.left = Math.random() * 360 + "px";
        game.appendChild(en);
        let eY = -40;
        setGameInterval(() => {
            eY += 4; en.style.top = eY + "px";
            if(eY > 600) en.remove();
        }, 20);
    }, 1000);
}

/* ================= LEVEL 6 : MAZE GAME ================= */
function startMazeGame() {
    const gameArea = document.getElementById("maze-game");
    const container = document.getElementById("maze-container");
    const player = document.getElementById("maze-player");
    
    gameArea.classList.remove("hidden");

    let x = 10, y = 10;
    player.style.left = x + "px";
    player.style.top = y + "px";

    // દીવાલોનો ડેટા
    const wallsData = [
        {x: 60, y: 0, w: 20, h: 250},
        {x: 140, y: 80, w: 210, h: 20},
        {x: 0, y: 300, w: 260, h: 20},
        {x: 220, y: 180, w: 20, h: 120},
        {x: 140, y: 180, w: 80, h: 20}
    ];

    // જૂની દીવાલો સાફ કરવી
    const oldWalls = container.querySelectorAll('.maze-wall');
    oldWalls.forEach(w => w.remove());

    // નવી દીવાલો ઉમેરવી
    wallsData.forEach(w => {
        const wall = document.createElement("div");
        wall.className = "maze-wall";
        wall.style.left = w.x + "px";
        wall.style.top = w.y + "px";
        wall.style.width = w.w + "px";
        wall.style.height = w.h + "px";
        container.appendChild(wall); // અગત્યનું: container માં ઉમેરો
    });

    document.onkeydown = (e) => {
        let oldX = x;
        let oldY = y;
        let step = 10;

        if (e.key === "ArrowRight") x += step;
        if (e.key === "ArrowLeft") x -= step;
        if (e.key === "ArrowUp") y -= step;
        if (e.key === "ArrowDown") y += step;

        // બાઉન્ડ્રી ચેક (350px - player width 20px = 330px)
        if (x < 0 || x > 330 || y < 0 || y > 330) {
            x = oldX; y = oldY;
        }

        // અથડામણ (Collision) ચેક
        wallsData.forEach(w => {
            if (x < w.x + w.w && x + 20 > w.x && y < w.y + w.h && y + 20 > w.y) {
                x = oldX; y = oldY;
            }
        });

        player.style.left = x + "px";
        player.style.top = y + "px";

        // ગોલ ચેક
        if (x > 300 && y > 300) {
            levelComplete();
        }
    };
}

/* ================= LEVEL 7 : REACTION GAME ================= */
function startReactionGame(){
    const game = document.getElementById("reaction-game");
    game.classList.remove("hidden");
    const btn = document.getElementById("react-btn");
    btn.style.background = "red";
    btn.innerText = "WAIT FOR GREEN...";
    btn.onclick = () => { alert("Too Early!"); backToMenu(); };

    setTimeout(() => {
        btn.style.background = "green";
        btn.innerText = "CLICK NOW!!!";
        btn.onclick = () => levelComplete();
    }, Math.random() * 3000 + 2000);
}

// શરૂઆત
initGame();