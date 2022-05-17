const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals.json');
const PORT = process.env.PORT || 3001;
const app = express();

// make public files readily available (static resources); makes front-end code accessed without having a specific server endpoint created for it!
app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];

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
            // Except here we're updating it for each trait in the .forEach() loop
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

// take in the id and array of animals and return a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body
    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    // return finished code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }

    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }

    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }

    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }

    return true;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// Route that accepts data to be used or stored server-side
app.post('/api/animals', (req, res) => {

    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrectm send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    }
    else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        res.json(animal);
    }
});

// Route ('/') that brings us to the root route of the server/route used to create the homepage for a server and repsond with the index.html file; front end
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// GET route to join the animals.html to the root path of the server
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// GET route to join the zookeepers.html to the root path of the server
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// GET 'wildcard' route to catch requests for routes that do not exist
// '*' wildcard route must always come last
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// app.listen always needs to be last
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});