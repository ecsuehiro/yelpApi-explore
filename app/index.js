"use strict"

const express = require('express')
const router = express.Router()

const applicationApiPrefix = '/api/physicalTherapists'
const applicationsRoutes = require('./app.route')(applicationApiPrefix)

const path = require('path')
const contentPath = path.join(__dirname, "../")

module.exports = router

router.use(express.static(contentPath))
router.use(applicationApiPrefix, applicationsRoutes)

useAPIErrorHandlers(router)

function useAPIErrorHandlers(router) {
    // Handle API 404
    router.use("/api/*", (req, res, next) => {
        res.sendStatus(404)
    })
    // Handle API 500
    router.use((err, req, res, next) => {
        if (!err) {
            return next()
        }
        // Log it
        console.log(err.stack)
        // Redirect to error page
        res.sendStatus(500)
    })
}