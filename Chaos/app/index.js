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


function main()
{
    let options = {};
    let proxy   = httpProxy.createProxyServer(options);
    let self = this;
    // Redirect requests to the active TARGET
    let server  = http.createServer(function(req, res)
    {
        console.log("Received request");

        if( req.url === "/health" && req.method == "GET" )
        {
            child.exec( `docker stats --no-stream --format "{{ json . }}"`, function(err, stdout, stderr)
            {
                res.end( stdout );
            });
        }
        else
        {
            let target = agents[0];
            console.log(`Redirecting to ${target}`);
            proxy.web( req, res, {target: target } );
        }


    });
    server.listen(3080);

    // Listen for the `error` event on `proxy`.
    proxy.on('error', function (err, req, res) {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });

        shiftOnError();
        res.end(`Target failed`);
    });
   
    //
    // Listen for the `proxyRes` event on `proxy`.
    //
    proxy.on('proxyRes', function (proxyRes, req, res) {
        console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
    });

}



function shiftOnError()
{
    let head = agents.shift();
    agents.push(head);
}