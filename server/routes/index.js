require('dotenv').config()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const request = require('request')
const routes = require('express').Router()
const logger = require("../logger") 
import { Low, JSONFile } from 'lowdb'

const file = '../feedback.json'
const adapter = new JSONFile(file)
const db = new Low(adapter)
await db.read()

const { feedback } = db.data

const apicache = require('apicache')
let cache = apicache.middleware

const onlyStatus200 = (req, res) => res.statusCode === 200

routes.get('/api/redmine_url', cache('5 minutes', onlyStatus200), async function(req, res) {
    logger.info("Serving base URL")
    res.send(process.env.BASE_URL)
})

routes.post('/api/feedback', jsonParser, async function(req, res) {
    const feedback = feedbacks.push(req.body)
    await db.write()
    res.send(feedback)
})

routes.get('/api/feedback', jsonParser, async function(req, res) {

})

routes.post('/api/login', jsonParser, async function(req, res) {
    const baseUrlDomain = process.env.BASE_URL.split('://')[1]

    request(`https://${req.body.username}:${req.body.password}@${baseUrlDomain}users/current.json`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            logger.info("User successfully logged in")
            res.send(response.body)
        } else {
            res.statusCode = 401;
            res.send('None shall pass');
        }
    })
})

routes.use('/api', cache('5 minutes', onlyStatus200), async function(req, res) {
    let startTime = new Date()
    logger.info("Incoming " + req.method + " request")
    logger.debug("request URL: " + req.url)
    req.pipe(request(process.env.BASE_URL + req.url)).pipe(res);
    let endTime = new Date()
    logger.info("Response %s. Completed in: %dms", res.statusCode, (endTime - startTime))
})
  
routes.get('/cache/index', async function (req, res) {
    logger.info("serving cache index")
    res.json(apicache.getIndex())
})

module.exports = routes;
