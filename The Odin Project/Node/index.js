const http = require('http');
const fs = require('fs');

const port = 5000

const server = http.createServer((req, res) => {
    const filename = './public'+ req.url + '.html';
    
    fs.readFile(filename, (err, file) => {
        if(err) {
            //render 404 page
            fs.readFile('./public/404.html', (err, file) => {
                if(err) throw err
                res.writeHead(404, {'content-type': 'text/html'})
                res.write(file)
                res.end()
            })
        }else {
            res.writeHead(200, {'content-type': 'text/html'});
            res.write(file);
            res.end();
        }
    })
})

server.listen(port, () => console.log('server is runnin...'))