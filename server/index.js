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
        tmdb = undefined;

        respond = () => {
            if (imdb && yt && tmdb) {
                res.json({ youtube: yt, imdb: imdb, tmdb: tmdb });
            }
        }

        request.get(`https://www.googleapis.com/youtube/v3/search?maxResults=1&type=video&safeSearch=moderate&q=${req.query.movie_title}%20movie%20trailer%20${req.query.movie_year}&key=${process.env.GOOGLE_API_KEY}`, (error, re, body) => {
            yt = JSON.parse(body);
            respond();
        });
        
        request.get(`https://imdb-api.com/API/SearchMovie/${process.env.IMDB_KEY}/${req.query.movie_title}%20(${req.query.movie_year})`, (error, re, body) => {
            imdb = JSON.parse(body);
            respond();
        });

        request.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&query=${req.query.movie_title}&primary_release_year=${req.query.movie_year}`, (error, re, body) => {
            tmdb = JSON.parse(body);
            respond();
        });
    }
})



app.post('/movie', (req, res) => {
    if (req.query.movie_id && req.query.title && req.query.trailer_url && req.query.description && req.query.poster_url) {
        database.save({
            movie_id: req.query.movie_id,
            title: req.query.title,
            trailer_url: req.query.trailer_url,
            description: req.query.description,
            updated_on: new Date().toString(),
            poster_url: req.query.poster_url
        }).then(() => {
            res.json('Success')
        });
    }
    else{
        res.json(`Could not find ${req.query.movie_id}`)
    }
})





app.listen(3000)
