function changeScore() {
      document.getElementById("score").innerHTML = "This page has a " + localStorage.getItem("score") + "% chance of being safe";
}

window.onload = changeScore();

