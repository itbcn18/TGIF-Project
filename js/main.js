//  let dataArray = data.results[0].members;  Para tomar la data en "local"


let dataArray = []; // Array donde va a ir la data del Json

// Ver: https://www.todojs.com/api-fetch-el-nuevo-estandar-que-permite-hacer-llamadas-http/

// Para definir el tipo de miembro (página) en la que se va a trabajar
let chamber;

function typeOfMember() {
    if (window.location.href.includes("house")) { // Sintaxis para incluir en una url una palabra. Si existe dicha palabra, mostrará el contenido de esa página
        chamber = "house";
    } else {
        chamber = "senate";
    }
}
typeOfMember();
// console.log(chamber);


/*  =========  FETCH DATA  =========  */
function loadFetch() {

    // Call to Pro public data and request for house Json Data with a URL as a parameter
    fetch('https://api.propublica.org/congress/v1/113/' + chamber + '/members.json', { // Fetch hace la "llamada"
        method: 'GET', // Es el valor por defecto en caso de no especificarse
        headers: { // Parámetro de fetch(), donde pasaremos un objeto con las opciones.
            'X-API-Key': 'lz8S2pOfIh62EqdjaEjfJ28Jm9ScVissRwaLieyP'
        },

        // The API fetch() call returns a first promise
        // El método then() de esa promesa nos entrega un objeto response
        // Este objeto contiene la respuesta que hace el servidor y dispone de una serie de propiedades con los valores de esa respuesta
        // El contenido del body no está disponible directamente en este objeto Response y tenemos que llamar uno de los métodos disponibles para que nos devuelva una promesa donde recibiremos el valor enviado por el servidor
    }).then(function (response) { // Este primer "then" se ejecuta cuando el "Fetch" (la llamada) ha acabado
        if (response.ok) { // If response is "Ok" convert data to JSON format
            return response.json(); // Devuelve la "response" convertida a json
        }
        throw new Error(response.statusText);

        // Devuelve otra promesa que se resolverá cuando se haya obtenido el contenido
        // El método then() de esa promesa recibe el cuerpo devuelto por el servidor en formato de text
    }).then(function (json) { // When receiving the JSON, put in a variable and print in the console
        console.log(json)
        dataArray = json.results[0].members; // Esta info va a guardarse dentro de la variable, vacía, anteriormente creada y va a tomar de todo el JSON sólo los "members" por lo que entra con (.results[0].members)

        // Functions a llamar (Pasándoles un parámetro "dataArray" que ahora contiene la data del Json y está contenido dentro de la function "loadFetch", por lo que a las fucntions fuera de esta, se le debe de pasar también)
        createTable(dataArray);
        test();
        stateFilter(dataArray);
        populateStates(dataArray)


        // Se incluye un "catch()" en caso de producirse un error.
        // Sólo si hay un error de red o de otro tipo se ejecutará el catch()
    }).catch(function (error) {
        // Called when an error occurs anywhere in the chain
        console.log("Request Failed: " + error.message);
    });

    console.log(data);

    /*  LOADER  */
    /*  En conjunto con el CSS y HTML  */
    document.querySelector('tbody').style.display = 'none';
    document.getElementById('load').classList.add('loader');

    setTimeout(() => {
        document.getElementById('load').classList.remove('loader');
        document.querySelector('tbody').style.display = '';
    }, 4000);

}
loadFetch();


function createTable(congress) { // Este parámetro representa al array "data" - Al pasarle un parámetro, en este caso la function de filter, imprimirá los filtrados

    // console.log(congress);

    let tbody = document.getElementById('data'); // Se hace un get para obtener el elemento donde luego se le va a añadir informacion

    tbody.innerHTML = ""; // Limpia la tabla, como más abajo en el código le especifico cuando mostrar los datos (dependiendo de lo que esté checked) en principio no hace su función de "clear table"

    // Recorrer el array
    for (let i = 0; i < congress.length; i++) { //  Esta "i" al ser una variable "let" morirá cuando acabe el bloque, no se podrá utilizar

        // Creamos el elemento (la fila), y lo guardamos dentro de una variable
        let tableRow = document.createElement("tr");

        if (i % 2 != 0) { //  Colocar color a especificos index (en este caso a los pares)
            tableRow.setAttribute("class", "table-color")
        }

        // Crear elementos que irán dentro de la fila ya creada
        let fullName = document.createElement("td");
        // Crear condition para que si en algún miembro existe un "middle_name" como "null" no imprimirlo
        if (congress[i].middle_name === null) { // Se le indica que del array, el elemento "middle_name" que indique "null", aplique tal cosa
            fullName.textContent = congress[i].last_name + ", " + congress[i].first_name;
        } else {
            fullName.textContent = congress[i].last_name + ", " + congress[i].first_name + " " + congress[i].middle_name;
        }

        let party = document.createElement("td");
        party.textContent = congress[i].party;

        let state = document.createElement("td");
        state.textContent = congress[i].state;

        let seniority = document.createElement("td");
        seniority.textContent = congress[i].seniority;

        let percentage = document.createElement("td");
        percentage.textContent = congress[i].votes_with_party_pct + " %";

        tableRow.append(fullName, party, state, seniority, percentage);

        tbody.appendChild(tableRow); // appendChild, permite añadir un solo elemento, mientras que el "append", permite añadir varios (name,age)

    }

}

