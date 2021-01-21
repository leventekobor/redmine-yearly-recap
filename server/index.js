require('dotenv').config()
const express = require('express')
const request = require('request')

const port = process.env.PORT || 3000
var app = express(); 

console.log(process.env.BASE_URL)

// Forward all requests from /api to http://foo.com/api
app.use('/api', function(req, res) {
    req.pipe(request(process.env.BASE_URL + req.url)).pipe(res);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
