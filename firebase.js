import { initializeApp } from "firebase/app";
import { onSnapshot, doc, setDoc, getDocs, addDoc, updateDoc, firestore, getFirestore, collection, orderBy, query } from "firebase/firestore";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import * as firebaseui from 'firebaseui';

// Document elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const registerBtn= document.getElementById('registerBtn');
const fileInput = document.getElementById("fileInput");
const mainElement = document.getElementById('main');

// Document quiz elements
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById("results");
const submitButton = document.getElementById('submit');
    const app = initializeApp({
        apiKey: "AIzaSyAzHuepwEkFoI5QzJISd121B8hyaOOewZA",
        authDomain: "optical-flashcards-a6d76.firebaseapp.com",
        projectId: "optical-flashcards-a6d76",
        storageBucket: "optical-flashcards-a6d76.appspot.com",
        messagingSenderId: "930492285594",
        appId: "1:930492285594:web:f780b68efb73f2ef8e9523"
    });

    const auth = getAuth(app);
    const db = getFirestore(app);

    var quiz = [];
    const querySnapshot = await getDocs(collection(db, "quiz")).then(
        (result) => {
            for(let i = 0; i<result.docs.length; i++){
                quiz.push(result.docs[i].data());
            }
            return quiz;
        },
        (error) => {
            console.log(error);
        }
    );
    auth.onAuthStateChanged(user => {
        if (user !== null) {
            console.log("user logged in: ");
            console.log(user);
            quiz = querySnapshot;
            document.getElementById("form_container").style.display = "none";
            document.getElementById("logoutBtn").style.display = "block";
            document.getElementById("quiz").style.display = "block";
            document.getElementById("submit").style.display = "block";
        } else {
            console.log('user logged out: ');
            console.log(user);
            quiz = [];
            document.getElementById("form_container").style.display = "block";
            document.getElementById("logoutBtn").style.display = "none";
            document.getElementById("quiz").style.display = "none";
            document.getElementById("submit").style.display = "none";
        }
    })

generateQuiz(quiz, quizContainer, resultsContainer, submitButton);

function generateQuiz(quiz, quizContainer, resultsContainer, submitButton) {

  function showQuestions(quiz, quizContainer) {
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
    }
    
    //keep track of user's answers
    var userAnswer = '';
    var numCorrect = 0;
    var otherAnswers = '';
    
      
    //let labels = answerContainers[i].getElementsByTagName("label").length;
    let labels = document.getElementsByTagName("label");
    for(var i = 0; i<labels.length; i++){
        labels[i].style.color = "lightgrey";
    }

    //for each question
    for(var i = 0; i<quiz.length; i++){
       userAnswer = answerContainers[i].querySelector('input[type=radio]:checked');
       
       //if answer is correct
	   if(userAnswer.value === quiz[i].answer){
	   	numCorrect++;
        userAnswer.nextSibling.style.color = 'lightgreen';
	   }
       else if( userAnswer.value !== quiz[i].answer ){
	   	userAnswer.nextSibling.style.color = 'red';
       }
    }
      // show number of correct answers out of total
      resultsContainer.innerHTML = numCorrect + ' out of ' + quiz.length;

      let score = (numCorrect/quiz.length)*100+"%";
      var user = auth.currentUser;
      
      setDoc(doc(db, "users",user.uid), { score: score }, { merge: true });

  }
  function resetQuiz(submitButton, resultsContainer){
    var inputTags = document.querySelectorAll("#choicesContainer");
    let labels = document.getElementsByTagName("label");
    for(let i = 0; i<inputTags.length; i++){
        inputTags[i].disabled = false;
        inputTags[i].checked = false;
    }
    for(var i = 0; i<labels.length; i++){
        labels[i].style.color = "black";
    }
    resultsContainer.innerHTML = " ";
  }

  showQuestions(quiz, quizContainer);
    
  // on submit, show results
  submitButton.onclick = function () {
      document.getElementById("submit").innerHTML = "Try Again";
      showResults(quiz, quizContainer, resultsContainer);

      submitButton.onclick = function () {
      document.getElementById("submit").innerHTML = "Submit Quiz";
        resetQuiz(submitButton, resultsContainer);
      }
  }
}// end of generate quiz function

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
    
function register() {
    // Get all input fields
    let register_email = document.getElementById("register_email").value;
    let register_full_name = document.getElementById("register_full_name").value;
    let register_password = document.getElementById("register_password").value;

    // Validate input fields
    if (validate_email(register_email) == false || validate_password(register_password) == false) {
        alert('Email or password is not valid.');
        return;
        // Dont continue running the code
    }
    if(validate_field(register_full_name) == false) {
        alert('Unfortunatly, your name is invalid');
        return;
    }

    // Move on with Auth (this returns a promise)
    createUserWithEmailAndPassword(auth, register_email, register_password)
    .then(function() {
        // Declare user variable
        var user = auth.currentUser;

        // Create User data
        var user_data = {
            email: register_email,
            full_name: register_full_name,
        }

        setDoc(doc(db, "users",user.uid), user_data);
    })
    .catch(function(error){
        // Firebase will use this to alert its errors
        var error_code = error.code;
        var error_message = error.message;
        console.log("inside catch error code: "+error_code+" "+error.message);

    })
}

function login(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    // validate input fields
    if (validate_email(email) == false || validate_password(password) == false){
        alert("Email or password is invalid");
        return;
        // Don't continue running the code
    }

    signInWithEmailAndPassword(auth, email, password)
    .then(function(){
        // Declare user variable
        var user = auth.currentUser;

        // Create User data
        var user_data = {
            last_login: Date.now()
        }

        updateDoc(doc(db, "users",user.uid), user_data);

    })
    .catch(function(error){
        // Firebase will use this to alert its errors
        var error_code = error.code;
        var error_message = error.message;
        console.log("inside catch error code: "+error_code+" "+error.message);
    })


}

// validation functions
function validate_email(email) {
    let expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email) == true) {
        // Email is good
        return true;
    } else {
        return false;
    }
}

function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6){
        return false;
    } else {
        return true;
    }
}

function validate_field(field) {
   if (field == null) {
       return false;
   }

   if (field.length <= 0) {
       return false;
   } else {
       return true;
   }
}

loginBtn.onclick = function() {
    login();
}

registerBtn.onclick = function() {
    register();
}
logoutBtn.onclick = function() {
    signOut(auth);
}
