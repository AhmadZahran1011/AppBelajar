// Quiz data definition (multiple quizzes supported)
const QUIZ_DATA = [
  /* ============================================================
     QUIZ 1 — Pemahaman Dasar Surat Lamaran Pekerjaan
  ============================================================ */
  {
    id: 'quiz1',
    title: 'Pendahuluan: Fungsi & Tujuan Surat Lamaran',
    questions: [
      {
        id: 'q1',
        q: 'Apa tujuan utama dari surat lamaran pekerjaan?',
        type: 'mcq',
        choices: [
          'Mengajukan permohonan izin kepada perusahaan',
          'Memperkenalkan diri dan menunjukkan minat terhadap posisi kerja',
          'Mengajukan komplain terhadap perusahaan',
          'Memberikan laporan kerja bulanan'
        ],
        answer: 1,
        points: 10
      },
      {
        id: 'q2',
        q: 'Surat lamaran pekerjaan termasuk jenis surat...',
        type: 'mcq',
        choices: [
          'Surat pribadi',
          'Surat resmi',
          'Surat elektronik santai',
          'Surat undangan informal'
        ],
        answer: 1,
        points: 10
      },
      {
        id: 'q3',
        q: 'Sebutkan media umum yang dapat menjadi sumber informasi lowongan (jawab singkat).',
        type: 'short',
        answerText: 'JobStreet',
        points: 10
      }
    ]
  },

  /* ============================================================
     QUIZ 2 — Struktur Surat Lamaran
  ============================================================ */
  {
    id: 'quiz2',
    title: 'Struktur Surat Lamaran Pekerjaan',
    questions: [
      {
        id: 'q1',
        q: 'Bagian surat yang berisi identitas pelamar, kemampuan, dan alasan melamar adalah...',
        type: 'mcq',
        choices: [
          'Paragraf isi',
          'Penutup',
          'Salam pembuka',
          'Alamat surat'
        ],
        answer: 0,
        points: 10
      },
      {
        id: 'q2',
        q: 'Contoh tempat & tanggal surat yang benar adalah...',
        type: 'mcq',
        choices: [
          'Bandung; 30-11-25',
          'Bandung, 30 November 2025',
          '30 November 2025 Bandung',
          'Bandung/30/11/2025'
        ],
        answer: 1,
        points: 10
      },
      {
        id: 'q3',
        q: 'Tulis salah satu bagian penting struktur surat selain pembuka dan penutup (jawab singkat)',
        type: 'short',
        answerText: 'Alamat surat',
        points: 10
      }
    ]
  },

  /* ============================================================
     QUIZ 3 — Ciri Kebahasaan (Bahasa Formal & PUEBI)
  ============================================================ */
  {
    id: 'quiz3',
    title: 'Ciri Kebahasaan dalam Surat Lamaran',
    questions: [
      {
        id: 'q1',
        q: 'Bahasa dalam surat lamaran harus bersifat...',
        type: 'mcq',
        choices: ['Formal dan baku', 'Bebas dan santai', 'Informal', 'Campuran bebas'],
        answer: 0,
        points: 10
      },
      {
        id: 'q2',
        q: 'Kata yang tepat untuk surat resmi adalah...',
        type: 'mcq',
        choices: ['nggak', 'gimana', 'tidak', 'kamu'],
        answer: 2,
        points: 10
      },
      {
        id: 'q3',
        q: 'Apakah singkatan tidak baku boleh digunakan dalam surat lamaran? (ya/tidak)',
        type: 'short',
        answerText: 'tidak',
        points: 10
      }
    ]
  }
];



/* ============================================================
   STORAGE HANDLER (LocalStorage)
============================================================ */
function saveResult(result) {
  const key = 'quiz_results_v1';
  const store = JSON.parse(localStorage.getItem(key) || '[]');
  store.push(result);
  localStorage.setItem(key, JSON.stringify(store));
}

function getResults(){
  return JSON.parse(localStorage.getItem('quiz_results_v1') || '[]');
}
