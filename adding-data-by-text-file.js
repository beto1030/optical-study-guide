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
              a: flashcardData[i][1],
              b: flashcardData[i][2],
              c: flashcardData[i][3],
              definition: flashcardData[i][4],
              answer: flashcardData[i][5],
          });
      }



   }

   fileReader.readAsText(this.files[0]);
   
})
