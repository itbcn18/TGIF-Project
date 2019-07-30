let members = data.results[0].members;


// Crea un objeto "Statistics" con valores "0" para guardar datos
let statistics = {
    republican: 0,
    republican_votes: 0,
    republican_missed_votes: 0,
    democrat: 0,
    democrat_votes: 0,
    democrat_missed_votes: 0,
    independent: 0,
    independent_votes: 0,
    independent_missed_votes: 0,
};

calcStatistics();
// Se llama a la function 2 veces ya que trata a dos "id"
topArray("leastEngagedData");
topArray("mostEngagedData");



function calcStatistics() {
    members.forEach(member => {
        if (member.party == "R") {
            // Epic 1
            // Task 1  Get the number of members in each party
            statistics.republican++; //  ++ Para ir sumando ya que es un número
            // Task 2  Calculate the average "votes with party" for each party
            statistics.republican_votes += member.votes_with_party_pct;
            // Missed Votes 
            statistics.republican_missed_votes += member.missed_votes;
            // Total Votes 
            statistics.republican_total_votes += member.total_votes;
        }
        if (member.party == "D") {
            statistics.democrat++;
            statistics.democrat_votes += member.votes_with_party_pct;
            statistics.democrat_missed_votes += member.missed_votes;
            // Total Votes 
            statistics.democrat_total_votes += member.total_votes;
        }
        if (member.party == "I") {
            statistics.independent++;
            statistics.independent_votes += member.votes_with_party_pct;
            statistics.independent_missed_votes += member.missed_votes;
            // Total Votes 
            statistics.independent_total_votes += member.total_votes;
        }

    });


    // Total average for party
    statistics.totalAvgR = statistics.republican_votes / statistics.republican;
    statistics.totalAvgD = statistics.democrat_votes / statistics.democrat;
    statistics.totalAvgI = statistics.independent_votes / statistics.independent;

    // The Total Row
    statistics.totalReps = statistics.republican + statistics.democrat + statistics.independent;
    statistics.totalAvg = (statistics.republican_votes + statistics.democrat_votes + statistics.independent_votes) / statistics.totalReps;

    // Para eliminar EL "NaN" que aparece en los "Independents"
    if ( statistics.independent != 0) {
        return statistics.totalAvgI = statistics.independent_votes / statistics.independent; 
    } else {
        return statistics.totalAvgI = 0;
    }

}



