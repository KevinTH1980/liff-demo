// 🔹 1. เริ่มต้น LIFF
liff.init({ liffId: "LIFF_ID_ของคุณ" })
  .then(async () => {
    console.log("LIFF Ready");

    // 🔹 2. ตรวจภาษา
    const lang = detectLanguage();
    loadLang(lang);
  })
  .catch(err => {
    console.error("LIFF error", err);
  });

// 🔹 3. ตรวจภาษาจาก LINE
function detectLanguage() {
  const lang = liff.getLanguage(); // th / en / zh-Hans / zh-Hant
  if (lang.startsWith("zh")) return "cn";
  if (lang === "en") return "en";
  return "th";
}

// 🔹 4. โหลดไฟล์ภาษา
async function loadLang(lang) {
  const res = await fetch(`lang/${lang}.json`);
  const data = await res.json();

  document.getElementById("title").innerText = data.title;
  document.getElementById("desc").innerText = data.desc;
  document.getElementById("start").innerText = data.start;
}