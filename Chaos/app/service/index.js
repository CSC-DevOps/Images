const express = require('express')
const app = express()
const port = 3000
const host = getIPAddress();
app.get('/', (req, res) => res.send('Hello World!'))

app.get('/work', (req, res) =>
{
    let fn = function stackermann(M, N) {
        const stack = [];
        for (;;) {
          if (M === 0) {
            N++;
            if (stack.length === 0) return N;
            const r = stack[stack.length-1];
            if (r[1] === 1) stack.length--;
            else r[1]--;
            M = r[0];
          } else if (N === 0) {
            M--;
            N = 1;
          } else {
            M--
            stack.push([M, N]);
            N = 1;
          }
        }
      }

    res.send(`Ok: ${fn(3,12)}`);
});

app.get('/stackless', (req, res) =>
{
    let fn = function ack(M, N){
        const next = new Float64Array(M + 1);
        const goal = new Float64Array(M + 1).fill(1, 0, M);
        const n = N + 1;
     
        // This serves as a sentinel value;
        // next[M] never equals goal[M] == -1,
        // so we don't need an extra check for
        // loop termination below.
        goal[M] = -1;
     
        let v;
        do {
            v = next[0] + 1;
            let m = 0;
            while (next[m] === goal[m]) {
                goal[m] = v;
                next[m++]++;
            }
            next[m]++;
        } while (next[M] !== n);
        return v;
    }

    res.send(`Ok: ${fn(3,20)}`);
});

app.listen(port, host, () => console.log(`Example app listening at http://${host}:${port}`))


function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }

  return '0.0.0.0';
}
