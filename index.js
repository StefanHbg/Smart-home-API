const { app } = require('./core'); 
const { db, update } = require('./db')

app.listen(3000, () => {
    console.log('API for smart home 1.1 up n running.')
})

/* CODE YOUR API HERE */

// Använd den här URL för insomnia/postman: http://localhost:3000/light/lig1?&on=true&brightness=1&color=FFDE67  : bestämt vilken lampa genom lig1, lig2, lig3 och toggla mellan on=true eller on=false och brightness nivån mellan 0-1 och ändra color.

app.get('/light/:id', (req, res) => {
    // Variabel som jag använder för att skriva ut om lampan är igång eller släckt
    let resMessage;

    // Access query parameters
    let on = req.query.on;

    if(on === 'true') {
        on = true;
        resMessage = 'Lampan är nu igång'
    } else if (on === 'false'){
        on = false;
        resMessage = 'Lampan är nu släckt'
    }
    let brightness = req.query.brightness;
    let color = req.query.color
    db
    .get('devices')
    .find({ id : req.params.id.toUpperCase() })
    .assign({ on : on }) // Turn on the device
    .assign({ brightness : brightness }) // Adjust brightness
    .assign({ color : '#' + color }) // adjust color
    .value();
    update(); // tell frontend to update state.
    res.send(resMessage)
})

// Använd den här URL i insomnia/postman: http://localhost:3000/ac/ac1?&on=true&temperature=5  och ändra mellan on=true eller on=false för att tända och släcka ACn. Genom att ändra temperature=5 ändrar du graderna för ACn.

app.get('/ac/:id', (req, res) => {
    // Variabel som jag använder för att skriva ut om ACn är igång eller släckt
    let resMessage;

    // Accesa query parameters
    let on = req.query.on;
    let temperature = req.query.temperature;
    
    if(on === 'true') {
        on = true;
        resMessage = 'AC:n är nu igång'
    } else if (on === 'false'){
        on = false;
        resMessage = 'AC:n är släckt'
    }
    db
    .get('devices')
    .find({ id : req.params.id.toUpperCase() })
    .assign({ on : on }) // turn on the device
    .assign({ temperature : temperature }) // adjust temperature
    .value();
    update(); // tell frontend to update state.
    res.send(resMessage);
})

// Använd den här URL i insomnia/postman: http://localhost:3000/blind/bli1?&on=true  och ändra mellan on=true eller on=false för att dra på eller av gardinen.

app.get('/blind/:id', (req, res) => {
    // Variabel som jag använder för att skriva ut om gardinen är dragen eller ej
    let resMessage;

    // Accesa query parameters
    let on = req.query.on;

    if(on === 'true') {
        on = true;
        resMessage = 'Gardinen är nu dragen.'
    } else if (on === 'false'){
        on = false;
        resMessage = 'Gardinen är nu avdragen.'
    }
    db
    .get('devices')
    .find({ id : req.params.id.toUpperCase() })
    .assign({ on : on }) // turn on the device
    .value();
    update(); // tell frontend to update state.
    res.send(resMessage);
})

// Använd den här URL i insomnia/postman: http://localhost:3000/lock/loc1?&locked=true  och toggla mellan locked=true locked=false för att tända och släcka kameran

app.get('/camera/:id', (req, res) => {
    // Variabel som jag använder för att skriva ut om dörrkameran är igång eller släckt
    let resMessage;

    // Accesa query parameters
    let on = req.query.on;

    if(on === 'true') {
        on = true;
        resMessage = 'Dörr kameran är nu igång.'
    } else if (on === 'false'){
        on = false;
        resMessage = 'Dörr kameran är nu släckt.'
    }
    db
    .get('devices')
    .find({ id : req.params.id.toUpperCase() })
    .assign({ on : on }) // turn on the device
    .value();
    update(); // tell frontend to update state.
    res.send(resMessage);
})

// Använd den här URL i insomnia/postman: http://localhost:3000/lock/loc1?&locked=true låser dörren.
//http://localhost:3000/lock/loc1?&locked=false&code=1234 låser upp dörren.

app.get('/lock/:id', (req, res) => {
    // Variabel som jag använder för att skriva ut om dörren är låst eller ej.
    let resMessage;

    // Accesa query parameters
    let locked = req.query.locked;    
    let code = req.query.code;

    if((locked === 'false') && ((code === '1234'))) {
        locked = true;
        resMessage = 'Dörren är nu upplåst.'
        
        // Jag skickar denna data till databasen i båda if:satserna på grund av koden på dörren. 
        // Hade jag endast skickat denna datan till databasen en gång så hade dörren blivit upplåst även fast jag inte skriver i koden.
        db
        .get('devices')
        .find({ id : req.params.id.toUpperCase() })
        .assign({ locked : locked }) // lås upp dörren
        .assign({ code : code }) // koden till dörren
        .value();
        update(); // tell frontend to update state.
    } else if (locked === 'true'){
        locked = false;
        resMessage = 'Dörren är låst.'
        db
        .get('devices')
        .find({ id : req.params.id.toUpperCase() })
        .assign({ locked : locked }) // lås upp dörren
        .assign({ code : code }) // koden till dörren
        .value();
        update(); // tell frontend to update state.
    }
    res.send(resMessage);
})

app.get('/speaker/:id', (req, res) => {
    // Variabel som jag använder för att skriva ut om högtalaren är igång eller ej.
    let resMessage;

    // Accesa query parameters
    let on = req.query.on;

    if(on === 'true') {
        on = true;
        resMessage = 'Högtalaren är nu igång.'
    } else if (on === 'false'){
        on = false;
        resMessage = 'Högtalaren  är nu släckt.'
    }
    db
    .get('devices')
    .find({ id : req.params.id.toUpperCase() })
    .assign({ on : on }) // starta högtalaren
    .value();
    update(); // tell frontend to update state.
    res.send(resMessage);
})

// Använd denna URL i insomnia/postman: http://localhost:3000/vacuum/vac1?&on=true toggla mellan on=true och on=false för att sätta på och släcka dammsugaren

app.get('/vacuum/:id', (req, res) => {
    // Variabel som jag använder för att skriva ut om dammsugaren är igång eller ej.
    let resMessage;

    // Accesa query parameters
    let on = req.query.on;

    if(on === 'true') {
        on = true;
        resMessage = 'Dammsugaren är på.'
    } else if (on === 'false'){
        on = false;
        resMessage = 'Dammsugaren är av.'
    }
    db
    .get('devices')
    .find({ id : req.params.id.toUpperCase() })
    .assign({ on : on }) // turn on the device
    .value();
    update(); // tell frontend to update state.
    res.send(resMessage);
})
