/* ---------- popup ---------- */
function showPopup(title, text){
  popupTitle.innerText = title;
  popupText.innerText = text;
  popup.classList.remove("hidden");
}
function closePopup(){
  popup.classList.add("hidden");
}
function updateRollUI(){
  rollsEl.innerText = rolls;
  if(rolls <= 0){
    rollsEl.parentElement.classList.add("roll-zero");
  }else{
    rollsEl.parentElement.classList.remove("roll-zero");
  }
}

/* ---------- game state ---------- */
let total = 0;
let rolls = 1;   
       // จุ่มเริ่มต้น 1 ครั้ง 
let currentQuestion = 0;
let quizFinished= false;


const prizes = [
  {name:"🍫 ทิวลี่ลูกบอล", money:10, rate:24.2},
  {name:"🍫 ป๊อกกาแลต", money:10, rate:24.2},
  {name:"🧡 ชาไทย", money:20, rate:15},
  {name:"🧋 ชานมเฉาก๊วย", money:30, rate:12},
  {name:"🍓 เบอร์รี่", money:50, rate:10},
  {name:"🍫 ช็อกโกแลตปั่น", money:75, rate:8},
  {name:"🍜 หมี่ขาวน้ำตกเนื้อพิเศษ", money:90, rate:5},
  {name:"🍰 เค้ก", money:120, rate:1},
  {name:"🐱 ค่าแมวของแบม", money:150, rate:0.5},
  {name:"👑 เจ้าหงิงแบมมม", money:250, rate:0.1, secret:true}
];

const questions = [
  {
    q: "อุ้มเกิดวันที่เท่าไหร่ 🎂",
    hint: "พิมพ์แค่เลขนะครับ เช่น วันเกิดเธอคือ 15",
    answer: "25"
  },
  {
    q: "อุ้มชอบสีอะไรที่สุด 🎨",
    hint: "🩷 พิมพ์แบบว่า ชมพู",
    answer: "น้ำเงิน"
  },
  {
    q: "อุ้มทำเว็บนี้ให้แบมเพราะอารายยย",
    hint: "ิิ",
    choices: [
      "เพราะอยากให้แบมยิ้ม",
      "เพราะรักแบม",
      "เพราะอยากให้แบมมีความสุข",
      "ทั้งหมดเลย"
    ],
    answer: [
      "เพราะอยากให้แบมยิ้ม",
      "เพราะรักแบม",
      "เพราะอยากให้แบมมีความสุข",
      "ทั้งหมดเลย"
    ],
  },
  {
    q: "ถ้าแบมเหนื่อย อุ้มควรทำยังไง 🩷",
    hint: "ิิ",
    choices: [
      "อยู่ข้าง ๆ",
      "พาไปกินของอร่อย",
      "กอด",
      "ทั้งหมดเลย"
    ],
    answer: [
      "อยู่ข้าง ๆ",
      "พาไปกินของอร่อย",
      "กอด",
      "ทั้งหมดเลย"
    ],
  },

];


/* ---------- gacha ---------- */
function gacha(){
  if(rolls <= 0){
    showPopup("⛔ ยังจุ่มไม่ได้", "ตอบคำถามก่อนนะ 🩷");
    showQuiz();
    return;
  }

  // ใช้สิทธิ์จุ่ม
  rolls--;
updateRollUI();

  drawPrize();
  totalEl.innerText = total;

  // ⭐ หลังจุ่มครั้งแรก ให้คำถามขึ้นทันที
  if(currentQuestion < questions.length){
    setTimeout(showQuiz, 600);
  }
}


/* ---------- draw ---------- */
function drawPrize(){
  let roll = Math.random() * 100;
  let acc = 0;

  for(const p of prizes){
    acc += p.rate;
    if(roll <= acc){
      givePrize(p);
      return;
    }
  }

  // ⭐ ถ้าไม่เข้าเงื่อนไขไหนเลย → ให้รางวัลสุดท้าย
  givePrize(prizes[prizes.length - 1]);
}

function givePrize(p){
  total += p.money;
  totalEl.innerText = total;

  showPopup(
    p.secret ? "👑 SECRET!" : "🎁 ได้ของแล้ว!",
    `${p.name}\n+${p.money} บาท 💰`
  );
}


/* ---------- quiz ---------- */
function showQuiz(){
  quiz.classList.remove("hidden");
  const q = questions[currentQuestion];

  if(!q){ 
    showPopup("🎉 หมดแย้ววว","เธอเก่งมากกมากกก 🩷");
    rolls += 3;
    return;
  }

quiz.innerHTML = `
  <h3>❓ คำถามที่ ${currentQuestion + 1}</h3>
  <div class="quiz-box">
    <p>${q.q}</p>


    ${
      q.choices
      ? q.choices.map(c =>
          `<button class="quiz-btn" data-answer="${c}">${c}</button>`
        ).join("")
      : `
        <input id="ans" placeholder="${q.hint}">

        <button class="quiz-btn" data-answer="input">ตอบคำถาม</button>
      `
    }
  </div>
`;
// 🔑 ผูกปุ่มตอบคำถาม (สำคัญมาก)
document.querySelectorAll(".quiz-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.answer;

    if(type === "input"){
      const val = document.getElementById("ans").value.trim();
      answer(val);
    }else{
      answer(type);
    }
  });
});


}

function submit(){
  const val = document.getElementById("ans").value.trim();
  answer(val);
}

function answer(val){
  if(quizFinished) return; // กันบั๊กซ้ำ

  const q = questions[currentQuestion];
  if(
  Array.isArray(q.answer)
    ? q.answer.includes(val)
    : val === q.answer
){

    rolls++;
updateRollUI();

    showPopup("✅ ถูกต้อง", "ได้จุ่มเพิ่ม 1 ครั้ง 🎁");
  }else{
    showPopup("❌ ไม่ตรง", "ไม่เป็นไร ไปต่อได้ 😊");
  }

  currentQuestion++;

  // ⭐ ถ้าถึงข้อสุดท้ายแล้ว
  if(currentQuestion >= questions.length){
    quizFinished = true;
    setTimeout(() => {
      showPopup(
        "🎉 คำถามจบแล้ว",
        "ใช้สิทธิ์จุ่มที่เหลือให้หมดได้เลยนะ 🩷"
      );
      quiz.classList.add("hidden");
    }, 500);
    return;
  }

  // ยังมีคำถามต่อ
  setTimeout(showQuiz, 600);
}


/* ---------- DOM ---------- */
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupText = document.getElementById("popup-text");
const quiz = document.getElementById("quiz");
const totalEl = document.getElementById("total");
const rollsEl = document.getElementById("rolls");
updateRollUI();


function toggleRates(){
  document.getElementById("ratePanel").classList.toggle("hidden");
}
document.getElementById("gachaBtn").addEventListener("click", gacha);
document.getElementById("rateBtn").addEventListener("click", toggleRates);
document.getElementById("closePopupBtn").addEventListener("click", closePopup);
