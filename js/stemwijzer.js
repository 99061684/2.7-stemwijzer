/*jshint esversion: 6*/
//bovenstaande zorgt ervoor dat er geen warnings komen, zoals: 'const' is available in ES6 (use 'esversion: 6') or Mozilla JS extensions (use moz).

//de begin variabelen en constanten
const start = document.getElementById("start");
const questions = document.getElementById("questions");
const instellingen = document.getElementById("instellingen");
const uitslag = document.getElementById("uitslag");

const title = document.getElementById("title");
const stelling = document.getElementById("stelling");
const uitslag_type = document.getElementById("uitslag_type");
const list_results = document.getElementById("list_results");

const buttons = ["btnEens", "btnGeen", "btnOneens", "volgende", "terug"];
const posible_answers = {"pro":"eens", "none":"geen van beiden", "contra":"oneens"};
const posible_positions = {"pro":"voor", "none":"geen mening", "contra":"tegen"};
var answers = [];
var vraag_nr = 0;
var instellingen_made = false;
var filter = "";

var results_amount = 30;

//creëert elementen voor op de html pagina
function create_stemwijzer() { //creëert de stemwijzer
    start.style.display = "none";
    instellingen.style.display = "none";
    questions.style.display = "block"; 

    uitslag_type.onchange = function() {toon_uitslag();};

    if (answers.length == 0) {
        for (let index = 0; index < subjects.length; index++) {
            answers[index]= new subjectanswer(null, 1);
        }
    }

    title.innerHTML = (vraag_nr +1).toString() + ". " + subjects[vraag_nr].title;
    stelling.innerHTML = subjects[vraag_nr].statement;

    for (let index = 0; index < buttons.length; index++) {
        document.getElementById(buttons[index]).onclick = function() {vragen(buttons[index]);};
    }

    for (let i=0; i< parties.length - 1; i++) { 
        let element = null;       
        create_element("button", "buttons2", "mening" + i, parties[i].name, "w3-bar-item w3-button mening_buttons"); 

        var checkpartij = subjects[vraag_nr].parties.find((partij2) => partij2.name==parties[i].name);

        create_element("div", "meningen", parties[i].name, null, "w3-container w3-display-container mening"); 
        create_element("span", parties[i].name, "span_close"+i, "&times;", "w3-button w3-large w3-display-topright");
        create_element("h2", parties[i].name, "h2_mening"+i, posible_positions[checkpartij.position]);
        create_element("p", parties[i].name, "p_mening"+i, checkpartij.opinion);


        element = document.getElementById("span_close"+i);
        element.onclick = function() {
            this.parentElement.style.display='none';
        };

        element = document.getElementById("mening" + i);
        element.onclick = function() {
            openCity(event,parties[i].name);
        };
    }
}

function create_instellingen() {
    instellingen.style.display = "block"; 
    if (answers.length == 0) {
        for (let index = 0; index < subjects.length; index++) {
            answers[index]= new subjectanswer(null, 1);
        }
    }

    if (instellingen_made == false) {
        for (i=0; i< subjects.length; i++) {        
            create_element("li", "list_subjects", "subject" + i, null, null);
            create_element("INPUT", "subject" + i, "p_checkbox" + i, null, null, "checkbox"); 
            create_element("LABEL", "subject" + i, "p_subject" + i, subjects[i].title, "p_subject", null, null, null, "p_checkbox" + i);
            
            var checkbox = document.getElementById("p_checkbox" + i);
            checkbox.onclick = function() {
                var nr = this.id.replace("p_checkbox", "");
                if (this.checked) {
                    answers[nr].weight = 2;
                } else {
                    answers[nr].weight = 1;
                }
            };
        }
    }
    instellingen_made = true;
}

//laat elke keer de vraag weergeven en vult de uitslag in. 
function vragen(button_id) {
    var title_text = document.getElementById("title");
    var vraag_text = document.getElementById("stelling");

    if (button_id == "btnEens") { 
        answers[vraag_nr].answer = posible_answers.pro;
    } else if (button_id == "btnGeen") {   
        answers[vraag_nr].answer = posible_answers.none;
    } else if (button_id == "btnOneens") { 
        answers[vraag_nr].answer = posible_answers.contra;
    } else if (button_id == "volgende") { 
        answers[vraag_nr].answer = null;
    }
    
    if (button_id == "terug") { 
        if (vraag_nr > 0 && vraag_nr < subjects.length) {
            vraag_nr--;
            title_text.innerHTML = (vraag_nr +1).toString() + ". " + subjects[vraag_nr].title;
            vraag_text.innerHTML = subjects[vraag_nr].statement;
        } else {
            window.location.reload(true);
        }
    } else {
        vraag_nr++;
        if (vraag_nr <= (subjects.length - 1)) {
            title_text.innerHTML = (vraag_nr +1).toString() + ". " + subjects[vraag_nr].title;
            vraag_text.innerHTML = subjects[vraag_nr].statement;

            for (let index = 0; index < (parties.length - 1); index++) {
                let checkpartij = subjects[vraag_nr].parties.find((partij2) => partij2.name==parties[index].name);
                document.getElementById("h2_mening"+index).innerHTML = posible_positions[checkpartij.position];
                document.getElementById("p_mening"+index).innerHTML = checkpartij.opinion;
            }
        } else {
            toon_uitslag(); 
        } 
    }

    if (vraag_nr < subjects.length) {

        if (answers[vraag_nr].answer == null) {
            set_chosen(null);
        } else if (answers[vraag_nr].answer == posible_answers.pro) {
            set_chosen("btnEens");
        } else if (answers[vraag_nr].answer == posible_answers.none) {
            set_chosen("btnGeen");
        } else if (answers[vraag_nr].answer == posible_answers.contra) {
            set_chosen("btnOneens");
        }
    }
}

