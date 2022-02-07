/*jshint esversion: 6*/
//bovenstaande zorgt ervoor dat er geen warnings komen, zoals: 'const' is available in ES6 (use 'esversion: 6') or Mozilla JS extensions (use moz).

//de begin variabelen en constanten
const id_pagina_elementen = ["title", "stelling", "buttons", "btnEens", "btnGeen", "btnOneens", "volgende", "terug", "uitslag"];
var aantal_eens = 0;
var vraag_nr = 0;
var index_partij = 0;

const posible_answers = {"pro":"eens", "none":"geen van beiden", "contra":"oneens"};

const partij = ["CDA", "VVD", "PvdA", "D66"];
var answers = [];

//roept begin functie op.
// create_stemwijzer();

//creëert elementen voor op de html pagina
function create_stemwijzer() { //creëert de stemwijzer
    //maakt de complete pagina 
    //creëert apart alle elementen
    var btnStart = document.getElementById("btnStart");
    btnStart.remove();

    // vraag_nr = subjects.length - 2;

    create_element("button", "stemWijzer", id_pagina_elementen[7], "<-");
    create_element("h1", "stemWijzer", id_pagina_elementen[0], (vraag_nr +1).toString() + ". " + subjects[vraag_nr].title);
    create_element("p", "stemWijzer", id_pagina_elementen[1], subjects[vraag_nr].statement);

    create_element("div", "stemWijzer", id_pagina_elementen[2], null);
    create_element("button", id_pagina_elementen[2], id_pagina_elementen[3], "EENS", "optionbutton");
    create_element("button", id_pagina_elementen[2], id_pagina_elementen[4], "GEEN VAN BEIDE", "optionbutton");
    create_element("button", id_pagina_elementen[2], id_pagina_elementen[5], "ONEENS", "optionbutton");
    create_element("button", "stemWijzer", id_pagina_elementen[6], "Sla deze vraag over ->");

    // for (let index = 0; index < subjects.length - 2; index++) {
    //     answers[index]= posible_answers.pro;
    // }
}

function create_element(element_create, id_append, id_element, text, classname, type, placeholder) { //creëert elementen
    var element = document.createElement(element_create);
    element.id = id_element; 
    if (element_create == "button") {
        element.onclick = function() {
            vragen(id_element);    
        };
    }
    if (text !== "" && text !== null) {
        element.innerHTML = text; 
    }
    if (type !== "" && type !== null) {
        element.type = type; 
    }    
    if (placeholder !== "" && placeholder !== null) {
        element.placeholder = placeholder;
    } 
    if (classname !== "" && classname !== null) {
        element.className = classname;
    } 
    if (id_append == "body") {
        document.body.appendChild(element);
    } else {
        var element_append = document.getElementById(id_append);
        element_append.appendChild(element);   
    }
}

//laat elke keer de vraag weergeven en vult de uitslag in. 
function vragen(button_id) {
    var title_text = document.getElementById(id_pagina_elementen[0]);
    var vraag_text = document.getElementById(id_pagina_elementen[1]);

    if (button_id === id_pagina_elementen[3]) { 
        answers[vraag_nr] = posible_answers.pro;
    } else if (button_id === id_pagina_elementen[4]) {         
        answers[vraag_nr] = posible_answers.none;
    } else if (button_id === id_pagina_elementen[5]) { 
        answers[vraag_nr] = posible_answers.contra;
    } else if (button_id === id_pagina_elementen[6]) { 
        answers[vraag_nr] = null;
    }

    console.log(answers);
    
    if (button_id === id_pagina_elementen[7]) { 
        if (vraag_nr > 0) {
            vraag_nr--;
            title_text.innerHTML = (vraag_nr +1).toString() + ". " + subjects[vraag_nr].title;
            vraag_text.innerHTML = subjects[vraag_nr].statement;
        } 
    } else {
        vraag_nr++;
        if (vraag_nr === (subjects.length - 1)) {
            console.log(vraag_nr + ", "+ (subjects.length - 1));

            
            title_text.innerHTML = (vraag_nr +1).toString() + ". " + subjects[vraag_nr].title;
            vraag_text.innerHTML = subjects[vraag_nr].statement;
            // btnVolgende.innerHTML = "Voltooien";
        } else if (vraag_nr < subjects.length) {
            // vraag_nr++;
            title_text.innerHTML = (vraag_nr +1).toString() + ". " + subjects[vraag_nr].title;
            vraag_text.innerHTML = subjects[vraag_nr].statement;
        } else {
            toon_uitslag(); 
        } 
    }

    console.log(answers[vraag_nr]);
    if (answers[vraag_nr] == null) {
        set_chosen(null);
    } else if (answers[vraag_nr] == posible_answers.pro) {
        set_chosen(3);
    } else if (answers[vraag_nr] == posible_answers.none) {
        set_chosen(4);
    } else if (answers[vraag_nr] == posible_answers.contra) {
        set_chosen(5);
    }
}

function set_chosen(chosenid) {
    document.getElementById(id_pagina_elementen[3]).classList.remove("chosen");
    document.getElementById(id_pagina_elementen[4]).classList.remove("chosen");
    document.getElementById(id_pagina_elementen[5]).classList.remove("chosen");
    if (chosenid != null && chosenid <= 5 && chosenid >= 3) {
        document.getElementById(id_pagina_elementen[chosenid]).className = "chosen";
    }
}

function toon_uitslag() {
    document.getElementById(id_pagina_elementen[0]).remove();
    document.getElementById(id_pagina_elementen[1]).remove();
    document.getElementById(id_pagina_elementen[2]).remove();
    var results_amount = 10;
    var min_size = -1;

    // create_element("ul", "stemWijzer", "list_results");
    // for (i=0; i< results_amount; i++) {        
    //     create_element("li", "list_results", "result" + i);
    // }

    // parties.filter(partij => {
    //     return partij.size > 0;
    // });
    var result1 = [];
    var result2 = [];

    for (j=0; j< subjects.length; j++) {  

        var result1 = subjects[j].parties.filter(partij1 => { //alle partijen met zelfde meming
            return partij1.position == answers[j];
        });

        result2 = result2.concat(result1);
    }

    result2 = result2.filter(partij => { // filter de te kleine partijen eruit   
        return partij.size > min_size;
    });

    result2 = findOcc(result2, "name"); // maak de resultaat array op volgorde van de meeste keer dezelfde mening per partij
    result2.sort((a, b) => {
        return a.occurrence - b.occurrence;
    });
    result2 = result2.slice(0, results_amount);

    create_element("ul", "stemWijzer", "list_results");
    for (i=0; i< results_amount; i++) {        
        create_element("li", "list_results", "result" + i);
        create_element("p", "result" + i, "p_result" + i, result2[i]);
        console.log(i +", " + result2[i]);
    }
}

function findOcc(arr, key){
    let arr2 = [];
      
    arr.forEach((x)=>{
         
      // Checking if there is any object in arr2
      // which contains the key value
       if(arr2.some((val)=>{ return val[key] == x[key] })){
           
         // If yes! then increase the occurrence by 1
         arr2.forEach((k)=>{
           if(k[key] === x[key]){ 
             k["occurrence"]++
           }
        })
           
       }else{
         // If not! Then create a new object initialize 
         // it with the present iteration key's value and 
         // set the occurrence to 1
         let a = {}
         a[key] = x[key]
         a["occurrence"] = 1
         arr2.push(a);
       }
    })
      
    return arr2
}

