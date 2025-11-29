// Main app script: controls navigation, quiz rendering, scoring, editor + AI calls

// NAV
const navBtns = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.panel');
navBtns.forEach(btn => btn.addEventListener('click', ()=>{
  navBtns.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  panels.forEach(p=>p.classList.remove('active'));
  document.getElementById(btn.dataset.target).classList.add('active');
}));

// QUIZ: render quiz list and handle multi-question with rekap
const quizArea = document.getElementById('quizArea');
const startQuizBtn = document.getElementById('startQuiz');
let currentQuiz = null;

function renderQuizList(){
  quizArea.innerHTML = '';
  QUIZ_DATA.forEach((quiz, qi)=>{
    const card = document.createElement('div'); card.className='card';
    const title = document.createElement('h3'); title.textContent = quiz.title; card.appendChild(title);
    const btn = document.createElement('button'); btn.textContent = 'Mulai'; btn.addEventListener('click', ()=>startQuiz(qi));
    card.appendChild(btn);
    quizArea.appendChild(card);
  });
}

function startQuiz(index){
  currentQuiz = JSON.parse(JSON.stringify(QUIZ_DATA[index])); // clone
  showQuiz(currentQuiz);
}

function showQuiz(quiz){
  quizArea.innerHTML = '';
  const form = document.createElement('form'); form.id='quizForm';
  quiz.questions.forEach((q, i)=>{
    const qdiv = document.createElement('div'); qdiv.className='question card';
    const qtitle = document.createElement('div'); qtitle.innerHTML = `<strong>${i+1}. ${q.q}</strong>`;
    qdiv.appendChild(qtitle);

    if (q.type === 'mcq'){
      q.choices.forEach((c,ci)=>{
        const label = document.createElement('label'); label.style.display='block';
        const inp = document.createElement('input'); inp.type='radio'; inp.name=q.id; inp.value=ci;
        label.appendChild(inp); label.append(' '+c);
        qdiv.appendChild(label);
      });
    } else if (q.type === 'short'){
      const inp = document.createElement('input'); inp.type='text'; inp.name=q.id; inp.style.width='100%'; inp.style.padding='8px'; inp.style.marginTop='6px';
      qdiv.appendChild(inp);
    }
    form.appendChild(qdiv);
  });

  const submit = document.createElement('button'); submit.type='button'; submit.textContent='Submit Jawaban'; submit.addEventListener('click', ()=>submitQuiz(quiz));
  form.appendChild(submit);
  quizArea.appendChild(form);
}

function submitQuiz(quiz){
  const form = document.getElementById('quizForm');
  const formData = new FormData(form);
  let total = 0; let score = 0; const details = [];
  quiz.questions.forEach(q=>{
    total += q.points || 0;
    if (q.type === 'mcq'){
      const val = formData.get(q.id);
      const correct = (val !== null && Number(val) === q.answer);
      if (correct) score += q.points;
      details.push({id:q.id, type:q.type, correct});
    } else if (q.type === 'short'){
      const val = (formData.get(q.id) || '').trim().toLowerCase();
      const correct = q.answerText ? (val === q.answerText.toLowerCase()) : false;
      if (correct) score += q.points;
      details.push({id:q.id, type:q.type, correct, answerGiven: val});
    }
  });

  const percent = Math.round((score/total)*100);
  const result = {quizId: quiz.id, title: quiz.title, total, score, percent, details, timestamp: new Date().toISOString()};
  saveResult(result);
  showResult(result);
}

function showResult(res){
  quizArea.innerHTML = '';
  const card = document.createElement('div'); card.className='card';
  card.innerHTML = `<h3>Hasil: ${res.title}</h3><p>Skor: ${res.score}/${res.total} (${res.percent}%)</p>`;
  const breakdown = document.createElement('div'); breakdown.className='card'; breakdown.innerHTML = '<h4>Rincian</h4>';
  res.details.forEach((d,i)=>{ const p = document.createElement('div'); p.textContent = `${i+1}. ${d.id} — ${d.correct ? 'Benar' : 'Salah'}`; breakdown.appendChild(p); });
  quizArea.appendChild(card); quizArea.appendChild(breakdown);
}

// Rekap
const rekapArea = document.getElementById('rekapArea');
function renderRekap(){
  const results = getResults();
  if (!results.length) { rekapArea.textContent = 'Belum ada hasil.'; return; }
  rekapArea.innerHTML = '';
  results.forEach(r=>{
    const div = document.createElement('div'); div.className='card';
    div.innerHTML = `<strong>${r.title}</strong><div>Skor: ${r.score}/${r.total} (${r.percent}%)</div><div><small>${new Date(r.timestamp).toLocaleString()}</small></div>`;
    rekapArea.appendChild(div);
  });
}

// Export hasil
document.getElementById('exportResults').addEventListener('click', ()=>{
  const data = JSON.stringify(getResults(), null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'rekap_quiz.json'; a.click();
  URL.revokeObjectURL(url);
});

// Editor + AI
const editor = document.getElementById('editor');
const grammarResults = document.getElementById('grammarResults');
document.getElementById('checkGrammar').addEventListener('click', async ()=>{
  const text = editor.value;
  grammarResults.innerHTML = 'Memeriksa...';
  const res = await checkTextWithServer(text);
  renderGrammar(res);
});

function renderGrammar(res){
  grammarResults.innerHTML = '';
  if (res.issues && res.issues.length){
    res.issues.forEach(i=>{ const d=document.createElement('div'); d.className='card'; d.textContent = i.msg; grammarResults.appendChild(d); });
  }
  if (res.suggestions && res.suggestions.length){
    const sugCard = document.createElement('div'); sugCard.className='card'; sugCard.innerHTML = '<h4>Saran Perbaikan</h4>';
    res.suggestions.forEach(s=>{ const p=document.createElement('div'); p.className='card'; p.innerHTML = `<div><strong>Asal:</strong> ${s.original}</div><div><strong>Usulan:</strong> ${s.rewrite}</div>`; const btn = document.createElement('button'); btn.style.marginTop='6px'; btn.textContent='Terapkan saran'; btn.addEventListener('click', ()=>{ editor.value = editor.value.replace(s.original.split('...')[0], s.rewrite); }); p.appendChild(btn); sugCard.appendChild(p); });
    grammarResults.appendChild(sugCard);
  }
}

// Save draft
document.getElementById('saveDraft').addEventListener('click', ()=>{ localStorage.setItem('draft_surat', editor.value); alert('Draf disimpan.'); });

// init
renderQuizList(); renderRekap();

// load draft if exists
const draft = localStorage.getItem('draft_surat'); if (draft) editor.value = draft;
