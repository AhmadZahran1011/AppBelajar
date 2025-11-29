// ai_service.js
// Simulated AI grammar checker. Integrator: replace `checkTextWithServer` with real API call.

async function checkGrammarServer(text) {
  // Simulate call latency
  await new Promise(r => setTimeout(r, 400));

  // Heuristic checks plus simulated AI improvements
  const issues = [];

  // 1. double spaces
  if (/  +/.test(text)) issues.push({type:'spacing', msg:'Terdapat spasi ganda'});

  // 2. informal words
  const informal = ['halo','gimana','kamu','gw','gue','nanti'];
  informal.forEach(w=>{ const re = new RegExp('\\b'+w+'\\b','ig'); if(re.test(text)) issues.push({type:'informal', msg:`Gunakan bahasa baku menggantikan kata: ${w}`}) });

  // 3. passive suggestions (example)
  if (/saya yang bertanda tangan di bawah ini/i.test(text)) issues.push({type:'style', msg:'Pertimbangkan menyederhanakan kalimat pembuka agar lebih langsung.'});

  // 4. simulated rewrite suggestion (AI)
  const suggestions = [];
  if (text.length > 40) {
    suggestions.push({original: text.slice(0,60) + '...', rewrite: 'Saya bermaksud mengajukan surat lamaran untuk posisi ... di perusahaan Bapak/Ibu. Saya memiliki pengalaman relevan.'});
  }

  return {issues, suggestions};
}

// Public wrapper used by app.js
async function checkTextWithServer(text){
  // Replace this with fetch POST to your grammar API endpoint.
  // Example:
  // const res = await fetch('/api/grammar', {method:'POST', body: JSON.stringify({text}), headers:{'Content-Type':'application/json'}});
  // return res.json();

  return await checkGrammarServer(text);
}
