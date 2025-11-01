document.addEventListener("DOMContentLoaded", () => {
  //VARIAVEIS//
  let divMessage = document.querySelector(".winningMessage");
  let message = document.getElementById("msgWin");
  const btnReset = document.getElementById("reset_button");
  const plusOneP1 = document.querySelector(".plusOneP1");
  const plusOneP2 = document.querySelector(".plusOneP2");
  const themes = document.getElementById("themes");
  const container = document.querySelector(".container");
  container.style.background = localStorage.getItem("bg_theme");

  let placarP1 = document.getElementById("player1_score");
  placarP1.textContent = localStorage.getItem("p1_score") ?? 0;
  let placarP2 = document.getElementById("player2_score");
  placarP2.textContent = localStorage.getItem("p2_score") ?? 0;

  let playerNames = document.querySelectorAll(".player_name");

  let inpP1Name = document.getElementById("p1_name");
  inpP1Name.value = localStorage.getItem("p1_name") ?? "Player 1";
  let inpP2Name = document.getElementById("p2_name");
  inpP2Name.value = localStorage.getItem("p2_name") ?? "Player 2";

  let markers = document.querySelectorAll(".player_marker");
  let inpP1Marker = document.getElementById("p1_marker");
  inpP1Marker.value = localStorage.getItem("p1_marker") ?? "X";
  let inpP2Marker = document.getElementById("p2_marker");
  inpP2Marker.value = localStorage.getItem("p2_marker") ?? "O";

  let p1Name = inpP1Name.value;
  let p2Name = inpP2Name.value;

  let p1Marker = inpP1Marker.value;
  let p2Marker = inpP2Marker.value;

  const blocks = document.querySelectorAll(".block");

  let currentMarker = p1Marker;

  /////////////////////////////////////////////////////////////////////

  function updateLocalStorage(chave, valor) {
    localStorage.setItem(chave, valor);
  }

  function resetConfigs() {
    localStorage.clear();
    inpP1Name.value = "Player 1";
    inpP2Name.value = "Player 2";
    p1Name = inpP1Name.value;
    p2Name = inpP2Name.value;

    inpP1Marker.value = "X";
    inpP2Marker.value = "O";
    p1Marker = inpP1Marker.value;
    p2Marker = inpP2Marker.value;
    currentMarker = p1Marker;

    placarP1.textContent = "0";
    placarP2.textContent = "0";
  }

  markers.forEach((m) => {
    m.addEventListener("keyup", () => {
      inpP1Marker = document.getElementById("p1_marker");
      updateLocalStorage("p1_marker", inpP1Marker.value);
      p1Marker = localStorage.getItem("p1_marker");
      currentMarker = p1Marker;
      inpP2Marker = document.getElementById("p2_marker");
      updateLocalStorage("p2_marker", inpP2Marker.value);
      p2Marker = localStorage.getItem("p2_marker");
      currentMarker = p1Marker;
    });
  });
  playerNames.forEach((n) => {
    n.addEventListener("keyup", () => {
      inpP1Name = document.getElementById("p1_name");
      updateLocalStorage("p1_name", inpP1Name.value);
      p1Name = localStorage.getItem("p1_name");
      inpP2Name = document.getElementById("p2_name");
      updateLocalStorage("p2_name", inpP2Name.value);
      p2Name = inpP2Name.value;
    });
  });

  themes.addEventListener("change", (e) => {
    const color = e.target.value;
    container.style.background = `linear-gradient(320deg,rgb(0, 0, 0, 1),${color},rgb(0, 0, 0, 0.9))`;
    updateLocalStorage(
      "bg_theme",
      `linear-gradient(320deg,rgb(0, 0, 0, 1),${color},rgb(0, 0, 0, 0.9))`
    );
  });

  btnReset.addEventListener("click", () => {
    resetConfigs();
  });

  //EVENT LISTENERS//

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

  ///////////////////////////////////////////////////////////////

  function endGame(player, type) {
    restarMatch();
    if (type == "win" && player === p1Name) {
      updateLocalStorage(
        "p1_score",
        Number(localStorage.getItem("p1_score")) + 1 ?? 1
      );
      placarP1.textContent = localStorage.getItem("p1_score");
      plusOneP1.style.opacity = 1;
      setTimeout(() => {
        plusOneP1.style.opacity = 0;
      }, 2000);
    } else if (type == "win" && player === p2Name) {
      updateLocalStorage(
        "p2_score",
        Number(localStorage.getItem("p2_score")) + 1 ?? 1
      );
      placarP2.textContent = localStorage.getItem("p2_score");
      plusOneP2.style.opacity = 1;
      setTimeout(() => {
        plusOneP2.style.opacity = 0;
      }, 2500);
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
      message.textContent = "VELHA!";
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
          return true;
        } else if (marker === p2Marker) {
          endGame(p2Name, "win");
          return true;
        }
      } else if (isDraw()) {
        endGame(null, "draw");
      }
    }
  }
});
