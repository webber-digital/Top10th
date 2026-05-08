import { CONFIG } from './config.js';
import { QUESTIONS } from './database.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
let state = { user: null, lang: 'en', idx: 0, activeQ: [...QUESTIONS] };

// Login Handling
document.getElementById('loginBtn').onclick = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) alert(error.message);
};

// PDF Viewer Logic (View Only)
window.viewFreePdf = () => {
    const frame = document.getElementById('pdf-frame');
    const pdfUrl = encodeURIComponent(window.location.origin + '/normal-notes.pdf');
    frame.src = `https://docs.google.com/viewer?url=${pdfUrl}&embedded=true`;
    document.getElementById('pdf-modal').classList.remove('hidden');
};

window.handlePremium = async () => {
    if(!state.user) return alert("Please Login!");
    const { data } = await supabase.from('users').select('is_premium').eq('id', state.user.id).single();
    if(data?.is_premium) {
        const frame = document.getElementById('pdf-frame');
        const pdfUrl = encodeURIComponent(window.location.origin + '/premium-notes.pdf');
        frame.src = `https://docs.google.com/viewer?url=${pdfUrl}&embedded=true`;
        document.getElementById('pdf-modal').classList.remove('hidden');
    } else {
        alert("🔒 Content Locked! Admin will unlock manually.");
    }
};

window.closePdf = () => document.getElementById('pdf-modal').classList.add('hidden');

function render() {
    if(state.idx >= state.activeQ.length) { document.getElementById('q-text').innerText = "All Done!"; return; }
    const q = state.activeQ[state.idx];
    document.getElementById('q-text').innerText = state.lang === 'en' ? q.q_en : q.q_hi;
    document.getElementById('q-idx').innerText = `Question ${state.idx + 1}/${state.activeQ.length}`;
    
    const opts = state.lang === 'en' ? q.opts_en : q.opts_hi;
    const grid = document.getElementById('options');
    grid.innerHTML = '';
    
    opts.forEach(o => {
        const btn = document.createElement('button');
        btn.className = "glass p-6 rounded-3xl text-left hover:border-sky-500 transition font-bold";
        btn.innerText = o;
        btn.onclick = () => { state.idx++; render(); };
        grid.appendChild(btn);
    });
}

// Auth Sync
supabase.auth.onAuthStateChange((event, session) => {
    if(session) {
        state.user = session.user;
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');
        render();
    }
});
