// app.js

import { CONFIG } from "./config.js";
import { QUESTIONS } from "./database.js";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY
);

// ======================
// STATE
// ======================

const state = {
  user: null,
  profile: null,

  currentQuestion: 0,
  score: 0,
  streak: 0,

  language: "hi",

  questions: shuffleArray([...QUESTIONS]),
};

// ======================
// ELEMENTS
// ======================

const authView = document.getElementById("auth-view");
const appView = document.getElementById("app-view");

const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");

const loginStep1 = document.getElementById("login-step");
const signupStep1 = document.getElementById("signup-step-1");
const signupStep2 = document.getElementById("signup-step-2");

const gotoSignupStep2 =
  document.getElementById("goto-signup-step-2");

const createAccountBtn =
  document.getElementById("createAccountBtn");

const loginBtn =
  document.getElementById("loginBtn");

const qText = document.getElementById("q-text");
const optionsBox =
  document.getElementById("options");

const qIdx =
  document.getElementById("q-idx");

const streakTag =
  document.getElementById("streak-tag");

const displayName =
  document.getElementById("display-name");

const highScore =
  document.getElementById("high-score");

// ======================
// TAB SWITCH
// ======================

loginTab?.addEventListener("click", () => {

  loginTab.classList.add(
    "bg-sky-500",
    "text-black"
  );

  signupTab.classList.remove(
    "bg-sky-500",
    "text-black"
  );

  loginStep1.classList.remove("hidden");

  signupStep1.classList.add("hidden");
  signupStep2.classList.add("hidden");

});

signupTab?.addEventListener("click", () => {

  signupTab.classList.add(
    "bg-sky-500",
    "text-black"
  );

  loginTab.classList.remove(
    "bg-sky-500",
    "text-black"
  );

  loginStep1.classList.add("hidden");

  signupStep1.classList.remove("hidden");
  signupStep2.classList.add("hidden");

});

// ======================
// SIGNUP STEP 1
// ======================

gotoSignupStep2?.addEventListener(
  "click",
  () => {

    const email =
      document
        .getElementById("signup-email")
        .value
        .trim();

    const password =
      document
        .getElementById("signup-password")
        .value
        .trim();

    if (!email || !password) {
      alert("Email & password daalo");
      return;
    }

    if (password.length < 6) {
      alert("Password minimum 6 characters");
      return;
    }

    signupStep1.classList.add("hidden");
    signupStep2.classList.remove("hidden");

  }
);

// ======================
// CREATE ACCOUNT
// ======================

