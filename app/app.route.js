"use strict"

const router = require('express').Router()
const appControllersFactory = require('./app.controller')

module.exports = apiPrefix => {
    const appController = appControllersFactory(apiPrefix)

    router.get('/', appController.readPTs)

    return router
}