import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged, EmailAuthProvider } from 'firebase/auth';
import { onSnapshot, doc, addDoc, getFirestore, collection, orderBy, query } from "firebase/firestore";
import * as firebaseui from 'firebaseui';

// Document elements
const loginBtn = document.getElementById('loginBtn');
const fileInput = document.getElementById("fileInput");
const mainElement = document.getElementById('main');

// Document quiz elements
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById("results");
const submitButton = document.getElementById('submit');


//let guestbookListener = null;
let flashcardListener = null;

async function main() {
    // Initialize Firebase
    const app = initializeApp({
        apiKey: "AIzaSyAzHuepwEkFoI5QzJISd121B8hyaOOewZA",
        authDomain: "optical-flashcards-a6d76.firebaseapp.com",
        projectId: "optical-flashcards-a6d76",
        storageBucket: "optical-flashcards-a6d76.appspot.com",
        messagingSenderId: "930492285594",
        appId: "1:930492285594:web:f780b68efb73f2ef8e9523"
    });


    // Initialize firebase 
        // this gives us the firebase auth object that is created automatically by firebase. When using firebaseui this auth object gets updated automatically
    const auth = getAuth(); 
    console.log(auth);

    const db = getFirestore();

    // FirebaseUI config
    const uiConfig = {
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInOptions: [
        // Email / Password Provider.
        EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // Handle sign-in.
          // Return false to avoid redirect.
          return false;
        },
      },
    };

  const ui = new firebaseui.auth.AuthUI(auth);
  console.log(document.body.contains(loginBtn));
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      if (auth.currentUser) {
        signOut(auth);
          //console.log("signed out");
      } else {
        ui.start('#firebaseui-auth-container', uiConfig);
        mainElement.style.filter = "blur(5px)";
      }
    });
  }

  // Check if logged in or out
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginBtn.style.display = "block";
      loginBtn.textContent = 'LOGOUT';
      //console.log("logged in");
      mainElement.style.filter = "blur(0px)";
      loginBtn.style.display = "block";

      // Show guestbook to logged-in user
      //flashcards.style.display = 'grid';
      //fileInput.style.display = 'block';

      // Subscribe to the guestbook collection
      //subscribeFlashcards();

      // Subscribe to the user's RSVP
      //subscribeCurrentRSVP();
      if(auth.currentUser.uid == "Q6MhYNoXQ6bmfJjeBpYlwA9ytBk1") {
         fileInput.style.display = "block"; 
      }
    } else {
      loginBtn.style.display = "block";
      loginBtn.textContent = 'LOGIN';
      fileInput.style.display = "none"; 
      //console.log('logged out');

      // Hide guestbook for non-logged-in users
      //flashcards.style.display = 'grid';
      //fileInput.style.display = 'none';

      // Unsubscribe from the guestbook collection
      //unsubscribeFlashcards();

      // Unsubscribe from the user's RSVP
      //unsubscribeCurrentRSVP();
    }
  });

  //function subscribeFlashcards() {
  //  const q = query(collection(db, 'flashcards'));

  //  flashcardListener = onSnapshot(q, (snaps) => {
  //    // Rest page
  //    mainElement.innerHTML = '';

  //    // Loop through documents in database
  //    snaps.forEach((doc) => {
  //          //const div = document.createElement("div");
  //          //div.className = "card flash-card";

  //          const term = document.createElement("div");
  //          term.className = "term border text-center pt-4";
  //          term.style.height = "120px";
  //          term.style.width= "220px";
  //          const termText = document.createTextNode(doc.data().term);
  //          term.appendChild(termText);

  //          const def = document.createElement("div");
  //          def.className = "def border text-center pt-2";
  //          const defText= document.createTextNode(doc.data().def);
  //          def.appendChild(defText);

  //          //div.appendChild(front);
  //          //div.appendChild(back);
  //          //document.getElementById("main").appendChild(div);
  //          document.getElementById("main").appendChild(term);
  //          document.getElementById("main").appendChild(def);

  //      // Create an HTML entry for each document and add it to the chat
  //      //const front = document.createElement('p');
  //      //const back = document.createElement('p');

  //      //front.textContent = doc.data().term;
  //      //back.textContent = doc.data().def;
  //      //flashcards.appendChild(front);
  //      //flashcards.appendChild(back);
  //    });
  //  });
  //}
  function subscribeFlashcards() {
    const q = query(collection(db, 'quiz'));

    flashcardListener = onSnapshot(q, (snaps) => {
      // Reset page
      mainElement.innerHTML = '';
      

      // Loop through documents in database
      snaps.forEach((doc) => {
            const choicesContainer = document.createElement("div");
            choicesContainer.classList.add("choicesContainer");
            choicesContainer.id = "choicesContainer";

            const question = document.createElement("h3");
            const questionText = document.createTextNode(doc.data().question);
            question.appendChild(questionText);

            document.getElementById("quiz").appendChild(question);
            document.getElementById("quiz").appendChild(choicesContainer); 

            for (let i = 0; i < doc.data().choices.length; i++){
                //document.getElementById("quiz").innerHTML += "<div class='choicesContainer'>";
                const label = document.createElement("label");
                label.for = doc.id;
                
                const choice  = document.createElement("input");
                choice.type = "radio"; 
                choice.id = doc.id;
                
                choice.name = doc.id;

                const choiceText= document.createTextNode(doc.data().choices[i]);
                label.appendChild(choiceText);

                const br = document.createElement("br");

                choicesContainer.appendChild(choice);
                choicesContainer.appendChild(label);
                choicesContainer.appendChild(br);
                // document.getElementById("quiz").innerHTML += "</div>";


            }
                const br = document.createElement("br");
                document.getElementById("quiz").appendChild(br);

      });
    });
  }
  function showResults(questions, quizContainer, resultsContainer){
    //gather all answer containers from our quiz
    var answerContainers = document.getElementById("quiz").querySelectorAll(".choicesContainer");
    
    //keep track of user's answers
    var userAnswer = '';
    var numCorrect = 0;
    
    //for each question
    for(var i = 0; i<questions.length; i++){
        // find selected answers
        userAnswer = (answerContainers[i].querySelector('input[name='+answerContainers[i].getAttribute("name")+']:checked')||{}).value;

        // if answer is correct
        console.log(snaps);
    }


  }

  // Unsubscribe from guestbook updates
  function unsubscribeFlashcards() {
    if (flashcardListener != null) {
      flashcardListener = null;
    }
  }

      // pushing data into realtime database
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
            console.log(flashcardData);

            /* Now that i have the array i named flashcardData in the correct format now i have to "push" then into firbase realtime database */

            for( let i = 0; i < flashcardData.length -1; i++){
                addDoc(collection(db, "quiz"), {
                    question: flashcardData[i][0],
                    choices: [flashcardData[i][1], flashcardData[i][2], flashcardData[i][3]], 
                    definiton: flashcardData[i][4],
                    answer: parseInt(flashcardData[i][5]),
                });
            }


      
         }
      
         fileReader.readAsText(this.files[0]);
         
      })
    subscribeFlashcards();

    // on submit, show results
    submitButton.onclick = function () {
        showResults(questions, quizContainer, resultsContainer);
    }
}

main();



