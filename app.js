const gameBoard = document.getElementById('game-board');
const timeCountElement = document.getElementById('time-count');
const hitCountElement = document.getElementById('hit-count');
const winMessage = document.getElementById('win-message');

// 5가지 지정된 색상 배열
const colors = ['red', 'green', 'blue', 'black', 'white'];
let cells = []; // 16개 칸을 담을 배열
let hitCount = 0;
let startTime = Date.now();
let isGameOver = false;
let timerFrame;

// 1. 밀리초 단위 타이머 (00:00:00 포맷)
function updateTime() {
    if (isGameOver) return; // 게임이 끝나면 타이머 멈춤

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

// 2. 승리 조건 체크 (16개 모두 같은 색인지 확인)
function checkWin() {
    // 첫 번째 칸의 색상 인덱스를 기준으로 잡음
    const firstColorIndex = cells.dataset.colorIndex;
    
    // 모든 칸이 첫 번째 칸과 색상 인덱스가 같은지 검사
    const isWin = cells.every(cell => cell.dataset.colorIndex === firstColorIndex);

    if (isWin) {
        isGameOver = true;
        cancelAnimationFrame(timerFrame); // 타이머 종료
        winMessage.style.display = 'block'; // Congratulation 메시지 표시
    }
}

// 3. 16개 칸(격자) 생성 및 초기화
for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');

    // 0~4 사이의 랜덤 인덱스를 뽑아서 초기 색상 지정
    let randomColorIndex = Math.floor(Math.random() * colors.length);
    cell.dataset.colorIndex = randomColorIndex;
    cell.style.backgroundColor = colors[randomColorIndex];

    // 각 칸을 터치했을 때 실행되는 함수
    function handleTouch(e) {
        e.preventDefault(); // 화면 더블탭 확대 방지
        
        if (isGameOver) return; // 게임 종료 시 터치 무시

        // 터치 횟수 증가
        hitCount++;
        hitCountElement.innerText = hitCount;

        // 색상 순환 (현재 인덱스 + 1 한 뒤 5로 나눈 나머지)
        let currentIndex = parseInt(cell.dataset.colorIndex);
        let nextIndex = (currentIndex + 1) % colors.length;
        
        cell.dataset.colorIndex = nextIndex;
        cell.style.backgroundColor = colors[nextIndex];

        // 색을 바꾼 후 승리 조건 체크
        checkWin();
    }

    // 터치 및 마우스 클릭 이벤트 등록
    cell.addEventListener('touchstart', handleTouch, { passive: false });
    cell.addEventListener('mousedown', handleTouch);

    gameBoard.appendChild(cell);
    cells.push(cell); // 배열에 칸 추가
}