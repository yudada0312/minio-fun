// var http = require("http");

// http.createServer(function(request, response) {
//   response.writeHead(200, {"Content-Type": "text/plain"});
//   response.write("Hello World");
//   response.end();
// }).listen(8888);

const MinIO = require('minio');

var client = new MinIO.Client({
    endPoint: 'minio.ha7777.net',
    port: 443,
    useSSL: true,
    accessKey: 'minioRD9M56rEYAtZ',
    secretKey: '07pl27pDzeBtxSD1'
});

// var client = new MinIO.Client({
//   endPoint: '18.162.142.154',
//   port: 9000,
//   useSSL: false,
//   accessKey: 'minioRD9M56rEYAtZ',
//   secretKey: '07pl27pDzeBtxSD1'
// });

// express是一个小巧的Http server封装，不过这对任何HTTP server都管用。
const server = require('express')()

server.get('/presignedUrl', (req, res) => {
    client.presignedPutObject('number-taker2', req.query.name, (err, url) => {
        if (err) throw err
        res.end(url)
    })
    res.send('OK');
})

server.get('/checkBucketExists', (req, res) => {
  console.log(req.query);
  client.bucketExists(req.query.bucket_name, function(err, exists) {
      if (err) {
        console.log('bucketExists error');
        console.log(err);
        res.send(err);
      // return  reject('sserror');
      }else{
        if(exists){
          console.log('bucketExists');
          res.send('bucketExists');
        }else{
          console.log('bucketNoExists');
          res.send('bucketNoExists');
        }
      }
  });
});

server.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

server.listen(8081)