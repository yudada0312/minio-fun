
const dotenv = require('dotenv');
dotenv.config();

const MinIO = require('minio');

var client = new MinIO.Client({
    endPoint: process.env.END_POINT,
    port: Number(process.env.PORT),
    useSSL: (process.env.PORT==443) ? true : false,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_Key
});

// express是一个小巧的Http server封装，不过这对任何HTTP server都管用。
const server = require('express')()

server.get('/presignedUrl', (req, res) => {
    client.presignedPutObject(req.query.bucket_name, req.query.name, (err, url) => {
        if (err) throw err
        res.end(url)
    })
})

server.get('/checkBucketExists', (req, res) => {
  console.log(req.query);
  client.bucketExists(req.query.bucket_name, function(err, exists) {
      if (err) {
        res.send(err);
      }else{
        if(exists){
          res.send('bucketExists');
        }else{
          res.send('bucketNoExists');
        }
      }
  });
});

server.get('/makeBucket', (req, res) => {
  client.makeBucket(req.query.bucket_name, 'us-west-1', function(e) {
    if (e) {
      res.send(e);
      return console.log(e)
    }
    console.log("Success")
    res.send('Success');
  })
})

server.get('/listBuckets', (req, res) => {
  client.listBuckets(function(e, buckets) {
    if (e){
      res.send(e);
      return console.log(e)
    }
    console.log('buckets :', buckets)
    res.send(buckets);
  })
})

server.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

server.listen(8081)