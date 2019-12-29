const fs = require('fs');
const express = require('express')
const app = express()
const port = 3000

// express configuration
app.use(express.json({type: '*/*'}));

// Set your routes
app.get('/', (req, res) => res.send('Hello World!'))
app.post('/', function (req, res) {
    
    let obj = req.body;
    if( obj && obj.dependencies && obj.dependencies.express )
    {
        res.send(`Package delivered. A blessed golden key appears. ${JSON.stringify(req.body)}`);
        fs.writeFileSync('golden_key', "");
    }
    else
    {
        res.send(`Nothing happens: ${JSON.stringify(req.body)}`);
    }

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))