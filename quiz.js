import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, set, ref, push, child, onValue, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";


var quizContainer = document.getElementById('quiz');
var resultsContainer = document.getElementById('results');
var submitButton = document.getElementById('submit');

class QuizQuestions extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'closed'});
        //let div = document.createElement('div');
        //div.textContent = 'Big Bang Theory';
        //shadowRoot.append(div);
    }

    function GetQuizDataOnce(){
      const firebaseConfig = {
          databaseURL: "https://optical-flashcards-default-rtdb.firebaseio.com",
      };
      
      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
      const flashcardsInDB = ref(database);

      get(child(flashcardsInDB, "quizQuestionsAndAnswers"))
      .then((snapshot) => {
          var flashcards = [];
          snapshot.forEach(childSnapshot => {
              flashcards.push(childSnapshot.val());
          });
            

          var quizElement = document.getElementById("quiz");

          /*const currentQuestion= document.createElement("h1");
          currentQuestion.className = "text-center my-5";*/
            
        for(let i = 0; i < flashcards.length; i++){
          // Create h5 element
            let question = document.createElement("h5");

            //set question text
            const questionText = document.createTextNode(flashcards[i]["question"]);
            //append question text to question
            question.appendChild(questionText);
            //append question to main element
            quizElement.appendChild(question);

            //create div for choices
            let div= document.createElement("div");
            div.className = "choices";



            for(let j = 0; j < flashcards[i]["choices"].length; j++){
                const input = document.createElement("input");
                const label = document.createElement("label");
                const br = document.createElement("br");

                if(flashcards[i]["choices"][j].indexOf(' ') >= 0){
                    flashcards[i]["choices"][j] = flashcards[i]["choices"][j].split(' ').join("-");

                }


                input.id = flashcards[i]["choices"][j];
                input.type = "radio";
                input.name = `question${i}`;
                input.value = flashcards[i]["choices"][j];
                div.appendChild(input);

                label.htmlFor = flashcards[i]["choices"][j];
                label.className = "ms-2 mb-1";
                label.innerHTML = flashcards[i]["choices"][j].split("-").join(" "); 
                div.appendChild(label);

                div.appendChild(br);

                quizElement.appendChild(div);

            }
        
        }

          });
      
        }//GetQuizDataOnce()

       	function showResults(){
          const flashcardsInDB = ref(database);

          get(child(flashcardsInDB, "quizQuestionsAndAnswers"))
          .then((snapshot) => {
              var flashcards = [];
              snapshot.forEach(childSnapshot => {
                  flashcards.push(childSnapshot.val());
              });


		// gather answer containers from our quiz
		var answerContainers = quizContainer.querySelectorAll('.choices');

		// keep track of user's answers
		var userAnswer = '';
		var numCorrect = 0;

		// for each question...
		for(var i=0; i<flashcards.length; i++){

			// find selected answer
			userAnswer = (answerContainers[i].querySelector('input[name=question'+i+']:checked')||{}).value;

            if(flashcards[i].answer.indexOf(' ') >= 0){
                flashcards[i].answer = flashcards[i].answer.split(" ").join("-");
            }

			// if answer is correct
			if(userAnswer===flashcards[i].answer){
				// add to the number of correct answers
				numCorrect++;

				// color the answers green
                answerContainers[i].querySelector(`label[for=${userAnswer}]`).style.color = 'lightgreen';
                let choicesToDisable = answerContainers[i].getElementsByTagName("input");
                for(let j = 0; j < choicesToDisable.length; j++){
                    choicesToDisable[j].disabled = true;
                    choicesToDisable[j].disabled = true;
                }

			}
            else if(userAnswer!==flashcards[i].answer){
                answerContainers[i].querySelector(`label[for=${userAnswer}]`).style.color = 'red';

                let choicesToDisable = answerContainers[i].getElementsByTagName("input");
                for(let j = 0; j < choicesToDisable.length; j++){
                    choicesToDisable[j].disabled = true;
                    choicesToDisable[j].disabled = true;
                }
            }
			// if answer is wrong or blank
			else{
				// color the answers red
				//answerContainers[i].style.color = 'red';
                //answerContainers[i].querySelector(`label[for=${userAnswer}]`).style.color = 'black';
			}
		}

		// show number of correct answers out of total
		resultsContainer.innerHTML = numCorrect + ' out of ' + flashcards.length;

        if( numCorrect < flashcards.length){
            let submitBtn = document.getElementById("submit");
            submitBtn.style.display = "none";
            let tryAgainBtn = document.createElement("button");
            tryAgainBtn.innerHTML = "Try Again";
            
            let resultsEl = document.getElementById("results");
            resultsEl.appendChild(tryAgainBtn);
            tryAgainBtn.setAttribute("onclick","window.location.reload()");
              
             
        }else{
             document.getElementById("submit").style.display = "none";
        }

    });

    //call GetQuizDataOnce and showResults
    GetQuizDataOnce(); 
    
    // on submit, show results
	submitButton.onclick = function(){
	 showResults();
    }


            
}
}

window.customElements.define('big-bang', BigBang);
