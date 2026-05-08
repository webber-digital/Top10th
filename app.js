import { CONFIG } from './config.js';
import { QUESTIONS } from './database.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
let state = { user: null, name: '', score: 0, streak: 0, idx: 0 };

// --- LOGIN & SIGNUP LOGIC ---
document.getElementById('loginBtn').onclick = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;
    const nameInput = document.getElementById('user-name').value;

    if(!nameInput || !email || !password) return alert("Saari details bhariye!");

    // 1. Sign Up / Sign In
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if(data.user) {
        // 2. Profile create/update (Aapke naye columns ke hisaab se)
        await supabase.from('profiles').upsert({ 
            id: data.user.id, 
            full_name: nameInput, // Aapne DB mein yahi rakha hai
            email: email,         // Aapne DB mein yahi rakha hai
            xp: 0,
            streak: 0,
            solved: 0
        });
        alert("Account ban gaya! Ab login karein.");
        location.reload(); 
    } else if (error) {
        // Agar account pehle se hai toh direct login
        const { error: logErr } = await supabase.auth.signInWithPassword({ email, password });
        if(logErr) alert("Galti: " + logErr.message);
    }
};

// --- DATA LOAD ---
async function loadUserData(user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if(data) {
        state.name = data.full_name;
        document.getElementById('display-name').innerText = data.full_name.toUpperCase();
        document.getElementById('high-score').innerText = data.xp || 0; // XP ko high score ki tarah dikhayenge
    }
}

// --- QUIZ RENDER ---
function render() {
    if(state.idx >= QUESTIONS.length) {
        saveFinalData();
        return;
    }
    const q = QUESTIONS[state.idx];
    document.getElementById('q-text').innerText = q.q_hi;
    document.getElementById('q-idx').innerText = `Sawāl ${state.idx + 1}/${QUESTIONS.length}`;
    
    const grid = document.getElementById('options');
    grid.innerHTML = '';

    q.opts_hi.forEach(o => {
        const btn = document.createElement('button');
        btn.className = "glass p-5 rounded-3xl text-left font-bold transition-all hover:border-sky-500 hover:bg-white/5";
        btn.innerText = o;
        btn.onclick = () => {
            const allBtns = document.querySelectorAll('#options button');
            allBtns.forEach(b => b.style.pointerEvents = 'none');

            if(o === q.ans) {
                btn.style.borderColor = "#22c55e";
                btn.style.background = "rgba(34, 197, 94, 0.1)";
                state.score += 10;
                state.streak += 1;
            } else {
                btn.style.borderColor = "#ef4444";
                btn.style.background = "rgba(239, 68, 68, 0.1)";
                state.streak = 0;
                allBtns.forEach(b => { if(b.innerText === q.ans) b.style.borderColor = "#22c55e"; });
            }
            document.getElementById('streak-tag').innerText = `STREAK: ${state.streak} 🔥`;
            setTimeout(() => { state.idx++; render(); }, 1000);
        };
        grid.appendChild(btn);
    });
}

// --- SAVE DATA TO SUPABASE ---
async function saveFinalData() {
    document.getElementById('quiz-box').innerHTML = `
        <div class="text-center py-10">
            <h2 class="text-4xl font-black mb-2 text-sky-400">SHABAASH! 🏆</h2>
            <p class="text-gray-400">Aapne total <b>${state.score} XP</b> kamaye!</p>
            <button onclick="location.reload()" class="mt-8 px-10 py-4 bg-sky-500 text-black font-black rounded-2xl">Fir se kheleinn</button>
        </div>
    `;

    // Aapke photo wale columns ke hisaab se update
    await supabase.from('profiles').update({ 
        xp: state.score,          
        streak: state.streak,      
        solved: QUESTIONS.length   
    }).eq('id', state.user.id);
}

// Auth Listener
supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
        state.user = session.user;
        await loadUserData(session.user);
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');
        render();
    }
});
