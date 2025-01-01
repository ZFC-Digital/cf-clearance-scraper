const Ajv = require("ajv")
const addFormats = require("ajv-formats")

const ajv = new Ajv()
addFormats(ajv)

const schema = {
    "type": "object",
    "properties": {
        "mode": {
            "type": "string",
            "enum": ["source", "turnstile-min", "turnstile-max", "waf-session"],
        },
        "proxy": {
            "type": "object",
            "properties": {
                "host": { "type": "string" },
                "port": { "type": "integer" },
                "username": { "type": "string" },
                "password": { "type": "string" }
            },
            "additionalProperties": false
        },
        "url": {
            "type": "string",
            "format": "uri",
        },
        "userAgent": {
            "type": "string"
        },
        "authToken": {
            "type": "string"
        },
        "siteKey": {
            "type": "string"
        }
    },
    "required": ["mode", "url"],
    "additionalProperties": false
}

// const data = {
//     mode: "source",
//     url: "https://example.com",
//     userAgent: "Mozilla/5.0 ...",
//     proxy: {
//         host: "localhost",
//         port: 8080,
//         username: "test",
//         password: "test"
//     },
//     authToken: "123456"
// }


function validate(data) {
    const valid = ajv.validate(schema, data)
    if (!valid) return ajv.errors
    else return true
}

module.exports = validate
