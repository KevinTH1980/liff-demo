// 🔹 1. เริ่มต้น LIFF
console.log("app.js loaded");
liff.init({ liffId: "2009890149-ANrtauwZ" })
  .then(async () => {
    console.log("LIFF Ready");

    // 🔹 2. ตรวจภาษา
    const lang = detectLanguage();
    loadLang(lang);

    // 🔹 init UI
    updateUI();
  })
  .catch(err => {
    console.error("LIFF error", err);
  });

// 🔹 3. ตรวจภาษาจาก LINE
function detectLanguage() {
  const lang = liff.getLanguage(); // th / en / zh-Hans / zh-Hant
  if (lang && lang.startsWith("zh")) return "cn";
  if (lang === "en") return "en";
  return "th";
}

// 🔹 4. โหลดไฟล์ภาษา
async function loadLang(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    const data = await res.json();

    document.getElementById("title").innerText = data.title;
    document.getElementById("desc").innerText = data.desc;
  } catch (e) {
    console.error("Load lang error", e);
  }
}

// ================================
// ระบบลงชื่อเล่นแบต
// ================================
const MAX = 66;

// mock data (เดี๋ยวเปลี่ยนเป็น database ทีหลัง)
let data = {
  tue: [],
  thu: []
};

function joinDay(day) {
  if (!data[day]) return;

  if (data[day].length >= MAX) {
    document.getElementById("status").innerText = "❌ วันนี้เต็มแล้ว";
    return;
  }

  const name = "คุณ"; // STEP ถัดไปจะดึงชื่อ LINE จริง
  data[day].push(name);

  updateUI();
  document.getElementById("status").innerText = "✅ ลงชื่อเรียบร้อย";
}

function updateUI() {
  document.getElementById("tueCount").innerText = data.tue.length;
  document.getElementById("thuCount").innerText = data.thu.length;
}
