// ================================
// ตัวแปร global
// ================================
const LIFF_ID = "2009890149-ANrtauwZ";
const MAX = 66;

let userProfile = null;

let data = {
  tue: [],
  thu: []
};

let joined = {
  tue: false,
  thu: false
};

// ================================
// รอ DOM + init LIFF
// ================================
document.addEventListener("DOMContentLoaded", () => {
  liff.init({ liffId: LIFF_ID })
    .then(async () => {
      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }

      userProfile = await liff.getProfile();
      console.log("LINE Profile:", userProfile);

      const lang = detectLanguage();
      loadLang(lang);

      function getNextDate(dayIndex) {
  const today = new Date();
  const result = new Date(today);
  const diff = (dayIndex + 7 - today.getDay()) % 7 || 7;
  result.setDate(today.getDate() + diff);
  return result;
}

function formatThaiDate(date) {
  const months = [
    "ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.",
    "ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

function updateDayLabels() {
  const tueDate = getNextDate(2); // Tuesday
  const thuDate = getNextDate(4); // Thursday

  document.getElementById("tueLabel").innerText =
    `อังคาร ${formatThaiDate(tueDate)} 09:00–11:00`;

  document.getElementById("thuLabel").innerText =
    `พฤหัส ${formatThaiDate(thuDate)} 09:00–11:00`;
}
      updateUI();
      function updateUI() {
  updateDayLabels();

  document.getElementById("tueCount").innerText = data.tue.length;
  document.getElementById("thuCount").innerText = data.thu.length;

  const tueBtn = document.getElementById("tueBtn");
  const thuBtn = document.getElementById("thuBtn");

  if (joined.tue) {
    tueBtn.disabled = true;
    tueBtn.style.opacity = 0.6;
  }

  if (joined.thu) {
    thuBtn.disabled = true;
    thuBtn.style.opacity = 0.6;
  }

  renderList("tue");
  renderList("thu");
}
    })
    .catch(err => console.error("LIFF error", err));
});

// ================================
// ตรวจภาษา
// ================================
function detectLanguage() {
  const lang = liff.getLanguage();
  if (lang && lang.startsWith("zh")) return "cn";
  if (lang === "en") return "en";
  return "th";
}

// ================================
// โหลดภาษา
// ================================
async function loadLang(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    const dataLang = await res.json();

    document.getElementById("title").innerText = dataLang.title;
    document.getElementById("desc").innerText = dataLang.desc;
  } catch (e) {
    console.error("Load lang error", e);
  }
}

// ================================
// กดลงชื่อ
// ================================
function joinDay(day) {
  if (!data[day] || joined[day]) return;

  if (data[day].length >= MAX) {
    document.getElementById("status").innerText = "❌ วันนี้เต็มแล้ว";
    return;
  }

  data[day].push({
    userId: userProfile.userId,
    name: userProfile.displayName
  });

  joined[day] = true;

  updateUI();
  document.getElementById("status").innerText = "✅ ลงชื่อเรียบร้อย";
}

// ================================
// อัปเดตหน้าเว็บ
// ================================
function updateUI() {
  document.getElementById("tueCount").innerText = data.tue.length;
  document.getElementById("thuCount").innerText = data.thu.length;

  const tueBtn = document.querySelector("button[onclick=\"joinDay('tue')\"]");
  const thuBtn = document.querySelector("button[onclick=\"joinDay('thu')\"]");

  if (joined.tue && tueBtn) {
    tueBtn.disabled = true;
    tueBtn.style.opacity = 0.6;
  }

  if (joined.thu && thuBtn) {
    thuBtn.disabled = true;
    thuBtn.style.opacity = 0.6;
  }

  renderList("tue");
  renderList("thu");
}

function renderList(day) {
  const listEl = document.getElementById(day + "List");
  if (!listEl) return;

  listEl.innerHTML = "";

  data[day].forEach((u, i) => {
    const li = document.createElement("li");
    li.innerText = `${i + 1}. ${u.name}`;
    listEl.appendChild(li);
  });
}
