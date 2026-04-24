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

      updateUI();
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
  if (!userProfile || !data[day]) return;

  // กันกดซ้ำ
  const exists = data[day].some(
    u => u.userId === userProfile.userId
  );

  if (exists) {
    document.getElementById("status").innerText =
      "⚠️ คุณลงชื่อวันนี้แล้ว";
    return;
  }

  if (data[day].length >= MAX) {
    document.getElementById("status").innerText =
      "❌ วันนี้เต็มแล้ว";
    return;
  }

  data[day].push({
    userId: userProfile.userId,
    name: userProfile.displayName
  });

  updateUI();
  document.getElementById("status").innerText =
    `✅ ลงชื่อ ${userProfile.displayName} เรียบร้อย`;
}

// ================================
// อัปเดตหน้าเว็บ
// ================================
function updateUI() {
  document.getElementById("tueCount").innerText = data.tue.length;
  document.getElementById("thuCount").innerText = data.thu.length;

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
