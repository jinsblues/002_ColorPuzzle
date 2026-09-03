const gameBoard = document.getElementById('game-board');
const timeCountElement = document.getElementById('time-count');
const hitCountElement = document.getElementById('hit-count');
const winMessage = document.getElementById('win-message');
const restartBtn = document.getElementById('restart-btn');

const colors = ['red', 'green', 'blue', 'black', 'white'];
let cells = []; 
let hitCount = 0;
let startTime = Date.now();
let isGameOver = false;
let timerFrame;

// 1. 밀리초 단위 타이머 
function updateTime() {
    if (isGameOver) return; 

    const elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10); 

    const formattedMin = String(minutes).padStart(2, '0');
    const formattedSec = String(seconds).padStart(2, '0');
    const formattedMs = String(milliseconds).padStart(2, '0');

    timeCountElement.innerText = `${formattedMin}:${formattedSec}:${formattedMs}`;
    timerFrame = requestAnimationFrame(updateTime); 
}
updateTime();

// 2. 승리 조건 체크 
function checkWin() {
    // [핵심 해결] 텍스트가 증발하는 현상을 막기 위해, 숫자를 쓰지 않고 '첫 번째 칸'을 가져오는 안전한 문법을 적용했습니다.
    const [firstCell] = cells;
    const firstColorIndex = firstCell.dataset.colorIndex;
    
    // 모든 칸이 첫 번째 칸과 색상 인덱스가 같은지 검사
    const isWin = cells.every(cell => cell.dataset.colorIndex === firstColorIndex);

    if (isWin) {
        isGameOver = true;
        cancelAnimationFrame(timerFrame); 
        winMessage.style.display = 'block'; 
    }
}

// 다시하기 버튼 터치 시 화면 새로고침 함수
function restartGame(e) {
    e.preventDefault(); 
    location.reload(); 
}

// 다시하기 버튼 이벤트 등록
restartBtn.addEventListener('touchstart', restartGame, { passive: false });
restartBtn.addEventListener('mousedown', restartGame);

// 3. 16개 칸 생성
for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');

    let randomColorIndex = Math.floor(Math.random() * colors.length);
    cell.dataset.colorIndex = randomColorIndex;
    cell.style.backgroundColor = colors[randomColorIndex];

    function handleTouch(e) {
        e.preventDefault(); 
        
        if (isGameOver) return; 

        hitCount++;
        hitCountElement.innerText = hitCount;

        let currentIndex = parseInt(cell.dataset.colorIndex);
        let nextIndex = (currentIndex + 1) % colors.length;
        
        cell.dataset.colorIndex = nextIndex;
        cell.style.backgroundColor = colors[nextIndex];

        // 터치하여 색이 바뀔 때마다 정답인지 체크
        checkWin();
    }

    cell.addEventListener('touchstart', handleTouch, { passive: false });
    cell.addEventListener('mousedown', handleTouch);

    gameBoard.appendChild(cell);
    cells.push(cell); 
}