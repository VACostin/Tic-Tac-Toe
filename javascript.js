const gameBoard = (() => {
  let boardState = [
    '-', '-', '-',
    '-', '-', '-',
    '-', '-', '-'
  ];

  let tick = 'X';
  let status = 'Keep Playing!';

  const playRound = (pos) => {
    status = 'Keep Playing!';
    if (boardState[pos] == '-')
      fillBox(pos);
    else
      status = 'Invalid!';
    return status;
  };

  const fillBox = (pos) => {
    boardState[pos] = tick;
    checkResult();
  };

  const clearBoard = () => {
    boardState = [
      '-', '-', '-',
      '-', '-', '-',
      '-', '-', '-'
    ];
    tick = 'X';
    status = 'Keep Playing!';
  };

  const changeTick = () => {
    if (tick == 'X')
      tick = 'O';
    else
      tick = 'X';
  };

  const checkResult = () => {
    if (
      (boardState[0] == boardState[1] && boardState[2] != '-' && boardState[0] == boardState[2]) ||
      (boardState[3] == boardState[4] && boardState[5] != '-' && boardState[3] == boardState[5]) ||
      (boardState[6] == boardState[7] && boardState[8] != '-' && boardState[6] == boardState[8]) ||
      (boardState[0] == boardState[3] && boardState[6] != '-' && boardState[0] == boardState[6]) ||
      (boardState[1] == boardState[4] && boardState[7] != '-' && boardState[1] == boardState[7]) ||
      (boardState[2] == boardState[5] && boardState[8] != '-' && boardState[2] == boardState[8]) ||
      (boardState[0] == boardState[4] && boardState[8] != '-' && boardState[0] == boardState[8]) ||
      (boardState[2] == boardState[4] && boardState[6] != '-' && boardState[2] == boardState[6])
    )
      status = 'Win!';
    else if (!boardState.includes('-'))
      status = 'It\'s a tie!';
    changeTick();
  };

  const whosPlaying = () => {
    return tick;
  };

  return {
    playRound,
    clearBoard,
    whosPlaying
  };
})();

const displayController = (() => {
  let tick = '';
  let status = '';
  let position = -1;
  let vsComputer = false;
  let playerScoreX = 0;
  let playerScoreO = 0;

  const startGame = () => {
    const gameBoard = document.querySelector('#gameBoard');
    const scores = document.querySelector('#scores');
    const mainMenu = document.querySelector('#mainMenu');

    gameBoard.style.visibility = 'visible';
    scores.style.visibility = 'visible';
    mainMenu.style.visibility = 'hidden';
  };

  const setAI = (option) => {
    vsComputer = option;
  };

  const playAgain = () => {
    hideMessage();
    clearBoxes();
  };

  const doMagic = (boxId) => {
    tick = gameBoard.whosPlaying();
    status = gameBoard.playRound(boxId);
    position = boxId;
    checkStatus();
  };

  const doAIMagic = () => {
    while (gameBoard.whosPlaying() == 'O') {
      let rand = Math.floor(Math.random() * 9);
      doMagic(rand);
    }
  };

  const checkStatus = () => {
    switch (status) {
      case 'Win!':
        fillBox();
        let message = `Player ${tick} wins!`;
        addScore();
        gameBoard.clearBoard();
        displayMessage(message);
        break;
      case 'It\'s a tie!':
        fillBox();
        console.log(status);
        gameBoard.clearBoard();
        displayMessage(status);
        break;
      case 'Keep Playing!':
        fillBox();
        if (vsComputer && tick == 'X')
          doAIMagic();
        break;
      default:
        break;
    }
  };

  const fillBox = () => {
    const box = document.getElementById(`${position}`);
    box.textContent = tick;
  };

  const clearBoxes = () => {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach((box) => {
      box.textContent = '';
    });
  };

  const stopGame = () => {
    playAgain();
    const playerX = document.querySelector('#playerX');
    const playerO = document.querySelector('#playerO');
    playerX.textContent = `Player X: 0`;
    playerScoreX = 0;
    playerO.textContent = `Player O: 0`;
    playerScoreO = 0;

    const gameBoard = document.querySelector('#gameBoard');
    const scores = document.querySelector('#scores');
    const mainMenu = document.querySelector('#mainMenu');

    gameBoard.style.visibility = 'hidden';
    scores.style.visibility = 'hidden';
    mainMenu.style.visibility = 'visible';
  };

  const addScore = () => {
    if (tick == 'X') {
      const playerX = document.querySelector('#playerX');
      playerScoreX++;
      playerX.textContent = `Player X: ${playerScoreX}`;
    } else {
      const playerO = document.querySelector('#playerO');
      playerScoreO++;
      playerO.textContent = `Player O: ${playerScoreO}`;
    }
  };

  const displayMessage = (message) => {
    let popupWindow = document.querySelector('#popupWindow');
    popupWindow.style.visibility = 'visible';
    let menuMessage = document.querySelector('#menuMessage');
    menuMessage.textContent = message;
  };

  const hideMessage = () => {
    let popupWindow = document.querySelector('#popupWindow');
    popupWindow.style.visibility = 'hidden';
  };

  return {
    startGame,
    setAI,
    doMagic,
    playAgain,
    stopGame
  };
})();

function main() {
  const PVE = document.querySelector('#PVE');
  const PVP = document.querySelector('#PVP');
  const boxes = document.querySelectorAll('.box');
  const playAgain = document.querySelector('#playAgain');
  const toMainMenu = document.querySelector('#toMainMenu');

  PVE.addEventListener('click', () => {
    displayController.setAI(true);
    displayController.startGame();
  });

  PVP.addEventListener('click', () => {
    displayController.setAI(false);
    displayController.startGame();
  });

  boxes.forEach((box) => {
    box.addEventListener('click', () => {
      displayController.doMagic(box.id);
    });
  });

  playAgain.addEventListener('click', () => {
    displayController.playAgain();
  });

  toMainMenu.addEventListener('click', () => {
    displayController.stopGame();
  });
}

main();