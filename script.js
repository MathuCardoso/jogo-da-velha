document.addEventListener("DOMContentLoaded", () => {
  //VARIAVEIS//
  let divMessage = document.getElementsByClassName("winningMessage")[0];
  let message = document.getElementById("msgWin");
  const btnReset = document.getElementById("reset_button");

  let placarP1 = document.getElementById('player1_score');
  placarP1.textContent = getItem('p1_score') ?? 0;
  let placarP2 = document.getElementById('player2_score');
  placarP2.textContent = getItem('p2_score') ?? 0;

  let playerNames = document.querySelectorAll(".player_name");

  let inpP1Name = document.getElementById("p1_name");
  inpP1Name.value = getItem("p1_name") ?? "Player 1";
  let inpP2Name = document.getElementById("p2_name");
  inpP2Name.value = getItem("p2_name") ?? "Player 2";

  let markers = document.querySelectorAll(".player_marker");
  let inpP1Marker = document.getElementById("p1_marker");
  inpP1Marker.value = getItem("p1_marker") ?? "X";
  let inpP2Marker = document.getElementById("p2_marker");
  inpP2Marker.value = getItem("p2_marker") ?? "O";

  let p1Name = inpP1Name.value;
  let p2Name = inpP2Name.value;

  let p1Marker = inpP1Marker.value;
  let p2Marker = inpP2Marker.value;

  const blocks = document.querySelectorAll(".block");

  let currentMarker = p1Marker;
  /////////////////////////////////////////////////////////////////////

  //EVENT LISTENERS//
  markers.forEach((m) => {
    m.addEventListener("keyup", () => {
      inpP1Marker = document.getElementById("p1_marker");
      updateLocalStorage("p1_marker", inpP1Marker.value);
      p1Marker = getItem("p1_marker");
      currentMarker = p1Marker;
      inpP2Marker = document.getElementById("p2_marker");
      updateLocalStorage("p2_marker", inpP2Marker.value);
      p2Marker = getItem("p2_marker");
      currentMarker = p1Marker;
    });
  });

  playerNames.forEach((p) => {
    p.addEventListener("keyup", () => {
      inpP1Name = document.getElementById("p1_name");
      updateLocalStorage("p1_name", inpP1Name.value);
      p1Name = getItem("p1_name");
      inpP2Name = document.getElementById("p2_name");
      updateLocalStorage("p2_name", inpP2Name.value);
      p2Name = inpP2Name.value;
    });
  });

  blocks.forEach((b) => {
    b.addEventListener("click", () => {
      if (!isMarked(b)) {
        b.textContent = currentMarker;
        b.classList.remove("hover");
        b.classList.add("marked");
        checkWin(blocks, currentMarker);
        changePlayer();
      }
    });

    b.addEventListener("mouseover", () => {
      if (!isMarked(b)) {
        b.classList.add("hover");
        b.textContent = currentMarker;
      }
    });
    b.addEventListener("mouseout", () => {
      b.classList.remove("hover");
      if (!b.classList.contains("marked")) {
        b.textContent = null;
      }
    });
  });

  btnReset.addEventListener("click", () => {
    resetConfigs();
  });

  ///////////////////////////////////////////////////////////////

  function updateLocalStorage(chave, valor) {
    localStorage.setItem(chave, valor);
  }

  function getItem(chave) {
    return localStorage.getItem(chave);
  }

  function endGame(player, type) {
    restarMatch();
    if(type == "win" && player === p1Name) {
      updateLocalStorage('p1_score', Number(getItem('p1_score'))+1 ?? 1);
      placarP1.textContent = getItem('p1_score');
    }
    else {
      updateLocalStorage('p2_score', Number(getItem('p2_score'))+1 ?? 1);
      placarP2.textContent = getItem('p2_score');

    }
    showMessage(player, type);
  }

  function restarMatch() {
    setTimeout(() => {
      blocks.forEach((b) => {
        b.textContent = null;
        b.classList.remove("marked");
        currentMarker = p1Marker;
      });
    }, 100);
  }

  function isMarked(block) {
    if (block.classList.contains("marked")) {
      return true;
    }
    return false;
  }

  function changePlayer() {
    if (currentMarker === p1Marker) {
      currentMarker = p2Marker;
    } else {
      currentMarker = p1Marker;
    }
  }

  function showMessage(player, type) {
    if (type == "win") {
      message.textContent = player + " ganhou!";
      divMessage.style.backgroundColor = "green";
      divMessage.classList.add("show");
      setTimeout(() => {
        divMessage.classList.remove("show");
      }, 2500);
    } else if (type == "draw") {
      message.textContent = "DEU EMPATE!";
      divMessage.style.backgroundColor = "gray";
      divMessage.classList.add("show");
      setTimeout(() => {
        divMessage.classList.remove("show");
      }, 2500);
    }
  }

  function isDraw() {
    let blocksMarked = 0;
    blocks.forEach((b) => {
      if (b.textContent) {
        blocksMarked++;
      }
    });

    if (blocksMarked == 9) {
      return true;
    }
  }

  function checkWin(blocks, marker) {
    const winningBlocks = {
      1: [0, 1, 2],
      2: [0, 3, 6],
      3: [0, 4, 8],
      4: [1, 4, 7],
      5: [2, 5, 8],
      6: [2, 4, 6],
      7: [3, 4, 5],
      8: [6, 7, 8],
    };

    for (i = 1; i <= 8; i++) {
      if (
        blocks[winningBlocks[i][0]].textContent === marker &&
        blocks[winningBlocks[i][1]].textContent === marker &&
        blocks[winningBlocks[i][2]].textContent === marker
      ) {
        if (marker === p1Marker) {
          endGame(p1Name, "win");
        } else if (marker === p2Marker) {
          endGame(p2Name, "win");
        }
      } else {
        if (isDraw()) {
          endGame(null, "draw");
          return;
        }
      }
    }
  }

  function resetConfigs() {
    localStorage.clear();
    inpP1Name.value = "Player 1";
    inpP2Name.value = "Player 2";

    inpP1Marker.value = "X";
    inpP2Marker.value = "O";
    p1Marker = inpP1Marker.value;
    p2Marker = inpP2Marker.value;
    currentMarker = p1Marker;

    placarP1.textContent = "0";
    placarP2.textContent = "0";
  }
});
