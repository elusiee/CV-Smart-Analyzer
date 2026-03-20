const API_BASE = "https://api.alonsome.tech";

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const analyzeTextBtn = document.getElementById("analyzeTextBtn");
const analyzePdfBtn = document.getElementById("analyzePdfBtn");
const cvText = document.getElementById("cvText");
const cvFile = document.getElementById("cvFile");
const statusBox = document.getElementById("status");
const resultSection = document.getElementById("resultSection");
const copyBtn = document.getElementById("copyBtn");

const extractPdfBtn = document.getElementById("extractPdfBtn");
const extractedCvText = document.getElementById("extractedCvText");
const extractSection = document.getElementById("extractSection");
const copyExtractedTextBtn = document.getElementById("copyExtractedTextBtn");

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

// Job Match
const matchBtn = document.getElementById("matchBtn");

matchBtn.addEventListener("click", async () => {
  const cv = document.getElementById("matchCv").value;
  const job = document.getElementById("jobDesc").value;

  if (!cv || !job) {
    alert("Please fill both fields");
    return;
  }

  const formData = new FormData();
  formData.append("cv_text", cv);
  formData.append("job_desc", job);

  const res = await fetch(`${API_BASE}/match-job`, {
    method: "POST",
    body: formData,
  });

  const result = await res.json();

  const data = result.data;

  document.getElementById("matchResult").innerHTML = `
    <h3>Match Score: ${data.match_score}</h3>
    <p><strong>Matched Skills:</strong> ${data.matched_skills.join(", ")}</p>
    <p><strong>Missing Skills:</strong> ${data.missing_skills.join(", ")}</p>
    <p><strong>Suggestions:</strong> ${data.improvement_suggestions.join(", ")}</p>
  `;
});

extractPdfBtn.addEventListener("click", async () => {
  const file = cvFile.files[0];

  if (!file) {
    setStatus("Please choose a PDF file first.", true);
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    setStatus("Extracting CV text from PDF...");

    const response = await fetch(`${API_BASE}/extract-pdf-text`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      setStatus(result.error || "Failed to extract PDF text.", true);
      return;
    }

    extractedCvText.value = result.cv_text || "";
    extractSection.classList.remove("hidden");
    setStatus("CV text extracted successfully. You can now copy it.");
  } catch (error) {
    console.error("Extract PDF text error:", error);
    setStatus(`Server error: ${error.message}`, true);
  }
});

copyExtractedTextBtn.addEventListener("click", async () => {
  const text = extractedCvText.value.trim();

  if (!text) {
    setStatus("No extracted CV text to copy.", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus("Extracted CV text copied to clipboard.");
  } catch (error) {
    console.error("Copy error:", error);
    setStatus("Failed to copy CV text.", true);
  }
});