const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    

    
    if(req.url === '/') {
        //read the html file
        fs.readFile('./public/index.html', (err, file) => {
            if(err) {
                // 404 Page
                fs.readFile('./public/404.html', (err, file) => {
                    if(err) throw err
                    res.writeHead(404, {'content-type': 'text/html'})
                    res.write(file);
                    res.end()
                })
            }else {
                res.writeHead(200, {'content-type': 'text/html'});
                res.write(file);
                res.end();
            }
            
        })
    }

    if(req.url === '/create') {
        /**
         * you can create a file using the following
         * fs.appendFile()
         * fs.open()
         * fs.writeFile()
         * learn more on this methods at 
         * https://www.w3schools.com/nodejs/nodejs_filesystem.asp
         */

         fs.writeFile('create.txt', 'The first file i created using fs \n', (err, file) => {
             if(err) throw err;
             res.writeHead(200, {'content-type': 'text/html'});
             res.write('file created ')
             fs.readFile('create.txt', (err, file) => {
                 if(err) throw err;
                 res.write(file)
                 res.end()
             })
            
         })
    }

    if(req.url === '/update') {
        /**
         * you can update a file with
         * fs.appendFile()
         * fs.writeFile()
         */

         fs.appendFile('create.txt', 'this is an update to my first file \n', (err) => {
             if(err) throw err
             res.end('file Updated')
         })
    }

    if(req.url === '/delete') {
        /**
         * delete file with
         * fs.unlink()
         */

        fs.unlink('create.txt', (err) => {
            if(err) throw err;
            res.end('file deleted')
        })
    }

    //Rename a file
    if(req.url === '/rename') {
        fs.rename('create.txt', 'first.txt', (err) => {
            if(err) throw err
            res.end('File Renamed')
        })
    }
    
}).listen(5000)