import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://realtime-database-6c7a5-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const flashcardsInDB = ref(database, "flashcards"); 


const keyword = document.getElementById("keyterm");
const definition = document.getElementById("definition");
const submitBtn= document.getElementById("submitBtn");

var firebaseRef = firebase.database().ref("flashcards");


//simple form when submitted pushes term and def values to firebase
submitBtn.addEventListener("click", function() {
    let term = keyword.value;
    let def = definition.value;

    //push(flashcardsInDB, {term, def});
    push(flashcardsInDB, {
        term: term,
        def: def,
    })

    console.log("keyword: " + term);
    console.log("definition: " + def);
})

function save(){


}
function get(){

}
function update(){

}
function remove(){

}
