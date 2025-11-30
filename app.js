/* =====================================================
   APP.JS — MAIN SCRIPT
   Navigasi • Quiz • Rekap • Editor AI • Infografis SVG
===================================================== */

/* ------------------------------------------
   1. NAVIGATION
------------------------------------------- */
const navBtns = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.panel');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    panels.forEach(p => p.classList.remove('active'));
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

/* ------------------------------------------
   2. MINDMAP (Modul 1)
------------------------------------------- */
function loadMindmap() {
  const target = document.getElementById("mindmap");
  if (!target) return;

  target.innerHTML = `
    <svg width="100%" height="260">
      <circle cx="150" cy="130" r="45" fill="#4a90e2"></circle>
      <text x="150" y="135" text-anchor="middle" fill="white" font-size="14">Surat Lamaran</text>

      <line x1="200" y1="130" x2="300" y2="80" stroke="#777" stroke-width="2"></line>
      <text x="305" y="85" font-size="13">Struktur</text>

      <line x1="200" y1="140" x2="300" y2="130" stroke="#777" stroke-width="2"></line>
      <text x="305" y="135" font-size="13">Bahasa</text>

      <line x1="200" y1="150" x2="300" y2="180" stroke="#777" stroke-width="2"></line>
      <text x="305" y="185" font-size="13">Tujuan</text>
    </svg>
  `;
}

/* ------------------------------------------
   3. INFOGRAFIK ANIMASI (Modul 2)
------------------------------------------- */
function loadInfographic() {
  const target = document.getElementById("infographic");
  if (!target) return;

  target.innerHTML = `
    <svg width="100%" height="300">
      <rect x="20" y="20" width="200" height="40" fill="#ffe082">
        <animate attributeName="x" from="-300" to="20" dur="1s" fill="freeze" />
      </rect>
      <text x="30" y="45" font-size="14">1. Tanggal & Tempat</text>

      <rect x="20" y="80" width="200" height="40" fill="#ffcc80">
        <animate attributeName="x" from="-300" to="20" dur="1.2s" fill="freeze" />
      </rect>
      <text x="30" y="105" font-size="14">2. Alamat Tujuan</text>

      <rect x="20" y="140" width="200" height="40" fill="#ffab91">
        <animate attributeName="x" from="-300" to="20" dur="1.4s" fill="freeze" />
      </rect>
      <text x="30" y="165" font-size="14">3. Salam Pembuka</text>

      <rect x="20" y="200" width="200" height="40" fill="#bcaaa4">
        <animate attributeName="x" from="-300" to="20" dur="1.6s" fill="freeze" />
      </rect>
      <text x="30" y="225" font-size="14">4. Isi Surat</text>
    </svg>
  `;
}

/* ------------------------------------------
   4. QUIZ SYSTEM
------------------------------------------- */
const quizArea = document.getElementById('quizArea');
const startQuizBtn = document.getElementById('startQuiz');

let currentQuiz = null;

function renderQuizList() {
  if (!quizArea) return;
  quizArea.innerHTML = '';

  QUIZ_DATA.forEach((quiz, qi) => {
    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('h3');
    title.textContent = quiz.title;
    card.appendChild(title);

    const btn = document.createElement('button');
    btn.textContent = "Mulai";
    btn.addEventListener('click', () => startQuiz(qi));
    card.appendChild(btn);

    quizArea.appendChild(card);
  });
}

function startQuiz(index) {
  currentQuiz = JSON.parse(JSON.stringify(QUIZ_DATA[index]));
  showQuiz(currentQuiz);
}

function showQuiz(quiz) {
  quizArea.innerHTML = '';

  const form = document.createElement('form');
  form.id = 'quizForm';

  quiz.questions.forEach((q, i) => {
    const qdiv = document.createElement('div');
    qdiv.className = 'question card';

    qdiv.innerHTML = `<strong>${i + 1}. ${q.q}</strong>`;

    // multiple choice
    if (q.type === 'mcq') {
      q.choices.forEach((c, ci) => {
        const label = document.createElement('label');
        label.className = "quiz-option";

        const inp = document.createElement('input');
        inp.type = 'radio';
        inp.name = q.id;
        inp.value = ci;

        label.appendChild(inp);
        label.append(" " + c);
        qdiv.appendChild(label);
      });
    }

    // short answer
    else if (q.type === 'short') {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.name = q.id;
      inp.className = "quiz-input";
      qdiv.appendChild(inp);
    }

    form.appendChild(qdiv);
  });

  const submit = document.createElement('button');
  submit.type = "button";
  submit.textContent = "Submit Jawaban";
  submit.addEventListener('click', () => submitQuiz(quiz));

  form.appendChild(submit);
  quizArea.appendChild(form);
}