function set_chosen(chosenid) {
    const buttonsid = ["btnEens", "btnGeen", "btnOneens"];
    buttonsid.forEach(element => {
        var element = document.getElementById(element);
        if (element.classList.contains("chosen")) {
            element.classList.remove("chosen");
        }
    });

    if (chosenid != null) {
        document.getElementById(chosenid).classList.add("chosen");
    }
}

function toon_uitslag() {
    questions.style.display = "none";
    uitslag.style.display = "block";

    var selectedOption = uitslag_type.options[uitslag_type.selectedIndex];
    var result2 = [];
    const partij_size = 5;

    if (selectedOption.value == "option_1") {
        filter = "";
    } else if (selectedOption.value == "option_2") {
        filter = "seclulier=true";
    } else if (selectedOption.value == "option_3") {
        filter = "min_size";
    } else if (selectedOption.value == "option_4") {
        filter = "max_size";
    }

    for (j=0; j< subjects.length; j++) {  
        for (let subjectweight = 0; subjectweight < answers[j].weight; subjectweight++) {
            var result1 = subjects[j].parties.filter(partij1 => { //alle partijen met zelfde meming
                return partij1.position == getKeyByValue(posible_answers, answers[j].answer);
            }); 
            result2 = result2.concat(result1);
        }
    } 

    if (filter == "seclulier=true") {
        result2 = result2.filter(partij => {  
            var checkpartij = parties.find((partij2) => partij2.name==partij.name);
            return checkpartij.secular == true;
        });
    } else if (filter == "min_size" && partij_size > 0) {
        result2 = result2.filter(partij => { // filter de te kleine partijen eruit  
            var checkpartij = parties.find((partij2) => partij2.name==partij.name);
            return checkpartij.size > partij_size;
        });
    } else if (filter == "max_size" && partij_size > 0) {
        result2 = result2.filter(partij => { 
            var checkpartij = parties.find((partij2) => partij2.name==partij.name);
            return checkpartij.size < partij_size;
        });
    } 

    result2 = findOcc(result2, "name"); // maak de resultaat array op volgorde van de meeste keer dezelfde mening per partij
    result2.sort((a, b) => {
        return a.occurrence - b.occurrence;
    });
    result2 = result2.reverse();

    if (result2.length > results_amount) {
        result2 = result2.slice(0, results_amount);
    }
    
    if (result2.length > 0) {
        list_results.textContent = '';
        for (i=0; i< result2.length; i++) {        
            create_element("li", "list_results", "result" + i, null, null);
            create_element("p", "result" + i, "p_result" + i, result2[i].name + ", aantal keer eens: "+ result2[i].occurrence+"");
        }
    } else {
        create_element("p", "uitslag", "noresult", "geen resultaten.");
    }
}

function create_element(element_create, id_append, id_element, text, classname, type, placeholder, value, forid) { //creëert elementen
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
    if (type !== "" && type !== null && typeof type !== 'undefined') {
        element.type = type; 
    }    
    if (placeholder !== "" && placeholder !== null && typeof placeholder !== 'undefined') {
        element.placeholder = placeholder;
    } 
    if (classname !== "" && classname !== null && typeof classname !== 'undefined') {
        element.className = classname;
    } 
    if (value !== "" && value !== null && typeof value !== 'undefined') {
        element.value = value;
    } 
    if (forid !== "" && forid !== null && typeof forid !== 'undefined') {
        element.setAttribute("for", forid);
    } 
    if (id_append == "body") {
        document.body.appendChild(element);
    } else {
        var element_append = document.getElementById(id_append);
        element_append.appendChild(element);   
    }
}

function findOcc(arr, key){
    let arr2 = [];
      
    arr.forEach((x)=>{
         
      // check of er een object in de array zit met dezelfde key value
       if(arr2.some((val)=>{ return val[key] == x[key] })){
         arr2.forEach((k)=>{
           if(k[key] === x[key]){ 
             k["occurrence"]++
           }
        })
           
       }else{
         //create object with key and occurrence = 1 
         let a = {}
         a[key] = x[key]
         a["occurrence"] = 1
         arr2.push(a);
       }
    })
      
    return arr2
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function openCity(evt, partijname) {
    if (document.getElementById(partijname) !== null) {
        var x = document.getElementsByClassName("mening");
        for (let i = 0; i < x.length; i++) {
            x[i].style.display = "none";  
            x[i].className.replace(" w3-red", "");
        }
        var y = document.getElementsByClassName("mening_buttons");

        for (let j = 0; j < y.length; j++) {
            y[j].className = y[j].className.replace(" w3-red", "");
        }
          
        document.getElementById(partijname).style.display = "block";  
        evt.currentTarget.className += " w3-red";
    }
}

class subjectanswer {
    answer = null;
    weight = 1;
    constructor(answer, weight) {
        this.answer = answer;
        this.weight = weight;
    }
}