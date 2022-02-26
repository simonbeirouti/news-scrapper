const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const newspapers = [
    {
        name: 'thegaurdian',
        address: 'https://www.theguardian.com/world/ukraine',
        base: ''
    },
    {
        name: 'abc',
        address: 'https://www.abc.net.au/news/world',
        base: 'https://www.abc.net.au/news/world'
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk',
        base: 'https://www.thetimes.co.uk'
    },
    {
        name: 'axios',
        address: 'https://www.axios.com',
        base: ''
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/section/world',
        base: 'https://nytimes.com'
    }
]

const app = express()

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Ukraine")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my news Scraper API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Ukraine")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`Server on port ${PORT}`))