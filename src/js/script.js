const startBtn = document.getElementById("start");
const questionDisplay = document.getElementById("question-container");
let quesText = document.getElementById("ques");
let ansContainer = document.getElementById("answers");
let possibleAns = document.getElementsByClassName("op");
let scoreText = document.getElementById("score");
let progress = document.getElementById("curProgress");
let curQuesNum = document.querySelector(".questionProgress p");
let progressVal = document.getElementById("progressBar");
let endCard = document.getElementById("finished-card");
let cardTitle = document.querySelector(".card-title");
let cardScore = document.querySelector(".card-score");
let mainContainer = document.getElementById("main-container");

let correctAnswerId;
let questions = [];
let currentIndex = 0;
let score = 0;

fetch("https://opentdb.com/api.php?amount=10&type=multiple")
  .then((res) => res.json())
  .then((fetchedQuestion) => {
    fetchedQuestion.results.forEach((quesItem) => {
      questions.push({
        question: quesItem.question,
        incorrect_answers: quesItem.incorrect_answers,
        correct_answer: quesItem.correct_answer,
      });
      return questions;
    });
  });

function start() {
  startBtn.classList.add("hide");
  questionDisplay.style.display = "flex";
  scoreText.classList.remove("hide");
  progress.style.visibility = "visible";
  setQuestion(questions[currentIndex]);
}

function setQuestion(question) {
  scoreText.innerHTML = "SCORE: " + score;
  curQuesNum.innerHTML = "Ques " +  (currentIndex + 1) + "/10";
  progressVal.value = currentIndex + 1;
  for (var j = 0; j < 4; j++) {
    if (possibleAns[j].classList.contains("wrong"))
      possibleAns[j].classList.remove("wrong");
    else if (possibleAns[j].classList.contains("correct"))
      possibleAns[j].classList.remove("correct");
  }

  let allAns = [...question.incorrect_answers, question.correct_answer];

  //To Shuffle Array
  let curIndex = allAns.length;
  let randIndex;
  while (curIndex !== 0) {
    randIndex = Math.floor(Math.random() * curIndex);
    curIndex--;
    [allAns[curIndex], allAns[randIndex]] = [
      allAns[randIndex],
      allAns[curIndex],
    ];
  }
  quesText.innerHTML = question.question;
  for (var i = 0; i < 4; i++) {
    possibleAns[i].innerHTML = allAns[i];
    possibleAns[i].addEventListener("click", selectAns);
    if (possibleAns[i].innerHTML === question.correct_answer) {
      correctAnswerId = possibleAns[i].id;
    }
  }
}

function selectAns(event) {
  for (var i = 0; i < 4; i++) {
    possibleAns[i].classList.add("wrong", "change-cursor");
    possibleAns[i].removeEventListener("click", selectAns);
  }
  document.getElementById(correctAnswerId).classList.remove("wrong");
  document.getElementById(correctAnswerId).classList.add("correct");
  if (
    document.getElementById(correctAnswerId) ===
    document.getElementById(event.target.id)
  ) {
    score += 100;
  }
  currentIndex++;
  if (currentIndex < 10) {
    setTimeout(() => {
      for (var i = 0; i < 4; i++)
        possibleAns[i].classList.remove("change-cursor");
      setQuestion(questions[currentIndex]);
    }, 2000);
  } else setTimeout(() => finishQuiz(), 2000);
}

function finishQuiz() {
  mainContainer.style.display = "none";
  ansContainer.classList.add("hide");
  questionDisplay.style.display = "none";
  scoreText.classList.add("hide");
  endCard.style.display = "flex";
  cardTitle.innerHTML = "You got " + score/100 + " correct out of 10.";
  cardScore.innerHTML = "SCORE: <u>" + score + "</u>";
  progress.style.visibility = "hidden";
}

startBtn.addEventListener("click", start);
