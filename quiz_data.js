// Quiz data definition (multiple quizzes supported)
const QUIZ_DATA = [
  {
    id: 'quiz1',
    title: 'Dasar Struktur Surat',
    questions: [
      { id: 'q1', q: 'Bagian surat yang berisi perkenalan dan tujuan melamar adalah...', type: 'mcq', choices: ['Salam pembuka', 'Paragraf pembuka', 'Penutup', 'Alamat tujuan'], answer: 1, points: 10 },
      { id: 'q2', q: 'Pilihan kata yang tepat dalam surat resmi sebaiknya...', type: 'mcq', choices: ['Informal dan singkat','Baku dan sopan','Bebas dan santai','Panjang tanpa jeda'], answer: 1, points: 10 },
      { id: 'q3', q: 'Sebutkan satu bagian penting selain isi, salam, dan penutup (jawab singkat)', type: 'short', answerText: 'Tempat & Tanggal', points: 10 }
    ]
  },
  {
    id: 'quiz2',
    title: 'Penggunaan Bahasa Resmi',
    questions: [
      { id: 'q1', q: 'Kata "kamu" dalam surat resmi sebaiknya diganti menjadi...', type: 'short', answerText: 'Anda', points: 10 },
      { id: 'q2', q: 'Apakah "Dengan hormat" termasuk salam pembuka? (ya/tidak)', type: 'short', answerText: 'ya', points: 10 }
    ]
  }
];

// Utility: save quiz results to localStorage
function saveResult(result) {
  const key = 'quiz_results_v1';
  const store = JSON.parse(localStorage.getItem(key) || '[]');
  store.push(result);
  localStorage.setItem(key, JSON.stringify(store));
}

function getResults(){
  return JSON.parse(localStorage.getItem('quiz_results_v1') || '[]');
}
