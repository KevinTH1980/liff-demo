// ================================
// รอให้หน้าเว็บโหลดก่อน
// ================================
document.addEventListener("DOMContentLoaded", () => {

  // 🔹 1. เริ่มต้น LIFF
  liff.init({ liffId: "2009890149-ANrtauwZ" })
    .then(() => {
      console.log("LIFF Ready");

      // 🔹 ตรวจภาษา
      const lang = detectLanguage();
      loadLang(lang);

      // 🔹 อัปเดตตัวเลขครั้งแรก
      updateUI();
    })
    .catch(err => {
      console.error("LIFF error", err);
    });

});

// ================================
// ตรวจภาษาจาก LINE
// ================================
function detectLanguage() {
  const lang = liff.getLanguage(); // th / en / zh-Hans / zh-Hant
  if (lang && lang.startsWith("zh")) return "cn";
  if (lang === "en") return "en";
  return "th";
}

// ================================
// โหลดไฟล์ภาษา
// ================================
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

  data[day].push("คุณ");

  updateUI();
  document.getElementById("status").innerText = "✅ ลงชื่อเรียบร้อย";
}

// ================================
// อัปเดตตัวเลขหน้าเว็บ
// ================================
function updateUI() {
  // จำนวน
  document.getElementById("tueCount").innerText = data.tue.length;
  document.getElementById("thuCount").innerText = data.thu.length;

  // รายชื่อ
  renderList("tue");
  renderList("thu");
}
function renderList(day) {
  const listEl = document.getElementById(day + "List");
  listEl.innerHTML = "";

  data[day].forEach((u, i) => {
    const li = document.createElement("li");
    li.innerText = `${i + 1}. ${u.name}`;
    listEl.appendChild(li);
  });
}
