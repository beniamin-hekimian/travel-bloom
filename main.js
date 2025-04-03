const searchInputArea = document.getElementById("searchInput");
const searchButton = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const resultDiv = document.getElementById("result");
var searchList = [];

const url = 'api.json';

// Search Destination and keyword
function searchDestination() {
    // Retrieve values frome the input
    const searchText = searchInputArea.value.toLowerCase();
    resultDiv.innerHTML = "";

    fetch(url)
        .then((response) => response.json()) // convert into json
        .then((data) => { // parse data
            // console.log(data);
            if (searchText.length == 0) { // check value if empty
                console.log("Please Insert Text");
                resultDiv.classList.replace("hide", "show");
                resultDiv.innerHTML = `<div class="dest-card">
                                           <small>Enter a valid Destination</small>
                                       </div>`;
                return;
            }
            const destination = lookUp(data, searchText);
            console.log(destination);
            if (destination.length !== 0) { // check value if entered
                displayResult(destination);
                searchList = [];
            } else {
                console.log("Enter a valid Destination");
                resultDiv.classList.replace("hide", "show");
                resultDiv.innerHTML = `<div class="dest-card">
                                           <small>Destination or Keyword Not Found</small>
                                       </div>`;
                return;
            }})
        .catch((error) => { // catch errors
            console.log("Error:", error);
        });
};

// This is the Look UP function for finding the destination via search input
function lookUp(array, input) {
    for (let key in array) {
        var value = array[key];
        // Check if the input is a (country, beach and temple keyword)
        if (input === key.toLowerCase() || key.toLowerCase().includes(input) || singularize(key.toLowerCase()) === input) {
            // Return the values
            return value;
        } else {
            // Return Destination per city input
            value.forEach(element => {
                // Check Input via country
                if (element.name.toLowerCase().includes(input)) {
                    searchList.push(element);
                // Check input via city name and make sure isn't undefined
                } else if (element.cities) {
                    if (element.cities.some((i) => i.name.toLowerCase().includes(input))) {
                        searchList.push(element.cities.find((item) => item.name.toLowerCase().includes(input)));
                    }
                }
            });
        };
    };
    return searchList;
};

// Display the results of the search Input.
function displayResult(destination) {
    if (destination) {
        resultDiv.innerHTML += `<div class="dest-card" style="background: #01696b;"></div>`;
        for (dest of destination) {
            // If it's a collection of cities
            if (dest.cities) {
                dest.cities.forEach((city) => {
                    resultDiv.classList.replace("hide", "show");
                    resultDiv.innerHTML += `<div class="dest-card">
                                                <img src ="${city.imageUrl}" alt="${city.name}"/>
                                                <main>
                                                    <h3>${city.name}</h3>
                                                    <p>${city.description}</p>
                                                    <p>Current Time is: ${timezoneIdentifier(city.timeZone)}</p>
                                                    <button>Visit</button>
                                                </main>
                                            </div>`;
                });
                return;
            } else {
                resultDiv.classList.replace("hide", "show");
                resultDiv.innerHTML += `<div class="dest-card">
                                            <img src ="${dest.imageUrl}" alt="${dest.name}"/>
                                            <main>
                                                <h3>${dest.name}</h3>
                                                <p>${dest.description}</p>
                                                <p>Current Time is: ${timezoneIdentifier(dest.timeZone)}</p>
                                                <button>Visit</button>
                                            </main>
                                        </div>`;
            }
        }
    };
}

// Clear Results from the site
function clearResult () {
    resultDiv.classList.replace("show", "hide");
    resultDiv.innerHTML = "";
}

// To singularize a word if it not found in the JSON Data.
function singularize (word) {
    const endings = {
        ves: 'fe',
        ies: 'y',
        i: 'us',
        zes: 'ze',
        ses: 's',
        es: 'e',
        s: ''
    };
    // Using REGEX to replace the endings of each if the known words into singular
    return word.replace(
        new RegExp(`(${Object.keys(endings).join('|')})$`),
        r => endings[r]
    );
}

// Indentifying the Time in the current time Zone
function timezoneIdentifier (input) {
    // Custom option values
    const option = { timeZone: input, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date().toLocaleTimeString("en-US", option);
}
// Adding event Listener when the enter key is added
searchInputArea.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchDestination();
    }
});

// On Click Event Listeners
searchButton.addEventListener("click", searchDestination);
clearBtn.addEventListener("click", clearResult);