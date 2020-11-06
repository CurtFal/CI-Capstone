const express = require('express')
const database = require('./database.js')
const request = require("request");
const cors = require('cors')

const app = express()

app.use(cors())

app.delete('/movie', (req, res) => {
    if (req.query.movie_id) {
        database.read(req.query.movie_id).then((data) => {
            res.json(data);
        }).catch(() => {
            res.json(`Could not find ${req.query.movie_id}`)
        })
    }
})

app.get('/movie', (req, res) => {
    if (req.query.movie_id) {
        database.read(req.query.movie_id).then((data) => {
            res.json(data);
        }).catch(() => {
            res.json(`Could not find ${req.query.movie_id}`)
        })
    } else {
        res.json('Error!')
    }
})


app.get('/search', (req, res) => {
    if (req.query.movie_title) {
        yt = undefined;
        imdb = undefined;

        respond = () => {
            if (imdb && yt) {
                res.json({ youtube: yt, imdb: imdb });
            }
        }

        request.get(`https://www.googleapis.com/youtube/v3/search?maxResults=1&type=video&safeSearch=moderate&q=${req.query.movie_title}%20movie%20trailer&key=${process.env.GOOGLE_API_KEY}`, (error, re, body) => {
            yt = JSON.parse(body);
            respond();
        });
        
        request.get(`https://imdb-api.com/API/SearchTitle/k_3gry78ih/${req.query.movie_title}`, (error, re, body) => {
            imdb = JSON.parse(body);
            respond();
        });
    }
})

/*app.get('/searchimdb', (req, res) => {
    if(req.query.movie_title){
        request.get(`https://imdb-api.com/API/SearchTitle/k_3gry78ih/${req.query.movie_title}`,(error, response, body) => {
            res.json(JSON.parse(body));
    });
    } else { 
        res.json('Error! (imdb)')
    }
}) */

app.post('/movie', (req, res) => {
    if (req.query.movie_id && req.query.title && req.query.trailer_url) {
        database.save({
            movie_id: req.query.movie_id,
            title: req.query.title,
            trailer_url: req.query.trailer_url,
            updated_on: new Date().toString(),
        }).then(() => {
            res.json('Success')
        });
    }
})





app.listen(3000)