// CHECKBOX AND FILTERS

// Se vincula los elementos (checkboxes) a través de clases y el dropdown a través de ID
let checkboxes = document.getElementsByClassName("party-checkbox"); // Devuelve un Array de nodelist
// Al tomar elementos a través de "className" se debe de recorrer los mismos uno a uno
for (let i = 0; i < checkboxes.length; i++) {
    // console.log(checkboxes);
    checkboxes[i].addEventListener("click", test); // Se le agrega al nuevo array creado un evento, pasándole el evento y una function que es un listener, acá no se está llamando a la function, indica en donde está la function
}

// Dropdown Filter
document.getElementById('stateSelector').addEventListener('change', test);


function test() {

    // console.log("Funciona", checkboxes);

    // Array para meter todos los checkboxes existentes (saber cuántos checkboxes hay) con sus respectivos "values"
    let checkedCheckbox = [];
    for (let i = 0; i < checkboxes.length; i++) { // Recorrer sobre los 3 checkboxes
        if (checkboxes[i].checked) { // Condition de si está "checked" el checkbox, meterlo en el array vacío
            checkedCheckbox.push(checkboxes[i].value); // Sube al array vacío el "value" de cada "checkbox"
        }
    }
    // console.log(checkedCheckbox);

    // Array Filtrados por partido político
    // Comparar los values con el Key del value "party" del Json, si coinciden hacer el push
    let partyChecked = [];
    for (let j = 0; j < dataArray.length; j++) {
        if (checkedCheckbox.includes(dataArray[j].party)) { // ".includes" trabaja como una function
            partyChecked.push(dataArray[j]);
        }
    }

    // console.log(partyChecked);

    // Condition para mostrar contenido de la tabla dependiendo de lo que este checked
    if (checkedCheckbox.length == 0) { // Si no hay nada "checked"
        stateFilter(dataArray); // Corre la function del array de los miembros según su estado checked
    } else { //  Si hay algo checked crea la tabla con sólo lo que se haya checked
        stateFilter(partyChecked); // corre la function del array de los miembros por partido específico
    }

}


function stateFilter(array) { // Se le pasa la data, el array "dataArray" como parámetro
    let arrayFiltrada = [];
    let currentState = document.getElementById('stateSelector').value; // Toma el ID del elemento en el Html al que se le va a pasar un "value" del Json.

    for (let i = 0; i < array.length; i++) {
        if (currentState == array[i].state || currentState == 'All') { // Si el "value" del json corresponde al "state" o al value "All" del html, llenar el "arrayFiltrada" con dichos valores
            arrayFiltrada.push(array[i]);
        }
    }
    createTable(arrayFiltrada); // Se llama a la Function de "createTable" pasándole como parámetro la nueva array "arrayFiltrada" por "state"

    // Checkear si no hay resultados una vez filtrado y mostrar mensaje
    let checkDem = document.getElementById("checkDemocrat").checked;
    let checkRep = document.getElementById("checkRepublican").checked;
    let checkInd = document.getElementById("checkIndependent").checked;

    if ((checkDem || checkRep || checkInd) && (arrayFiltrada.length == 0)) {

        document.getElementById('results').style.display = 'block';
    } else {

        document.getElementById('results').style.display = 'none';
    }

}


// DROPDOWN FILTER
// Function para llenar el dropdown con todas las opciones
function populateStates(dataArray) {

    // Array vacío en donde se van a meter los states
    let states = [];
    for (let i = 0; i < dataArray.length; i++) {
        if (!states.includes(dataArray[i].state)) { // Si tal estado NO está incluido en el array vacio que vamos llenando, súbelo
            states.push(dataArray[i].state);
        }
    }

    states.sort(); // Para ordenarlos por orden alfabético

    //Add the Options to the DropDownList.
    for (let i = 0; i < states.length; i++) {
        let option = document.createElement("option"); // "option" corresponde al tag element
        option.innerHTML = states[i];
        // Asociarla al selector
        document.getElementById('stateSelector').append(option);
    }

}