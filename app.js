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
    // [아버님의 디버깅 포인트 반영] isGameOver가 true가 되면 타이머가 즉시 멈춥니다!
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

// 2. 승리 조건 체크 (에러가 발생하지 않는 가장 안전한 로직으로 전면 수정)
function checkWin() {
    let isWin = true;
    let firstColor = null;
    
    // 대괄호 기호나 구형 기기에서 에러가 나는 최신 문법을 완전히 배제한 방식입니다.
    cells.forEach(function(cell) {
        if (firstColor === null) {
            firstColor = cell.dataset.colorIndex; // 첫 번째 칸의 색상 기준 잡기
        } else if (cell.dataset.colorIndex !== firstColor) {
            isWin = false; // 하나라도 색이 다르면 승리 실패
        }
    });

    // 16개가 모두 같으면 게임 종료 및 메시지 표시
    if (isWin) {
        isGameOver = true; // 이 플래그가 타이머를 확실히 멈춰줍니다.
        winMessage.style.display = 'block'; 
    }
}

// 다시하기 버튼 기능
function restartGame(e) {
    e.preventDefault(); 
    location.reload(); 
}

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

        checkWin();
    }

    cell.addEventListener('touchstart', handleTouch, { passive: false });
    cell.addEventListener('mousedown', handleTouch);

    gameBoard.appendChild(cell);
    cells.push(cell); 
}