//  Function de Imprimir en la tabla la info
function paintTable(arrayTopMembers, id) {   // Se le pasa dos parámetros (El array Cortado , y el id)

    // Glance Table
    document.getElementById("numRepublicans").innerHTML = statistics.republican;
    document.getElementById("votesRepublicans").innerHTML = statistics.totalAvgR.toFixed(2);

    document.getElementById("numDemocrats").innerHTML = statistics.democrat;
    document.getElementById("votesDemocrats").innerHTML = statistics.totalAvgD.toFixed(2);

    document.getElementById("numIndependents").innerHTML = statistics.independent;
    document.getElementById("votesIndependents").innerHTML = statistics.totalAvgI.toFixed(2);

    document.getElementById("numTotal").innerHTML = statistics.totalReps;
    document.getElementById("votesTotal").innerHTML = statistics.totalAvg.toFixed(2);

    

    let tbody = document.getElementById(id); // Se hace un get para obtener el elemento donde luego se le va a añadir información y se guarda en una variable
    // let tbody = document.getElementById('mostEngagedData');

    // Recorrer el array cortado
    for (let i = 0; i < arrayTopMembers.length; i++) { //  Esta "i" al ser una variable "let" morirá cuando acabe el bloque, no se podrá utilizar

        // Creamos el elemento (la fila), y lo guardamos dentro de una variable
        let tableRow = document.createElement("tr");

        if (i % 2 != 0) { //  Colocar color a especificos index (en este caso a los pares)
            // tableRow.setAttribute("class", "table-primary");
            tableRow.setAttribute("class", "table-color");
        }

        // Creación de los elementos de la tabla (fullName, Missed Votes, Percentage)
        let fullName = document.createElement("td");
        // Crear condition para que si en algún miembro existe un "middle_name" como "null" no imprimirlo
        if (members[i].middle_name === null) { // Se le indica que del array, el elemento "middle_name" que indique "null", aplique tal cosa
            fullName.textContent = arrayTopMembers[i].last_name + ", " + arrayTopMembers[i].first_name;
        } else {
            fullName.textContent = arrayTopMembers[i].last_name + ", " + arrayTopMembers[i].first_name + " " + arrayTopMembers[i].middle_name;
        }

        let numberMissedVotes = document.createElement("td");
        numberMissedVotes.textContent = arrayTopMembers[i].missed_votes;

        let percentage = document.createElement("td");
        percentage.textContent = arrayTopMembers[i].missed_votes_pct + " %"; // imprimir en ese elemento creado el top del 10%
        

        // Function para colocar en un array aquellos miembros que cumplan la condición de votos perdidos = o por encima del 10%
        // function topMissed(arr) {

        //     let voidArray = [];  // Array vacío al que irán esos miembros 
        //     for (let i = 0; i < arr.length; i++) {
        //         if (arr[i].missed_votes_pct >= 10) {  // Condición
        //             voidArray.push(arr[i]);  // Enviar al array Vacío
        //         }
        //     }
        //     //  console.log(voidArray);
        //     percentage.textContent = voidArray[i].missed_votes_pct + " %";  // imprimir en la tabla el array específico (el nuevo array vacío) con los miembros que cumplieron la condición
        // }

        // topMissed(members);

        tableRow.append(fullName, numberMissedVotes, percentage);

        tbody.appendChild(tableRow); // appendChild, permite añadir un solo elemento, mientras que el "append", permite añadir varios (name,age)
    }

}


// Function del Array Cortado
function topArray(id) {

    // Ordenar de manera asecendente y descendente la columna que será el "percentage"
    let sortedByMissed = members.sort(function (a, b) {
        
        // ATTENDANCE
        let mostMissed = b.missed_votes_pct - a.missed_votes_pct;  // De mayor a menor pérdida de votos
        let leastMissed = a.missed_votes_pct - b.missed_votes_pct; // si a-b el resultado da negativo, ordenará de manera ascendente, ya que indica que el segundo parámetro es mayor que el primer
        
            if(id == "leastEngagedData") return mostMissed;
            else return leastMissed;

    });

    let topTen = Math.round(members.length * 0.1);
    let topMissed = sortedByMissed.slice(0, topTen);  // El array cortado

    let last = topMissed[topMissed.length-1];  // Último elemento de dicho array

    // Para que aparezcan también los otros miembros que ya no entran en el 10% pero que sus porcentajes coinciden con los últimos que si entran (Se quiere comparar uno de los objetos)
    while (last.missed_votes_pct == members[topTen].missed_votes_pct) {  // (last.missed_votes_pct) se refiere al último de esa determinada columna
        topMissed.push(members[topTen]);  // members en la posición "topTen" (Que haga un push de esos elementos al array "topMissed")
        topTen++;
    }
    console.log(topTen);

    paintTable(topMissed, id)  // Llamo a la otra function pasándole el array cortado y un id 

}


// Ejemplo para sacar el 10% y colocar ese 10% en un nuevo array y verificar si hay repetidos
// function arrayCortado() {
//     let newlength = members.length * 0.1;
//     // Se crea un array vacío
//     let shortArray = [];

//     for (let i = 0; i < newlength; i++) {
//         shortArray.push(members[i]);
//     }

//     console.log(shortArray);

//     let last = shortArray[shortArray.length-1];
//     while (last == members[newlength]) {
//         shortArray.push[members[newlength]];
//         newlength ++;
//     }
//     console.log(shortArray);
// }

// arrayCortado();