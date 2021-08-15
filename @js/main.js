'use strict';
window.onload = (ev) => {
    // Quantity of movies per month -------------------------------------------
    const num_moviesQuantity__validateInput = ev => {
        if (num_moviesQuantity.value <= 0) {
            msj_moviesQuantity.innerText = 'Please input a number greater or equal than 1';
            return false;
        }
        else if (num_moviesQuantity.value > 60) {
            msj_moviesQuantity.innerText = 'Come on! Do you really see more than 2 movies per day. That\'s too much my friend. I think you need to get a life.';
            return false;
        }
        else {
            msj_moviesQuantity.innerText = '';
            return true;
        };
    };
    const num_moviesQuantity = document.getElementById('num_moviesQuantity');
    const msj_moviesQuantity = document.getElementById('msj_moviesQuantity');
    num_moviesQuantity.addEventListener('change', num_moviesQuantity__validateInput);

    // Video Streaming Service Providers --------------------------------------
    let saasMonthTotal = 0;
    const cb_saas__validateChecked = ev => {
        if (!cb_netflix.checked && !cb_prime.checked && !cb_disney.checked && 
        !cb_hbomax.checked && !cb_blim.checked && !cb_clarovideo.checked && 
        !cb_hulu.checked) {
            msj_saas.innerText = 'You have to select at least 1 service to make a comparation.';
            return false;
        }
        else {
            msj_saas.innerText = '';
            saasMonthTotal += cb_netflix.checked ? Number(cb_netflix.value) : 0;
            saasMonthTotal += cb_prime.checked ? Number(cb_prime.value) : 0;
            saasMonthTotal += cb_disney.checked ? Number(cb_disney.value) : 0;
            saasMonthTotal += cb_hbomax.checked ? Number(cb_hbomax.value) : 0;
            saasMonthTotal += cb_blim.checked ? Number(cb_blim.value) : 0;
            saasMonthTotal += cb_clarovideo.checked ? Number(cb_clarovideo.value) : 0;
            saasMonthTotal += cb_hulu.checked ? Number(cb_hulu.value) : 0;
            return true;
        };
    };
    const cb_netflix = document.getElementById('cb_netflix');
    const cb_prime = document.getElementById('cb_prime');
    const cb_disney = document.getElementById('cb_disney');
    const cb_hbomax = document.getElementById('cb_hbomax');
    const cb_blim = document.getElementById('cb_blim');
    const cb_clarovideo = document.getElementById('cb_clarovideo');
    const cb_hulu = document.getElementById('cb_hulu');

    // Aditional input: Number of persons -------------------------------------
    const num_numberOfPersons__validateInput = ev => {
        if (num_numberOfPersons.value < 0) {
            msj_numberOfPersons.innerText = 'Please input a number greater or equal than 0';
            return false;
        }
        else if (num_numberOfPersons.value > 10) {
            msj_numberOfPersons.innerHTML = 'Really!?, do you invite the whole neighborhood? Or maybe you have a lot of kids, in that case stop making kids, come on!';
            return false;
        }
        else {
            msj_numberOfPersons.innerHTML = '';
            return true;
        }
    }
    const num_numberOfPersons = document.getElementById('num_numberOfPersons');
    const msj_numberOfPersons = document.getElementById('msj_numberOfPersons');
    num_numberOfPersons.addEventListener('change', num_numberOfPersons__validateInput);

    // Main sum function for movie theater (returns Object with detailed costs) ----
    const sumOfAllCostsAtMovieTheater = () => {
        // Snack selectors --------------------------------------------------------
        const nodeListSnacks = document.querySelectorAll('[name*="snacks"]');
        const randomDetailsArray = [];
        randomDetailsArray.push({
                "concept": 'tickets',
                "quantity": (Number(num_numberOfPersons.value) + 1) * Number(num_moviesQuantity.value),
                "totalCost": (Number(num_numberOfPersons.value) + 1) * Number(num_moviesQuantity.value) * 2
            }
        );
        nodeListSnacks.forEach(element => {
            if (element.checked) {
                const randomQuantity = Math.ceil(Math.random() * (Number(num_numberOfPersons.value) + 1) * Number(num_moviesQuantity.value));
                randomDetailsArray.push({
                        "concept": element.id.substring(3),
                        "quantity": randomQuantity,
                        "totalCost": randomQuantity * Number(element.value)
                    }
                );
            }
            else
                return false;
        });
        return randomDetailsArray;
    };

    const btn_compare = document.getElementById('btn_compare');
    const msj_resultsError = document.getElementById('msj_resultsError');
    const resultsDiv = document.getElementById('results');
    btn_compare.addEventListener('click', ev => {
        saasMonthTotal = 0;
        if (!num_moviesQuantity__validateInput() || !cb_saas__validateChecked() || !num_numberOfPersons__validateInput()) {
            msj_resultsError.innerText = 'Can\'t proceed with the comparation because there\'s some invalid input.';
            resultsDiv.innerHTML = '';
            resultsDiv.style = 'display: none;';
            return false;
        }
        else {
            // HTML Elements initialization -----------------------------------
            resultsDiv.innerHTML = '';
            resultsDiv.style = 'display: block;';
            msj_resultsError.innerText = '';

            // Money formatter initialization ---------------------------------
            const divisa = new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Money money money ----------------------------------------------
            const averageISPTotal = 15;
            const averagePowerCost = Number(num_moviesQuantity.value) * 2;
            const saasAbsoluteTotal = saasMonthTotal + averageISPTotal + averagePowerCost;
            const saasResultsParagraph = document.createElement('p');
            const saasResultsText = document.createTextNode('If you watch that quantity of movies using streaming services, the amount for subscription is ' + divisa.format(saasMonthTotal) + ', and considering an average of $15 USD for monthly internet service cost and ' + divisa.format(averagePowerCost) + ' for electricity consumption per movie, the absolute total is: ' + divisa.format(saasAbsoluteTotal));
            saasResultsParagraph.appendChild(saasResultsText);
            resultsDiv.appendChild(saasResultsParagraph);

            const mtDetails = sumOfAllCostsAtMovieTheater();
            let movieTheaterTotal = 0;
            const mtResultsParagraph = document.createElement('p');
            const mtResultsText = document.createTextNode('If you decide to watch that quantity of movies at the Movie Theater, you will have to pay: ');
            mtResultsParagraph.appendChild(mtResultsText);
            resultsDiv.appendChild(mtResultsParagraph);

            mtDetails.forEach(element => {
                movieTheaterTotal += element.totalCost;
                const mtDetailsParagraph = document.createElement('p');
                const mtDetailsText = document.createTextNode('For ' + element.quantity + ' ' + element.concept + ' a total of ' + divisa.format(element.totalCost));
                mtDetailsParagraph.appendChild(mtDetailsText);
                resultsDiv.appendChild(mtDetailsParagraph);
            });
            const mtTotalParagraph = document.createElement('p');
            const mtTotalText = document.createTextNode('Which give us a total of: ' + divisa.format(movieTheaterTotal));
            mtTotalParagraph.appendChild(mtTotalText);
            resultsDiv.appendChild(mtTotalParagraph);

            const conclusionParagraph = document.createElement('p');
            const conclusionText = document.createTextNode('For the sake of your budget, it would be better if you decide to watch those movies ' + (saasAbsoluteTotal < movieTheaterTotal ? 'using the Video Streaming Services.' : 'at the nearest Movie Theater.'));
            conclusionParagraph.appendChild(conclusionText);
            resultsDiv.appendChild(conclusionParagraph);

            return true;
        }
    });
}