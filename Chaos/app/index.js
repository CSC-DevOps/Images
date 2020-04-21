const http = require('http');
const httpProxy = require('http-proxy');

let agents = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

main();


function main()
{
    let options = {};
    let proxy   = httpProxy.createProxyServer(options);
    let self = this;
    // Redirect requests to the active TARGET (BLUE or GREEN)
    let server  = http.createServer(function(req, res)
    {
        let target = agents[0];
        console.log(`Redirecting to ${target}`);
        proxy.web( req, res, {target: target } );
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