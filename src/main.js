

const express = require('express');
const languagesCollection = require('../collections/languages.json');

// Initializing API
initAPI()

// Initializing Express
function initAPI(){
    const app = express()
    app.use(express.json())
    //Handle Root Requests
    handleRootRequests(app);
    //Handle Get Requests
    handleGetRequests(app);
    app.listen(
        3000,
        "omegaui.github.io/langhunt-api",
        () => {
            console.log('🚀 Ready: API Listening on https://localhost:3000/v1')
        }
    )
}


function handleRootRequests(app){
    app.get(
        '/',
        (req, res) => {
            res.send(
                {
                    message: "🎉 Welcome to LangHunt API!",
                    versions: [
                        "v1",
                        "v2-beta"
                    ],
                }
            )
        }
    )
    app.get(
        '/v1',
        (req, res) => {
            res.send(
                {
                    message: "LangHunt API version 1 (under development)",
                    description: "This is the basic version of LangHunt API.",
                    supportedLanguagesCount: languagesCollection.languages.length,
                }
            )
        }
    )
    app.get(
        '/v2-beta',
        (req, res) => {
            res.send(
                {
                    message: "LangHunt API version 2 beta",
                    description: "Since, We are in beta, we recommend to use this, if you want to break production 😉.",
                    supportedLanguagesCount: "hmm ... counting ...",
                }
            )
        }
    )
}

function handleGetRequests(app){
    app.get(
        '/v1/list/languages',
        (req, res) => {
            res.send(
                {
                    languages: languagesCollection['languages'],
                }
            )
        }
    )
    app.get(
        '/v1/info/:language',
        (req, res) => {
            const { language } = req.params
            if(languagesCollection[language]){
                res.send(
                    {
                        "info": languagesCollection[language],
                    }
                )
            }
            else{
                res.status(400).send(
                    {
                        "message": "Unsupported Language!",
                    }
                )
            }
        }
    )
    app.get(
        '/v1/info',
        (req, res) => {
            res.status(400).send(
                {
                    "message": "Missing Language Name Param!",
                }
            )
        }
    )
    app.get(
        '/v1/info/:language/:key',
        (req, res) => {
            const { language } = req.params
            const { key } = req.params
            
            if(languagesCollection[language]){
                if(languagesCollection[language][key]){
                    res.send(
                        {
                            "value": languagesCollection[language][key],
                        }
                    )
                }
                else{
                    res.status(400).send(
                        {
                            "message": "Unsupported Key!",
                        }
                    )
                }
            }
            else{
                res.status(400).send(
                    {
                        "message": "Unsupported Language!",
                    }
                )
            }
        }
    )
    app.get(
        '/v1/info/:language/ides/preferred',
        (req, res) => {
            const { language } = req.params
            
            if(languagesCollection[language]){
                res.send(
                    {
                        "value": languagesCollection[language]['ides'][0],
                    }
                )
            }
            else{
                res.status(400).send(
                    {
                        "message": "Unsupported Language!",
                    }
                )
            }
        }
    )
    app.get(
        '/v1/info/:language/:version/:platform',
        (req, res) => {
            const { language } = req.params
            const { platform } = req.params
            const { version } = req.params
            var result = "Unsupported";

            if(['windows', 'linux', 'macos'].indexOf(platform) < 0){
                res.status(400).send(
                    {
                        "message": "Unsupported Platform!",
                    }
                )
                return;
            }

            if(languagesCollection[language]){
                if(language == 'java'){
                    result = `https://download.oracle.com/java/${version}/latest/jdk-${version}_${platform}-x64_bin${platform == 'windows' ? '.zip' : '.tar.gz'}`
                }
                res.send(
                    {
                        "value": result,
                    }
                )
            }
            else{
                res.status(400).send(
                    {
                        "message": "Unsupported Language",
                    }
                )
            }
        }
    )
}