function submitQuiz(quiz) {
  const form = document.getElementById('quizForm');
  const formData = new FormData(form);

  let total = 0;
  let score = 0;
  const details = [];

  quiz.questions.forEach(q => {
    total += q.points || 0;

    if (q.type === 'mcq') {
      const val = formData.get(q.id);
      const correct = (val !== null && Number(val) === q.answer);
      if (correct) score += q.points;
      details.push({ id: q.id, type: q.type, correct });
    }

    else if (q.type === 'short') {
      const val = (formData.get(q.id) || '').trim().toLowerCase();
      const correct = val === q.answerText.toLowerCase();
      if (correct) score += q.points;
      details.push({ id: q.id, type: q.type, correct, answerGiven: val });
    }
  });

  const percent = Math.round((score / total) * 100);

  const result = {
    quizId: quiz.id,
    title: quiz.title,
    total,
    score,
    percent,
    details,
    timestamp: new Date().toISOString()
  };

  saveResult(result);
  showResult(result);
}

function showResult(r) {
  quizArea.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h3>Hasil: ${r.title}</h3>
    <p>Skor: <strong>${r.score}/${r.total}</strong> (${r.percent}%)</p>
  `;

  const breakdown = document.createElement('div');
  breakdown.className = 'card';
  breakdown.innerHTML = `<h4>Rincian Jawaban</h4>`;

  r.details.forEach((d, i) => {
    const p = document.createElement('div');
    p.textContent = `${i + 1}. ${d.id} — ${d.correct ? "Benar" : "Salah"}`;
    breakdown.appendChild(p);
  });

  quizArea.appendChild(card);
  quizArea.appendChild(breakdown);
}

/* ------------------------------------------
   5. REKAP NILAI
------------------------------------------- */
const rekapArea = document.getElementById('rekapArea');

function renderRekap() {
  if (!rekapArea) return;

  const results = getResults();
  if (!results.length) {
    rekapArea.textContent = "Belum ada hasil.";
    return;
  }

  rekapArea.innerHTML = '';

  results.forEach(r => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <strong>${r.title}</strong>
      <div>Skor: ${r.score}/${r.total} (${r.percent}%)</div>
      <div><small>${new Date(r.timestamp).toLocaleString()}</small></div>
    `;
    rekapArea.appendChild(div);
  });
}

/* ------------------------------------------
   6. EXPORT JSON
------------------------------------------- */
if (document.getElementById('exportResults')) {
  document.getElementById('exportResults').addEventListener('click', () => {
    const data = JSON.stringify(getResults(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "rekap_quiz.json";
    a.click();

    URL.revokeObjectURL(url);
  });
}

/* ------------------------------------------
   7. EDITOR + GRAMMAR AI
------------------------------------------- */
const editor = document.getElementById('editor');
const grammarResults = document.getElementById('grammarResults');

if (document.getElementById('checkGrammar')) {
  document.getElementById('checkGrammar').addEventListener('click', async () => {
    const text = editor.value.trim();
    if (!text) {
      grammarResults.innerHTML = "<div class='card'>Teks masih kosong.</div>";
      return;
    }

    grammarResults.innerHTML = "Memeriksa...";
    const res = await checkTextWithServer(text);
    renderGrammar(res);
  });
}

function renderGrammar(res) {
  grammarResults.innerHTML = '';

  if (res.issues?.length) {
    res.issues.forEach(i => {
      const d = document.createElement('div');
      d.className = 'card';
      d.textContent = i.msg;
      grammarResults.appendChild(d);
    });
  }

  if (res.suggestions?.length) {
    const sugCard = document.createElement('div');
    sugCard.className = 'card';
    sugCard.innerHTML = `<h4>Saran Perbaikan</h4>`;

    res.suggestions.forEach(s => {
      const box = document.createElement('div');
      box.className = 'card';

      box.innerHTML = `
        <div><strong>Asal:</strong> ${s.original}</div>
        <div><strong>Usulan:</strong> ${s.rewrite}</div>
      `;

      const btn = document.createElement('button');
      btn.textContent = "Terapkan";
      btn.style.marginTop = "6px";
      btn.addEventListener('click', () => {
        editor.value = editor.value.replace(s.original, s.rewrite);
      });

      box.appendChild(btn);
      sugCard.appendChild(box);
    });

    grammarResults.appendChild(sugCard);
  }
}

/* ------------------------------------------
   8. DRAFT SAVING
------------------------------------------- */
if (document.getElementById('saveDraft')) {
  document.getElementById('saveDraft').addEventListener('click', () => {
    localStorage.setItem("draft_surat", editor.value);
    alert("Draf disimpan!");
  });
}

/* ------------------------------------------
   9. INITIAL LOAD
------------------------------------------- */
renderQuizList();
renderRekap();
loadMindmap();
loadInfographic();

/* Load saved draft */
const draft = localStorage.getItem("draft_surat");
if (draft && editor) editor.value = draft;
