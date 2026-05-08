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

const authView =
  document.getElementById("auth-view");

const appView =
  document.getElementById("app-view");

const loginTab =
  document.getElementById("login-tab");

const signupTab =
  document.getElementById("signup-tab");

const loginBox =
  document.getElementById("login-box");

const signupBox =
  document.getElementById("signup-box");

const signupStep1 =
  document.getElementById("signup-step-1");

const signupStep2 =
  document.getElementById("signup-step-2");

const continueBtn =
  document.getElementById("continue-btn");

const loginBtn =
  document.getElementById("login-btn");

const signupBtn =
  document.getElementById("signup-btn");

const logoutBtn =
  document.getElementById("logout-btn");

const displayName =
  document.getElementById("display-name");

const xpText =
  document.getElementById("xp");

const streakText =
  document.getElementById("streak");

const premiumTag =
  document.getElementById("premium-tag");

const questionCount =
  document.getElementById("question-count");

const subjectTag =
  document.getElementById("subject-tag");

const questionText =
  document.getElementById("question");

const optionsBox =
  document.getElementById("options");

// ======================
// TAB SWITCH
// ======================

loginTab.addEventListener("click", () => {

  loginTab.classList.add("toggle-active");
  signupTab.classList.remove("toggle-active");

  loginBox.classList.remove("hidden");
  signupBox.classList.add("hidden");

});

signupTab.addEventListener("click", () => {

  signupTab.classList.add("toggle-active");
  loginTab.classList.remove("toggle-active");

  signupBox.classList.remove("hidden");
  loginBox.classList.add("hidden");

});

// ======================
// SIGNUP STEP
// ======================

continueBtn.addEventListener("click", () => {

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
    alert("Fill all fields");
    return;
  }

  if (!email.includes("@")) {
    alert("Enter valid email");
    return;
  }

  if (password.length < 6) {
    alert("Password must be 6+ chars");
    return;
  }

  signupStep1.classList.add("hidden");
  signupStep2.classList.remove("hidden");

});

// ======================
// SIGNUP
// ======================

signupBtn.addEventListener("click", async () => {

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

  if (
    !email ||
    !password ||
    !fullName
  ) {
    alert("All fields required");
    return;
  }

  signupBtn.disabled = true;
  signupBtn.innerText = "Creating...";

  try {

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) throw error;

    const user = data.user;

    if (!user) {
      throw new Error("User not found");
    }

    const { error: profileError } =
      await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name: fullName,
          email: email,
          xp: 0,
          streak: 0,
          solved: 0,
          premium: false,
        });

    if (profileError) {
      throw profileError;
    }

    alert("Account created ✅");

    signupBox.classList.add("hidden");
    loginBox.classList.remove("hidden");

    loginTab.classList.add("toggle-active");
    signupTab.classList.remove("toggle-active");

  } catch (err) {

    console.error(err);

    alert(err.message);

  }

  signupBtn.disabled = false;
  signupBtn.innerText =
    "Create My Account 🚀";

});

// ======================
// LOGIN
// ======================

loginBtn.addEventListener("click", async () => {

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

  if (
    email === "" ||
    password === ""
  ) {
    alert("Email & password required");
    return;
  }

  if (!email.includes("@")) {
    alert("Enter valid email");
    return;
  }

  if (password.length < 6) {
    alert("Password must be 6+ chars");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.innerText = "Loading...";

  try {

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw error;
    }

    state.user = data.user;

    await loadProfile();

    showApp();

  } catch (err) {

    console.error(err);

    alert(err.message);

  }

  loginBtn.disabled = false;
  loginBtn.innerText = "Login →";

});

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

  xpText.innerText =
    data.xp || 0;

  streakText.innerText =
    data.streak || 0;

  premiumTag.innerText =
    data.premium
      ? "PREMIUM"
      : "FREE";

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

  questionCount.innerText =
    `Question ${
      state.currentQuestion + 1
    }/${state.questions.length}`;

  subjectTag.innerText =
    q.sub;

  questionText.innerText =
    state.language === "hi"
      ? q.q_hi
      : q.q_en;

  optionsBox.innerHTML = "";

  const options =
    state.language === "hi"
      ? q.opts_hi
      : q.opts_en;

  options.forEach((option) => {

    const btn =
      document.createElement("button");

    btn.className =
      "option-btn";

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
      ".option-btn"
    );

  allBtns.forEach((btn) => {
    btn.disabled = true;
  });

  if (selected === correct) {

    clickedBtn.classList.add(
      "correct"
    );

    state.score += 10;

    state.streak += 1;

  } else {

    clickedBtn.classList.add(
      "wrong"
    );

    state.streak = 0;

    allBtns.forEach((btn) => {

      if (
        btn.innerText === correct
      ) {
        btn.classList.add(
          "correct"
        );
      }

    });

  }

  streakText.innerText =
    state.streak;

  setTimeout(() => {

    state.currentQuestion++;

    renderQuestion();

  }, 1000);

}

// ======================
// FINISH QUIZ
// ======================

async function finishQuiz() {

  document.getElementById(
    "quiz-box"
  ).innerHTML = `
  
  <div class="text-center py-10">

    <h2 class="text-5xl font-black text-sky-400 mb-4">
      Quiz Completed 🎉
    </h2>

    <p class="text-2xl font-bold mb-3">
      XP Earned: ${state.score}
    </p>

    <button
      onclick="location.reload()"
      class="primary-btn mt-5"
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
          state.score,

        streak:
          state.streak,

        solved:
          (state.profile.solved || 0) +
          state.questions.length,

      })
      .eq("id", state.user.id);

  } catch (err) {

    console.error(err);

  }

}

// ======================
// LOGOUT
// ======================

logoutBtn.addEventListener(
  "click",
  async () => {

    await supabase.auth.signOut();

    location.reload();

  }
);

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
