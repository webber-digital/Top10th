import { CONFIG } from './config.js';
import { QUESTIONS } from './database.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
let state = { 
    user: null, 
    lang: 'en', 
    idx: 0, 
    activeQ: [...QUESTIONS],
    score: 0,
    streak: 0
};

// --- QUIZ ENGINE ---
function render() {
    if(state.idx >= state.activeQ.length) { 
        showLeaderboard();
        return; 
    }
    
    const q = state.activeQ[state.idx];
    document.getElementById('q-text').innerText = state.lang === 'en' ? q.q_en : q.q_hi;
    document.getElementById('q-idx').innerText = `QUESTION ${state.idx + 1}/${state.activeQ.length}`;
    
    const opts = state.lang === 'en' ? q.opts_en : q.opts_hi;
    const grid = document.getElementById('options');
    grid.innerHTML = '';
    
    opts.forEach(o => {
        const btn = document.createElement('button');
        btn.className = "glass p-6 rounded-3xl text-left transition-all duration-300 font-bold border border-white/5 hover:border-sky-500";
        btn.innerText = o;
        
        btn.onclick = () => {
            const allBtns = grid.querySelectorAll('button');
            allBtns.forEach(b => b.style.pointerEvents = 'none'); // Disable more clicks

            if(o === q.ans) {
                // ✅ CORRECT
                btn.style.background = "rgba(34, 197, 94, 0.2)";
                btn.style.borderColor = "#22c55e";
                state.score += 10;
                state.streak += 1;
            } else {
                // ❌ WRONG
                btn.style.background = "rgba(239, 44, 44, 0.2)";
                btn.style.borderColor = "#ef2c2c";
                state.streak = 0;
                // Show Correct Answer
                allBtns.forEach(b => {
                    if(b.innerText === q.ans) b.style.borderColor = "#22c55e";
                });
            }

            updateStats();
            setTimeout(() => { state.idx++; render(); }, 1000);
        };
        grid.appendChild(btn);
    });
}

function updateStats() {
    document.getElementById('score').innerText = state.score;
    document.getElementById('streak').innerText = state.streak;
}

function showLeaderboard() {
    document.getElementById('quiz-container').innerHTML = `
        <div class="text-center p-10 glass rounded-[40px]">
            <h2 class="text-3xl font-black mb-4">🏆 FINISHED!</h2>
            <p class="text-gray-400 mb-8">You earned ${state.score} total points.</p>
            <div class="flex flex-col gap-3">
                <button onclick="location.reload()" class="py-4 bg-sky-500 text-black font-black rounded-2xl">PLAY AGAIN</button>
            </div>
        </div>
    `;
}

// Auth State Sync
supabase.auth.onAuthStateChange((event, session) => {
    if(session) {
        state.user = session.user;
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');
        render();
    }
});
