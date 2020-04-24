const http = require('http');
const httpProxy = require('http-proxy');
const child = require('child_process');

let agents = ['http://localhost:3005', 'http://localhost:3006', 'http://localhost:3007'];

createInstances();
main();

// Cleanup
process.on('SIGINT', function() {

    console.log("Stopping containers...");
    child.execSync("docker stop app1")
    child.execSync("docker stop app2")
    child.execSync("docker stop app3")

    process.exit();
});

function createInstances()
{
    child.execSync("docker run --rm --name app1 -d -p 127.0.0.1:3005:80/tcp app-server")
    child.execSync("docker run --rm --name app2 -d -p 127.0.0.1:3006:80/tcp app-server")
    child.execSync("docker run --rm --name app3 -d -p 127.0.0.1:3007:80/tcp app-server")
}
let node2Url = {app1: 'localhost:3005', app2: 'localhost:3006', app3: 'localhost:3007' };
let timings = {
    'localhost:3005': [], 
    'localhost:3006': [], 
    'localhost:3007': []
};


function main()
{
    let options = {};
    let proxy   = httpProxy.createProxyServer(options);

    // Redirect requests to the active TARGET
    let server  = http.createServer(function(req, res)
    {
        console.log("Received request");

        if( req.url === "/health" && req.method == "GET" )
        {            
            // Send docker stats and timings
            health(res);
        }
        else
        {
            let target = agents[0];
            console.log(`Redirecting to ${target}`);
            proxy.web( req, res, {target: target, xfwd: true} );

            // Round robin
            shiftOnServe();
        }


    });
    server.listen(3080);

    // Listen for the `error` event on `proxy`.
    proxy.on('error', function (err, req, res) {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });

        shiftOnServe();
        res.end(`Target failed`);
    });
   
    //
    // Listen for the `proxyRes` event on `proxy`.
    //
    proxy.on('proxyRes', function (proxyRes, req, res) {
        console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
        console.log('Req', JSON.stringify(req.headers, true, 2));

        // Request time
        let elaspedTime = new Date() - new Date( req.headers.startTime );
        console.log(`elaspedTime: ${elaspedTime}`);

        // Store statistics
        let target = req.headers["target"];
        console.log( target );
        timings[target].push( elaspedTime );

    });

    // Set start timing on header.
    proxy.on('proxyReq', function (proxyReq, req, res, options) {
        console.log('Req', options.target);
        req.headers['target'] = options.target.host;
        req.headers["startTime"] = new Date();
    });


}

function health(res)
{
    child.exec( `docker stats --no-stream --format "{{ json . }}"`, function(err, stdout, stderr)
    {
        let health = [];
        for( line of stdout.trim().split('\n'))
        {
            let obj = JSON.parse(line);
            let key = node2Url[obj.Name];
            if( key )
            {
                // Save latency timings for requests.
                obj.timings = timings[key];

                health.push( obj );

                // Reset timings
                timings[key] = [];
            }
        }

        res.end( JSON.stringify(health) );
    });
}



function shiftOnServe()
{
    let head = agents.shift();
    agents.push(head);
}