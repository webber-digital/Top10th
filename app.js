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

const signupBtn =
  document.getElementById("signup-btn");

const loginBtn =
  document.getElementById("login-btn");

const logoutBtn =
  document.getElementById("logout-btn");

const questionEl =
  document.getElementById("question");

const optionsEl =
  document.getElementById("options");

const questionCountEl =
  document.getElementById("question-count");

const subjectTagEl =
  document.getElementById("subject-tag");

const displayNameEl =
  document.getElementById("display-name");

const xpEl =
  document.getElementById("xp");

const streakEl =
  document.getElementById("streak");

const premiumTagEl =
  document.getElementById("premium-tag");

const slider =
  document.getElementById("switch-slider");

// ======================
// TAB SWITCH
// ======================

loginTab?.addEventListener(
  "click",
  () => {

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    loginBox.classList.remove("hidden");
    signupBox.classList.add("hidden");

    if (slider) {
      slider.classList.remove("right");
    }

  }
);

signupTab?.addEventListener(
  "click",
  () => {

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    signupBox.classList.remove("hidden");
    loginBox.classList.add("hidden");

    if (slider) {
      slider.classList.add("right");
    }

  }
);

// ======================
// CONTINUE BUTTON
// ======================

continueBtn?.addEventListener(
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

      alert("Enter email & password");
      return;

    }

    if (password.length < 6) {

      alert(
        "Password minimum 6 characters"
      );

      return;

    }

    signupStep1.classList.add(
      "hidden"
    );

    signupStep2.classList.remove(
      "hidden"
    );

    signupStep2.classList.add("fade");

  }
);

// ======================
// SIGNUP
// ======================

signupBtn?.addEventListener(
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

    if (!fullName) {

      alert("Enter your name");
      return;

    }

    signupBtn.disabled = true;

    signupBtn.innerText =
      "Creating...";

    try {

      // CHECK EXISTING ACCOUNT

      const {
        data: existingUser,
        error: existingError,
      } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email);

      if (existingError) {
        throw existingError;
      }

      if (
        existingUser &&
        existingUser.length > 0
      ) {

        alert(
          "Account already exists"
        );

        signupBtn.disabled = false;

        signupBtn.innerText =
          "Create My Account 🚀";

        return;

      }

      // CREATE AUTH USER

      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      const user = data.user;

      if (!user) {

        throw new Error(
          "Signup failed"
        );

      }

      // CREATE PROFILE

      const {
        error: profileError,
      } = await supabase
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

      alert(
        "Account created successfully ✅"
      );

      // RESET UI

      signupStep2.classList.add(
        "hidden"
      );

      signupStep1.classList.remove(
        "hidden"
      );

      signupBox.classList.add(
        "hidden"
      );

      loginBox.classList.remove(
        "hidden"
      );

      loginTab.classList.add("active");
      signupTab.classList.remove("active");

      if (slider) {
        slider.classList.remove("right");
      }

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

    signupBtn.disabled = false;

    signupBtn.innerText =
      "Create My Account 🚀";

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
        "Please enter email & password"
      );

      return;

    }

    loginBtn.disabled = true;

    loginBtn.innerText =
      "Loading...";

    try {

      const {
        data,
        error,
      } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        throw error;
      }

      if (!data.user) {

        throw new Error(
          "Invalid login"
        );

      }

      state.user = data.user;

      await loadProfile();

      showApp();

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

    loginBtn.disabled = false;

    loginBtn.innerText =
      "Login →";

  }
);

// ======================
// LOAD PROFILE
// ======================

async function loadProfile() {

  const {
    data,
    error,
  } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", state.user.id)
    .single();

  if (error) {

    console.error(error);

    alert(
      "Profile loading failed"
    );

    return;

  }

  state.profile = data;

  displayNameEl.innerText =
    data.full_name || "Student";

  xpEl.innerText =
    data.xp || 0;

  streakEl.innerText =
    data.streak || 0;

  premiumTagEl.innerText =
    data.premium
      ? "PREMIUM"
      : "FREE";

}

// ======================
// SHOW APP
// ======================

function showApp() {

  authView.classList.add(
    "hidden"
  );

  appView.classList.remove(
    "hidden"
  );

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

  if (!q) {

    questionEl.innerText =
      "Question loading failed";

    return;

  }

  questionCountEl.innerText =
    `Question ${
      state.currentQuestion + 1
    }/${state.questions.length}`;

  subjectTagEl.innerText =
    q.subject || "Quiz";

  questionEl.innerText =
    state.language === "hi"
      ? q.q_hi
      : q.q_en;

  optionsEl.innerHTML = "";

  const options =
    state.language === "hi"
      ? q.options_hi
      : q.options_en;

  if (
    !options ||
    !Array.isArray(options)
  ) {

    questionEl.innerText =
      "Options missing";

    return;

  }

  options.forEach((option) => {

    const btn =
      document.createElement(
        "button"
      );

    btn.className =
      "option-btn fade";

    btn.innerText = option;

    btn.onclick = () =>
      checkAnswer(
        option,
        q.answer,
        btn
      );

    optionsEl.appendChild(btn);

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

  streakEl.innerText =
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

  const finalXP =
    state.score;

  document.getElementById(
    "quiz-box"
  ).innerHTML = `
  
    <div class="text-center py-10 fade">

      <h2 class="text-5xl font-black text-sky-400 mb-4">
        Quiz Completed 🎉
      </h2>

      <p class="text-2xl font-bold mb-3">
        XP Earned: ${finalXP}
      </p>

      <p class="text-slate-400 mb-8">
        Keep practicing daily 🔥
      </p>

      <button
        onclick="location.reload()"
        class="
          primary-btn
          max-w-sm
          mx-auto
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

logoutBtn?.addEventListener(
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
  } = await supabase
    .auth
    .getSession();

  if (session) {

    state.user =
      session.user;

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
        Math.random() *
        (i + 1)
      );

    [array[i], array[j]] = [
      array[j],
      array[i],
    ];

  }

  return array;

}
