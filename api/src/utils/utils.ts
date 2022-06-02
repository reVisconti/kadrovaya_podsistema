const dotenv = require('dotenv');
dotenv.config();
const DOMAIN = process.env.DOMAIN;

const jwt = require('jsonwebtoken');
const TOKEN_KEY = process.env.TOKEN_KEY;

export function checkValidEmail(email: string){
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export function checkValidDomainEmail(email: string){
    return email.includes(DOMAIN);
}

export function parseUserFromJWT(token: string) {
    let user = null;
    jwt.verify(token, TOKEN_KEY,  function (err: Error, decoded) {
        if (!err) {
            user = decoded.email
        }
    });
    return user
}