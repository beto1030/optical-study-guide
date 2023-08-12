let plusSignEl= document.getElementById("plusSignEl");
let cardInfoSectionEl = document.getElementById("cardInfoSectionEl");
let submitBtn = document.getElementById("submitBtn");

//make addCardInfo display block when you click on it
plusSignEl.addEventListener("click", function() {
    cardInfoSectionEl.style.display= "block";
    plusSignEl.style.display= "none";
})

function insertBefore(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode);
}

submitBtn.addEventListener("click", function() {
    
    let newCard = document.createElement("div");
    newCard.setAttribute("class", "card flash-card");


    let newCardFront = document.createElement("div");
    newCardFront.setAttribute("class", "front");

    let newCardFrontP = document.createElement("p");
    newCardFrontP.textContent = document.getElementById("keyterm").value;

    newCardFront.appendChild(newCardFrontP); 

    let newCardBack= document.createElement("div");
    newCardBack.setAttribute("class", "back");
    let newCardBackP= document.createElement("p");
    newCardBackP.textContent = document.getElementById("definition").value;
    newCardBack.appendChild(newCardBackP);

    //appendchild front and back to card 
    newCard.appendChild(newCardFront);
    newCard.appendChild(newCardBack);

    let newCardEl = document.getElementById("newCardEl");
    insertBefore(newCard, newCardEl);

    document.getElementById("keyterm").value = "";
    document.getElementById("definition").value = "";

    cardInfoSectionEl.style.display= "none";
    plusSignEl.style.display= "block";
    

})
