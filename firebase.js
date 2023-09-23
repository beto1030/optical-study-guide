import { initializeApp } from "firebase/app";
import { onSnapshot, doc, getDocs, addDoc,firestore, getFirestore, collection, orderBy, query } from "firebase/firestore";
import * as firebaseui from 'firebaseui';

//let arr = [];
//arr.push("wtf");
//arr.push("you bitch");
//arr.push("mother fucker");
//console.log(arr);

// Document elements
const loginBtn = document.getElementById('loginBtn');
const fileInput = document.getElementById("fileInput");
const mainElement = document.getElementById('main');

// Document quiz elements
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById("results");
const submitButton = document.getElementById('submit');






generateQuiz(quizContainer, resultsContainer, submitButton);

async function generateQuiz(quizContainer, resultsContainer, submitButton) {
    // Initialize Firebase
    const app = initializeApp({
        apiKey: "AIzaSyAzHuepwEkFoI5QzJISd121B8hyaOOewZA",
        authDomain: "optical-flashcards-a6d76.firebaseapp.com",
        projectId: "optical-flashcards-a6d76",
        storageBucket: "optical-flashcards-a6d76.appspot.com",
        messagingSenderId: "930492285594",
        appId: "1:930492285594:web:f780b68efb73f2ef8e9523"
    });

    const db = getFirestore(app);

    var quiz = [];
    const querySnapshot = await getDocs(collection(db, "quiz")).then(
        (result) => {
            //console.log(result.docs.length);
            for(let i = 0; i<result.docs.length; i++){
                //console.log(result.docs[i].data());
                quiz.push(result.docs[i].data());
            }
            return quiz;
        },
        (error) => {
            console.log(error);
        }
    );

    quiz = querySnapshot;

  function showQuestions(quiz, quizContainer) {
     //console.log(quiz[0].choices.length);
    var output = [];
    var answers;


    for(var i = 0; i<quiz.length; i++){
          const choicesContainer = document.createElement("div");
          choicesContainer.classList.add("choicesContainer");
          choicesContainer.id = "choicesContainer";

          const question = document.createElement("h3");
          const questionText = document.createTextNode(quiz[i].question);
          question.appendChild(questionText);

          document.getElementById("quiz").appendChild(question);
          document.getElementById("quiz").appendChild(choicesContainer); 

          let abc = ["a", "b", "c"];
          for (var j = 0; j < quiz[i].choices.length; j++){
              const label = document.createElement("label");
              label.classList.add("ms-2")
              label.for = choicesContainer.id;
              
              const choice  = document.createElement("input");
              choice.type = "radio"; 
              choice.id = choicesContainer.id;
              choice.value = abc[j];
              choice.name = choicesContainer.id+i;

              const choiceText= document.createTextNode(quiz[i].choices[j]);
              label.appendChild(choiceText);

              const br = document.createElement("br");

              choicesContainer.appendChild(choice);
              choicesContainer.appendChild(label);
              choicesContainer.appendChild(br);


          }
          const br = document.createElement("br");
          document.getElementById("quiz").appendChild(br);

      }
  }
  function showResults(quiz, quizContainer, resultsContainer){
    //gather all answer containers from our quiz
    var answerContainers = quizContainer.querySelectorAll(".choicesContainer");
    var inputTags = quizContainer.querySelectorAll("#choicesContainer");
    var labelTags = quizContainer.getElementsByTagName("label");
    for(let i = 0; i<inputTags.length; i++){
        inputTags[i].disabled = true;
        //labelTags[i].disabled = true;
        //console.log(inputTags[i]);
    }
    
    //keep track of user's answers
    var userAnswer = '';
    var numCorrect = 0;
    var otherAnswers = '';
    
      
    //let labels = answerContainers[i].getElementsByTagName("label").length;
    let labels = document.getElementsByTagName("label");
    for(var i = 0; i<labels.length; i++){
        //answerContainers[i].getElementsByTagName("label")[i].style.color = "grey";
        labels[i].style.color = "lightgrey";
    }
    //otherAnswers = answerContainers.querySelector('input[type=radio]');
    console.log("input element: ",otherAnswers);
    //for each question
    for(var i = 0; i<quiz.length; i++){
    console.log(quiz[i].choices);
       userAnswer = answerContainers[i].querySelector('input[type=radio]:checked');
       
       //console.log(quiz[i].choices);
       //if answer is correct
	   if(userAnswer.value === quiz[i].answer){
	   	numCorrect++;
        userAnswer.nextSibling.style.color = 'lightgreen';
        //console.log("Correct Answer: ",userAnswer.nextSibling);
	   }
       else if( userAnswer.value !== quiz[i].answer ){
	   	userAnswer.nextSibling.style.color = 'red';
        //console.log("Wrong Answer: ",userAnswer.nextSibling);
       }

	   	//otherAnswers[i].nextSibling.style.color = 'blue';
        //console.log("Other Answer: ",otherAnswers.nextSibling);

    }
      //console.log(q);
      //console.log(userAnswer);
      // show number of correct answers out of total
      resultsContainer.innerHTML = numCorrect + ' out of ' + quiz.length;


  }

var myFile = document.getElementById("myFile");
var fileOutput = document.getElementById("fileOutput");

myFile.addEventListener('change',function(){
   //const flashcardsInDB = ref(database, "flashcards");
   var fileReader=new FileReader();
   fileReader.onload=function(){

      fileOutput.textContent=fileReader.result;
      const arr1 = fileOutput.textContent.split('\n');
      //console.log(arr1);

      function array_into_chunks (array, size_of_chunk) {
          const arr = [];
          for (let i = 0; i < array.length; i += size_of_chunk) {
             const chunk = array.slice(i, i + size_of_chunk);
             arr.push(chunk);
          }
          return arr;
      }
      
      var flashcardData = array_into_chunks(arr1, 6);
      //console.log(flashcardData);

      /* Now that i have the array i named flashcardData in the correct format now i have to "push" then into firbase realtime database */

       //console.log(flashcardData);
      for( let i = 0; i < flashcardData.length -1; i++){
          addDoc(collection(db, "quiz"), {
              question: flashcardData[i][0],
              choices:[ 
                 flashcardData[i][1],
                 flashcardData[i][2],
                 flashcardData[i][3]
              ],
              definition: flashcardData[i][4],
              answer: flashcardData[i][5],
          });
      }



   }

   fileReader.readAsText(this.files[0]);
   
})
    

  showQuestions(quiz, quizContainer);
    
  //formatQuestions();

  // on submit, show results
  submitButton.onclick = function () {
      showResults(quiz, quizContainer, resultsContainer);
  }
}




