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
  {name:"🍫 ทิวลี่ลูกบอล", money:50, rate:20},
  {name:"🍫 ป๊อกกาแลต", money:50, rate:20},
  {name:"🧡 ชาไทย", money:70, rate:15},
  {name:"🧋 ชานมเฉาก๊วย", money:80, rate:12},
  {name:"🍓 เบอร์รี่", money:100, rate:10},
  {name:"🍫 ช็อกโกแลตปั่น", money:90, rate:8},
  {name:"🍜 หมี่ขาวน้ำตกเนื้อพิเศษ", money:120, rate:7},
  {name:"🍰 เค้ก", money:150, rate:5},
  {name:"🐱 ค่าแมวของแบม", money:120, rate:2},
  {name:"👑 เจ้าหงิงแบมมม", money:200, rate:1, secret:true}
];

const questions = [
  { q:"อุ้มเกิดวันที่เท่าไหร่ 🎂", answer:"25" },
  { q:"อุ้มชอบสีอะไร 🎨", answer:"น้ำเงิน" },
  { q:"อุ้มทำเว็บนี้ให้แบมเพราะอะไร 💖", 
    choices:["เพราะอยากให้แบมยิ้ม","เพราะวาเลนไทน์"],
    answer:"เพราะอยากให้แบมยิ้ม"
  }
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
  let roll = Math.random()*100, acc=0;
  for(const p of prizes){
    acc += p.rate;
    if(roll <= acc){
      total += p.money;
      showPopup(
        p.secret ? "👑 SECRET!" : "🎁 เย่!!",
        `${p.name}\n+${p.money} บาท 💰`
      );
      return;
    }
  }
}

/* ---------- quiz ---------- */
function showQuiz(){
  quiz.classList.remove("hidden");
  const q = questions[currentQuestion];

  if(!q){ 
    showPopup("🎉 จบแล้ว","แบมตอบครบหมดเลย 🩷");
    rolls += 3;
    return;
  }

  quiz.innerHTML = `
  <h3>❓ คำถามที่ ${currentQuestion+1}</h3>
  <div class="quiz-box">
    <p>${q.q}</p>
    ${
      q.choices
      ? q.choices.map(c=>`
          <button onclick="answer('${c}')">${c}</button>
        `).join("")
      : `
        <input id="ans" placeholder="พิมพ์คำตอบตรงนี้เลย 💖">
        <button onclick="submit()">ตอบคำถาม</button>
      `
    }
  </div>
`;

}

function submit(){
  const val = document.getElementById("ans").value.trim();
  answer(val);
}

function answer(val){
  if(quizFinished) return; // กันบั๊กซ้ำ

  const q = questions[currentQuestion];
  if(val === q.answer){
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
