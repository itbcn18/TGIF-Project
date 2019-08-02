// let members = data.results[0].members;  Para tomar la data en "local"


/*  =========  FETCH DATA  =========  */

// Ver: https://www.todojs.com/api-fetch-el-nuevo-estandar-que-permite-hacer-llamadas-http/

let chamber;
// Para definir el tipo de miembro (página) en la que se va a trabajar
function typeOfMember() {
    if (window.location.href.includes("house")) {
        chamber = "house";
    } else {
        chamber = "senate";
    }
}
typeOfMember();
console.log(chamber);


function loadFetch() {

    // Call to Pro public data and request for house Json Data with a URL as a parameter
    fetch('https://api.propublica.org/congress/v1/113/' + chamber + '/members.json', {
        method: 'GET',
        headers: {
            'X-API-Key': 'lz8S2pOfIh62EqdjaEjfJ28Jm9ScVissRwaLieyP'
        },

    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);

    }).then(function (json) {
        console.log(json)
        let dataArray = json.results[0].members;


        calcStatistics(dataArray);
        // Se llama a la function 2 veces ya que trata a dos "id" diferentes
        topArray("leastLoyalData", dataArray);
        topArray("mostLoyalData", dataArray);


    }).catch(function (error) {
        console.log("Request Failed: " + error.message);
    });


    /*  LOADER  */
    document.querySelector('tbody').style.display = 'none';
    document.getElementById('load').classList.add('loader');

    setTimeout(() => {
        document.getElementById('load').classList.remove('loader');
        document.querySelector('tbody').style.display = '';
    }, 4000);
}
loadFetch();



// Crea un objeto "Statistics" con valores "0" para guardar datos
let statistics = {
    republican: 0,
    republican_votes: 0,
    republican_total_votes: 0,
    democrat: 0,
    democrat_votes: 0,
    democrat_total_votes: 0,
    independent: 0,
    independent_votes: 0,
    independent_total_votes: 0,

};

// Cálculo de las estadísticas
function calcStatistics(members) {
    members.forEach(member => {
        if (member.party == "R") {
            // Get the number of members in each party
            statistics.republican++; //  ++ Para ir sumando ya que es un número
            // Calculate the average "votes with party" for each party
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
            statistics.democrat_total_votes += member.total_votes;
        }
        if (member.party == "I") {
            statistics.independent++;
            statistics.independent_votes += member.votes_with_party_pct;
            statistics.independent_missed_votes += member.missed_votes;
            statistics.independent_total_votes += member.total_votes;
        }

    });


    // Total average for party (%)
    statistics.totalAvgR = statistics.republican_votes / statistics.republican;
    statistics.totalAvgD = statistics.democrat_votes / statistics.democrat;
    statistics.totalAvgI = statistics.independent_votes / statistics.independent;

    // The Total Row
    statistics.totalReps = statistics.republican + statistics.democrat + statistics.independent;
    statistics.totalAvg = (statistics.republican_votes + statistics.democrat_votes + statistics.independent_votes) / statistics.totalReps;

    // Para eliminar EL "NaN" que aparece en los "Independents"
    if (statistics.independent != 0) {
        return statistics.totalAvgI = statistics.independent_votes / statistics.independent;
    } else {
        return statistics.totalAvgI = 0;
    }

}



//  Function de Imprimir en la tabla la info
function paintTable(arrayTopMembers, id) { // Se le pasa dos parámetros (El array Cortado , y el id)

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


    // Recorrer el array cortado
    for (let i = 0; i < arrayTopMembers.length; i++) {

        // Creamos el elemento (la fila), y lo guardamos dentro de una variable
        let tableRow = document.createElement("tr");

        if (i % 2 != 0) { //  Colocar color a especificos index (en este caso a los pares)
            tableRow.setAttribute("class", "table-color")
        }

        // Creación de los elementos de la tabla (fullName, Missed Votes, Percentage)
        let fullName = document.createElement("td");
        // Crear condition para que si en algún miembro existe un "middle_name" como "null" no imprimirlo
        if (arrayTopMembers[i].middle_name === null) { // Se le indica que del array, el elemento "middle_name" que indique "null", aplique tal cosa
            fullName.textContent = arrayTopMembers[i].last_name + ", " + arrayTopMembers[i].first_name;
        } else {
            fullName.textContent = arrayTopMembers[i].last_name + ", " + arrayTopMembers[i].first_name + " " + arrayTopMembers[i].middle_name;
        }


        // PARTY LOYALTY
        let partyTotalVotes = document.createElement("td");
        partyTotalVotes.textContent = arrayTopMembers[i].total_votes;

        let partyLoyaltyPercentage = document.createElement("td");
        partyLoyaltyPercentage.textContent = arrayTopMembers[i].votes_with_party_pct; //SEGUIR ACÁ

        // Añadir resultados a las filas de la tabla
        tableRow.append(fullName, partyTotalVotes, partyLoyaltyPercentage);

        tbody.appendChild(tableRow); // appendChild, permite añadir un solo elemento, mientras que el "append", permite añadir varios (name,age)
    }

}


// Function del Array Cortado (top 10% incluyendo los que tengan mismo valor que el último del top 10% oficial)
function topArray(id, members) {

    // Ordenar de manera asecendente y descendente la columna que será el "percentage"
    let sortedByTotalVotes = members.sort(function (a, b) {

        // PARTY
        let mostLoyal = b.votes_with_party_pct - a.votes_with_party_pct; // De mayor a menor pérdida de votos
        let leastLoyal = a.votes_with_party_pct - b.votes_with_party_pct; // si a-b el resultado da negativo, ordenará de manera ascendente, ya que indica que el segundo parámetro es mayor que el primer

        if (id == "leastLoyalData") return leastLoyal;
        else return mostLoyal;

    });

    let topTen = Math.round(members.length * 0.1); // Sacar el 10 % de la lista
    let topVotes = sortedByTotalVotes.slice(0, topTen); // El array cortado hasta el 10 %

    let last = topVotes[topVotes.length - 1]; // Último elemento de dicho array

    // Para que aparezcan también los otros miembros que ya no entran en el 10% pero que sus porcentajes coinciden con los últimos que si entran (Se quiere comparar uno de los objetos)
    while (last.votes_with_party_pct == members[topTen].votes_with_party_pct) { // (last.votes_with_party_pct) se refiere al último de esa determinada columna
        topVotes.push(members[topTen]); // members en la posición "topTen" (Que haga un push de esos elementos al array "topVotes")
        topTen++;
    }
    console.log(topTen);

    paintTable(topVotes, id) // Llamo a la otra function pasándole el array cortado y un id 

}