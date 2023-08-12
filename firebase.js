import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged, EmailAuthProvider } from 'firebase/auth';
import { onSnapshot, doc, addDoc, getFirestore, collection, orderBy, query } from "firebase/firestore";
import * as firebaseui from 'firebaseui';

// Document elements
const loginBtn = document.getElementById('loginBtn');
const flashcards = document.getElementById('main');
const fileInput = document.getElementById("fileInput");
const guestbookContainer = document.getElementById('guestbook-container');

//const form = document.getElementById('leave-message');
//const input = document.getElementById('message');
const mainElement = document.getElementById('main');
//const numberAttending = document.getElementById('number-attending');
//const rsvpYes = document.getElementById('rsvp-yes');
//const rsvpNo = document.getElementById('rsvp-no');

let flashcardListener= null; //let guestbookListener = null;

let db, auth;

async function main() {
    const appSettings = {
        apiKey: "AIzaSyAzHuepwEkFoI5QzJISd121B8hyaOOewZA",
        authDomain: "optical-flashcards-a6d76.firebaseapp.com",
        projectId: "optical-flashcards-a6d76",
        storageBucket: "optical-flashcards-a6d76.appspot.com",
        messagingSenderId: "930492285594",
        appId: "1:930492285594:web:f780b68efb73f2ef8e9523"
    }
    const app = initializeApp(appSettings); 
    const auth = getAuth();
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

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      if (auth.currentUser) {
        signOut(auth);
          console.log("signed out");
      } else {
        ui.start('#firebaseui-auth-container', uiConfig);
          console.log("signing in");
      }
    });
  }

  // Check if logged in or out
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginBtn.textContent = 'LOGOUT';
      console.log("logged in");

      // Show guestbook to logged-in user
      flashcards.style.display = 'grid';
      fileInput.style.display = 'none';

      // Subscribe to the guestbook collection
      subscribeFlashcards();

      // Subscribe to the user's RSVP
      //subscribeCurrentRSVP();
    } else {
      loginBtn.textContent = 'LOGIN';
      console.log('logged out');

      // Hide guestbook for non-logged-in users
      flashcards.style.display = 'none';
      fileInput.style.display = 'none';

      // Unsubscribe from the guestbook collection
      unsubscribeFlashcards();

      // Unsubscribe from the user's RSVP
      //unsubscribeCurrentRSVP();
    }
  });


  function subscribeFlashcards() {
    const q = query(collection(db, 'flashcards'));

    flashcardListener = onSnapshot(q, (snaps) => {
      // Rest page
      flashcards.innerHTML = '';

      // Loop through documents in database
      snaps.forEach((doc) => {
            const div = document.createElement("div");
            div.className = "card flash-card";

            const front = document.createElement("div");
            front.className = "front";
            const frontText = document.createTextNode(doc.data().term);
            front.appendChild(frontText);

            const back = document.createElement("div");
            back.className = "back";
            const backText= document.createTextNode(doc.data().def);
            back.appendChild(backText);

            div.appendChild(front);
            div.appendChild(back);
            document.getElementById("main").appendChild(div);

        // Create an HTML entry for each document and add it to the chat
        //const front = document.createElement('p');
        //const back = document.createElement('p');

        //front.textContent = doc.data().term;
        //back.textContent = doc.data().def;
        //flashcards.appendChild(front);
        //flashcards.appendChild(back);
      });
    });
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
            
            var flashcardData = array_into_chunks(arr1, 2);
            console.log(flashcardData);

            /* Now that i have the array i named flashcardData in the correct format now i have to "push" then into firbase realtime database */

            for( let i = 0; i < flashcardData.length -1; i++){
                addDoc(collection(db, "flashcards"), {
                    term: flashcardData[i][0],
                    def: flashcardData[i][1],
                });
            }


      
         }
      
         fileReader.readAsText(this.files[0]);
         
      })
}

main();


//const database = getDatabase(app);
//const flashcardsInDB = ref(database, "flashcards"); 


//const keyword = document.getElementById("keyterm");
//const definition = document.getElementById("definition");
//const submitBtn= document.getElementById("submitBtn");
//
//var firebaseRef = firebase.database().ref("flashcards");
//
//
////simple form when submitted pushes term and def values to firebase
//submitBtn.addEventListener("click", function() {
//    let term = keyword.value;
//    let def = definition.value;
//
//    //push(flashcardsInDB, {term, def});
//    push(flashcardsInDB, {
//        term: term,
//        def: def,
//    })
//
//    console.log("keyword: " + term);
//    console.log("definition: " + def);
//})