createAccountBtn?.addEventListener(
  "click",
  async () => {

    const email =
      document
        .getElementById("signup-email")
        .value
        .trim();

    const password =
      document
        .getElementById("signup-password")
        .value
        .trim();

    const fullName =
      document
        .getElementById("signup-name")
        .value
        .trim();

    const username =
      document
        .getElementById("signup-username")
        .value
        .trim();

    if (
      !fullName ||
      !username
    ) {
      alert("Name & username daalo");
      return;
    }

    createAccountBtn.disabled = true;
    createAccountBtn.innerText =
      "Creating...";

    try {

      // AUTH CREATE

      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (error) throw error;

      const user = data.user;

      if (!user) {
        throw new Error(
          "User create failed"
        );
      }

      // PROFILE INSERT

      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .insert({
          id: user.id,

          full_name: fullName,

          username: username,

          email: email,

          xp: 0,

          streak: 0,

          solved: 0,

          premium: false,
        });

      if (profileError)
        throw profileError;

      alert(
        "Account created successfully ✅"
      );

      signupStep2.classList.add("hidden");

      loginStep1.classList.remove(
        "hidden"
      );

      loginTab.classList.add(
        "bg-sky-500",
        "text-black"
      );

      signupTab.classList.remove(
        "bg-sky-500",
        "text-black"
      );

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

    createAccountBtn.disabled = false;

    createAccountBtn.innerText =
      "Create Account 🚀";

  }
);

// ======================
// LOGIN
// ======================

loginBtn?.addEventListener(
  "click",
  async () => {

    const email =
      document
        .getElementById("login-email")
        .value
        .trim();

    const password =
      document
        .getElementById("login-password")
        .value
        .trim();

    if (!email || !password) {
      alert(
        "Email & password daalo"
      );
      return;
    }

    loginBtn.disabled = true;

    loginBtn.innerText =
      "Loading...";

    try {

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw error;

      state.user = data.user;

      await loadProfile();

      showApp();

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

    loginBtn.disabled = false;

    loginBtn.innerText =
      "Login";

  }
);

// ======================
// LOAD PROFILE
// ======================

async function loadProfile() {

  const { data, error } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", state.user.id)
      .single();

  if (error) {
    console.error(error);
    return;
  }

  state.profile = data;

  displayName.innerText =
    data.full_name || "Student";

  highScore.innerText =
    data.xp || 0;

}

// ======================
// SHOW APP
// ======================

function showApp() {

  authView.classList.add("hidden");

  appView.classList.remove("hidden");

  renderQuestion();

}

// ======================
// RENDER QUESTION
// ======================

function renderQuestion() {

  if (
    state.currentQuestion >=
    state.questions.length
  ) {

    finishQuiz();

    return;

  }

  const q =
    state.questions[
      state.currentQuestion
    ];

  qIdx.innerText =
    `Question ${
      state.currentQuestion + 1
    }/${state.questions.length}`;

  qText.innerText =
    state.language === "hi"
      ? q.q_hi
      : q.q_en;

  streakTag.innerText =
    `STREAK: ${state.streak} 🔥`;

  optionsBox.innerHTML = "";

  const options =
    state.language === "hi"
      ? q.opts_hi
      : q.opts_en;

  options.forEach((option) => {

    const btn =
      document.createElement("button");

    btn.className = `
      glass
      p-5
      rounded-3xl
      text-left
      font-bold
      transition-all
      hover:border-sky-500
      hover:bg-white/5
      active:scale-[0.98]
    `;

    btn.innerText = option;

    btn.onclick = () =>
      checkAnswer(
        option,
        q.ans,
        btn
      );

    optionsBox.appendChild(btn);

  });

}

// ======================
// CHECK ANSWER
// ======================

function checkAnswer(
  selected,
  correct,
  clickedBtn
) {

  const allBtns =
    document.querySelectorAll(
      "#options button"
    );

  allBtns.forEach((btn) => {
    btn.disabled = true;
  });

  if (selected === correct) {

    clickedBtn.style.borderColor =
      "#22c55e";

    clickedBtn.style.background =
      "rgba(34,197,94,0.15)";

    state.score += 10;

    state.streak += 1;

  } else {

    clickedBtn.style.borderColor =
      "#ef4444";

    clickedBtn.style.background =
      "rgba(239,68,68,0.15)";

    state.streak = 0;

    allBtns.forEach((btn) => {

      if (
        btn.innerText === correct
      ) {

        btn.style.borderColor =
          "#22c55e";

      }

    });

  }

  streakTag.innerText =
    `STREAK: ${state.streak} 🔥`;

  setTimeout(() => {

    state.currentQuestion++;

    renderQuestion();

  }, 1000);

}

// ======================
// FINISH QUIZ
// ======================

async function finishQuiz() {

  const finalXP = state.score;

  document.getElementById(
    "quiz-box"
  ).innerHTML = `
    <div class="text-center py-10">

      <h2 class="text-5xl font-black text-sky-400 mb-4">
        Quiz Completed 🎉
      </h2>

      <p class="text-2xl font-bold mb-2">
        XP Earned: ${finalXP}
      </p>

      <p class="text-gray-400 mb-8">
        Keep practicing daily 🔥
      </p>

      <button
        onclick="location.reload()"
        class="
          bg-sky-500
          text-black
          px-8
          py-4
          rounded-2xl
          font-black
        "
      >
        Play Again
      </button>

    </div>
  `;

  try {

    await supabase
      .from("profiles")
      .update({

        xp:
          (state.profile.xp || 0) +
          finalXP,

        streak: state.streak,

        solved:
          (state.profile.solved || 0) +
          state.questions.length,

      })
      .eq(
        "id",
        state.user.id
      );

  } catch (err) {

    console.error(err);

  }

}

// ======================
// SESSION CHECK
// ======================

async function checkSession() {

  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  if (session) {

    state.user = session.user;

    await loadProfile();

    showApp();

  }

}

checkSession();

// ======================
// HELPERS
// ======================

function shuffleArray(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [array[i], array[j]] = [
      array[j],
      array[i],
    ];

  }

  return array;

  }
