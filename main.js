let currentLang = "th";

function render(lang) {
  document.getElementById("title").innerText = LANG[lang].title;
  document.getElementById("startBtn").innerText = LANG[lang].start;
}

document.getElementById("lang").addEventListener("change", (e) => {
  currentLang = e.target.value;
  render(currentLang);
});

render(currentLang);