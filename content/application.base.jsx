import React, { Component } from 'react'
import { Grid, Row, Col, Table, Button, FormControl, FormGroup, ControlLabel } from 'react-bootstrap'
import axios from 'axios'

export default class Base extends Component {
    constructor() {
        super()

        this.onInputChange = this.onInputChange.bind(this)
        this.getByLocation = this.getByLocation.bind(this)

        this.state = {
            location: "",
            summary: {
                number: "",
                totalRatings: "",
                averageRating: "",
                totalReviews: ""
            },
            tableData: []
        }
    }

    onInputChange(event) {
        const target = event.target
        const name = target.name
        const value = target.value

        this.setState({
            [name]: value
        })
    }

    getByLocation() {
        return axios.get(`/api/physicalTherapists/?location=${this.state.location}`)
            .then(response => {
                const apiData = response.data.data
                console.log(apiData)
                this.setState(prevState => {
                    const newSummary = Object.assign({}, prevState.summary)
                    const newTable = Object.assign({}, prevState.tableData)

                    let tableData = []
                    let hasRatings = 0
                    let ratings = []
                    let reviews = []

                    newSummary.number = apiData.total

                    for (let i = 0; i < apiData.businesses.length; i++) {
                        tableData.push({
                            name: apiData.businesses[i].name,
                            rating: apiData.businesses[i].rating,
                            reviews: apiData.businesses[i].review_count,
                            address: `${apiData.businesses[i].location.address1} 
                             ${apiData.businesses[i].location.city} 
                             ${apiData.businesses[i].location.state}
                             ${apiData.businesses[i].location.zip_code}`
                        })
                        ratings.push(apiData.businesses[i].rating)
                        reviews.push(apiData.businesses[i].review_count)
                        if (apiData.businesses[i].rating) {
                            hasRatings += 1
                        }
                    }

                    newSummary.averageRating = ratings.reduce((a, b) => {
                        return a + b
                    }) / (ratings.length)

                    newSummary.totalReviews = reviews.reduce((a, b) => {
                        return a + b
                    })

                    newSummary.totalRatings = hasRatings


                    return {
                        summary: newSummary,
                        tableData: tableData
                    }


                })
            })
            .catch(err => {
                console.warn(err)
            })
    }

    render() {
        let tableData
        if (this.state.tableData) {
            tableData = this.state.tableData.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.rating}</td>
                        <td>{item.reviews}</td>
                        <td>{item.address}</td>
                    </tr>
                )
            })
        }

        return (
            <Grid>
                <h2 className="title text-center">Search</h2>
                <form>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <FormGroup>
                                <ControlLabel>Location</ControlLabel>
                                <FormControl type="text" name="location" value={this.state.location} onChange={this.onInputChange}></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <Button type="button" onClick={this.getByLocation}>Search Area</Button>
                            </FormGroup>
                        </Col>
                    </Row>
                </form>
                <hr />
                <Row>
                    <h3 className="div-summaryDiv title text-center">Summary</h3>
                    <Col md={6} mdOffset={3}>
                        <div>
                            <ControlLabel>Number of PT's in Area: </ControlLabel>
                            <p>{this.state.summary.number}</p>
                        </div>
                        <div>
                            <ControlLabel>Total PT's with Ratings: </ControlLabel>
                            <p>{this.state.summary.totalRatings}</p>
                        </div>
                        <div>
                            <ControlLabel>Average PT Rating: </ControlLabel>
                            <p>{this.state.summary.averageRating}</p>
                        </div>
                        <div>
                            <ControlLabel>Total Number of Reviews: </ControlLabel>
                            <p>{this.state.summary.totalReviews}</p>
                        </div>
                    </Col>
                </Row>
                <hr />
                <div>
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th>Name/Business Name</th>
                                <th>Rating</th>
                                <th>Number of Reviews</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData}
                        </tbody>
                    </Table>
                </div>
            </Grid>
        )
    }
}