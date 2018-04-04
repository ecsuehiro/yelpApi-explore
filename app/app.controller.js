"use strict"

const axios = require('axios')
const CircularJSON = require('circular-json')
const yelpApi = `https://api.yelp.com/v3/businesses/search?term=physical+therapists&location=`

let _apiPrefix

module.exports = apiPrefix => {
    _apiPrefix = apiPrefix

    return {
        readPTs: _readPTs
    }
}

function _readPTs(req, res) {
    axios.get(
        yelpApi + req.query.location,
        {
            headers: {
                "Authorization": process.env.API_KEY
            }
        })
        .then(response => {
            let json = CircularJSON.stringify(response)
            res.status(200).send(json)
        })
        .catch(err => {
            console.warn(err)
            res.status(500).send(err)
        })
}
