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

app.get('/', (req, res) => {
    database.random().then((data) => {
        res.json(data);
    });
})

app.get('/search', (req, res) => {
    title = req.query.movie_title
    year = req.query.movie_year

    if (title) {
        yt = `https://www.googleapis.com/youtube/v3/search?maxResults=1&type=video&safeSearch=moderate&key=${process.env.GOOGLE_API_KEY}&q=${title}%20movie%20trailer`
        imdb = `https://imdb-api.com/API/SearchMovie/${process.env.IMDB_KEY}/${title}`
        tmdb = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&query=${title}`

        if (year) {
            yt += `%20(${year})`
            imdb += `%20(${year})`
            tmdb += `&primary_release_year=${year}`
        }

        Promise.all([query(yt), query(imdb), query(tmdb)]).then((values) => {
            res.json({ youtube: values[0], imdb: values[1], tmdb: values[2] })
        })
    }
})


app.post('/movie', (req, res) => {
    if (req.query.movie_id && req.query.title && req.query.trailer_url && req.query.description && req.query.poster_url && req.query.overview) {
        database.save({
            movie_id: req.query.movie_id,
            title: req.query.title,
            trailer_url: req.query.trailer_url,
            description: req.query.description,
            updated_on: new Date().toString(),
            poster_url: req.query.poster_url,
            overview: req.query.overview
        }).then(() => {
            res.json('Success')
        });
    }
    else {
        res.json(`Could not find ${req.query.movie_id}`)
    }
})

const query = (api) => {
    return new Promise((resolve, reject) => {
        request.get(api, (error, response, body) => {
            resolve(JSON.parse(body));
        });
    });
}

app.listen(3000)
