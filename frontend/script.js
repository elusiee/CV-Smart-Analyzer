const API_BASE = "http://127.0.0.1:8000";

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const analyzeTextBtn = document.getElementById("analyzeTextBtn");
const analyzePdfBtn = document.getElementById("analyzePdfBtn");
const cvText = document.getElementById("cvText");
const cvFile = document.getElementById("cvFile");
const statusBox = document.getElementById("status");
const resultSection = document.getElementById("resultSection");
const copyBtn = document.getElementById("copyBtn");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

function setStatus(message, isError = false) {
  statusBox.textContent = message;
  statusBox.className = isError ? "status error" : "status";
}

function renderList(elementId, items) {
  const el = document.getElementById(elementId);
  el.innerHTML = "";

  (items || []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
}

function renderResult(data) {
  document.getElementById("atsScore").textContent = data.ats_score ?? "--";
  document.getElementById("summary").textContent = data.professional_summary || "";

  renderList("strengths", data.strengths);
  renderList("weaknesses", data.weaknesses);
  renderList("missingSkills", data.missing_skills);
  renderList("suggestions", data.improvement_suggestions);
  renderList("roles", data.recommended_roles);

  resultSection.classList.remove("hidden");
}

function buildCopyText() {
  return `
CV SMART ANALYZER RESULT

ATS Score: ${document.getElementById("atsScore").textContent}

Professional Summary:
${document.getElementById("summary").textContent}

Strengths:
${[...document.querySelectorAll("#strengths li")].map(li => "- " + li.textContent).join("\n")}

Weaknesses:
${[...document.querySelectorAll("#weaknesses li")].map(li => "- " + li.textContent).join("\n")}

Missing Skills:
${[...document.querySelectorAll("#missingSkills li")].map(li => "- " + li.textContent).join("\n")}

Improvement Suggestions:
${[...document.querySelectorAll("#suggestions li")].map(li => "- " + li.textContent).join("\n")}

Recommended Roles:
${[...document.querySelectorAll("#roles li")].map(li => "- " + li.textContent).join("\n")}
`.trim();
}

copyBtn.addEventListener("click", async () => {
  const text = buildCopyText();
  await navigator.clipboard.writeText(text);
  setStatus("Result copied to clipboard.");
});

analyzeTextBtn.addEventListener("click", async () => {
  const text = cvText.value.trim();

  if (!text) {
    setStatus("Please paste CV text first.", true);
    return;
  }

  try {
    setStatus("Analyzing text CV...");
    const response = await fetch(`${API_BASE}/analyze-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cv_text: text }),
    });

    const result = await response.json();

    if (!result.success) {
      setStatus(result.error || "Analysis failed.", true);
      return;
    }

    renderResult(result.data);
    setStatus("Analysis completed.");
  } catch (error) {
    setStatus("Server error. Make sure backend is running.", true);
  }
});

analyzePdfBtn.addEventListener("click", async () => {
  const file = cvFile.files[0];

  if (!file) {
    setStatus("Please choose a PDF file first.", true);
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    setStatus("Uploading and analyzing PDF...");
    const response = await fetch(`${API_BASE}/analyze-pdf`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      setStatus(result.error || "PDF analysis failed.", true);
      return;
    }

    renderResult(result.data);
    setStatus("PDF analyzed successfully.");
  } catch (error) {
    setStatus("Server error. Make sure backend is running.", true);
  }
});
