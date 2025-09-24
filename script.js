const form = document.getElementById("surveyForm");
const q0 = document.getElementById("q0");
const q0Other = document.getElementById("q0Other");
const q1Options = document.querySelectorAll("#q1Options .option");
const q2Section = document.getElementById("q2Section");
const q2Other = document.getElementById("q2Other");
const thankYou = document.getElementById("thankYou");
const againBtn = document.getElementById("againBtn");

let q1Value = "";
let q2Value = "";

const GAS_URL = "https://script.google.com/macros/s/AKfycbwCxw16FGp4KkN4-DNR_gEqbuJIhGG43O_nPDhGbe_siEMjyMHJPoeWsEEmbFHS-5nJ/exec"; // 🔹 ใส่ URL Web App ที่ Deploy จาก Apps Script

// Q0 logic
q0.addEventListener("change", () => {
  if (q0.value === "อื่นๆ") {
    q0Other.classList.remove("hidden");
  } else {
    q0Other.classList.add("hidden");
    q0Other.value = "";
  }
  document.getElementById("q0Error").classList.add("hidden");
});

// Q1 logic
q1Options.forEach(opt => {
  opt.addEventListener("click", () => {
    q1Options.forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    q1Value = opt.dataset.value;
    document.getElementById("q1Error").classList.add("hidden");

    if (Number(q1Value) < 3) {
      q2Section.classList.remove("hidden");
    } else {
      q2Section.classList.add("hidden");
      q2Value = "";
      q2Other.value = "";
      q2Other.classList.add("hidden");
      document.querySelectorAll('input[name="q2"]').forEach(r => r.checked = false);
    }
  });
});

// Q2 logic
document.querySelectorAll('input[name="q2"]').forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "อื่นๆ") {
      q2Other.classList.remove("hidden");
    } else {
      q2Other.classList.add("hidden");
      q2Other.value = "";
    }
    q2Value = radio.value;
  });
});

// Submit form
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // ✅ Validation
  let valid = true;
  const finalQ0 = q0.value === "อื่นๆ" ? q0Other.value.trim() : q0.value;
  const finalQ2 = q2Value === "อื่นๆ" ? q2Other.value.trim() : q2Value;

  if (!finalQ0) {
    document.getElementById("q0Error").classList.remove("hidden");
    valid = false;
  }
  if (!q1Value) {
    document.getElementById("q1Error").classList.remove("hidden");
    valid = false;
  }
  if (Number(q1Value) < 3 && !finalQ2) {
    document.getElementById("q2Error").classList.remove("hidden");
    valid = false;
  }

  if (!valid) return;

  const payload = {
    q0: finalQ0 || "",
    q1: q1Value,
    q2: finalQ2 || "",
    q3: document.getElementById("q3").value.trim()
  };

  // ✅ ไปหน้า Thank You ทันที
  form.classList.add("hidden");
  thankYou.classList.remove("hidden");

  // Reset form
  form.reset();
  q1Options.forEach(o => o.classList.remove("active"));
  q1Value = "";
  q2Value = "";
  q2Section.classList.add("hidden");
  q2Other.classList.add("hidden");

  // ✅ ส่งข้อมูลไปเบื้องหลัง (ไม่ต้องรอผลลัพธ์)
  fetch(GAS_URL + "?cachebust=" + new Date().getTime(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(payload)
  }).catch(err => {
    console.error("ส่งข้อมูลไม่สำเร็จ (background)", err);
  });
});

// ทำใหม่
againBtn.addEventListener("click", function () {
  thankYou.classList.add("hidden");
  form.classList.remove("hidden");
});
