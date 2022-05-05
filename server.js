const express = require('express');
const app = express();
const { animals } = require('./data/animals.json');

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray  = [];
    
    // save the animalsArray as filteredResults here
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        // save personalityTraits as a dedicated array
        // if personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        }
        else {
            personalityTraitsArray = query.personalityTraits;
        }

        // the loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember this is initially a copy of the animalsArray
            // Except here we're updating it for each traitin the .forEach() loop
            // For each trait being targeted by the filter, the filteredResults array will  then contain only the entries that contain that trait
            // At the end we'll have an array of animals that have every one of the traits when the .forEach() loop is finished
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
        
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }

    // Return the filtered results
    return filteredResults;
}
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});
// said to add to the end of server.js ???
app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
});