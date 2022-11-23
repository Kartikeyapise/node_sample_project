
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const app = express();

const ads = [
    { title: 'Hello, world (again)!' }
];

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.listen(3001, () => {
    console.log('listening on port 3001');
});

app.post('/signup', (req, res) => {
    data = req.body
    console.log(data)
    if (checkIfUserExixts(data.email) == true) {
        res.send("User Already exists")
    }
    else {
        token = generateJwtToken(data)
        uuid = saveUserInDb(data)
        resData = {
            "data": {
                "userId": uuid,
                "token": token
            }
        }
        res.send(resData)
    }
})

function saveUserInDb(data) {
    uuid = gererateUuidForAUser()
    data[uuid] = uuid
    console.log(data)
    tokenDB[data.email] = data
    return uuid
}

function checkIfUserExixts(email) {
    if (email in tokenDB) {
        return true
    }
    return false
}

function gererateUuidForAUser() {
    return uuidv4()
}

function generateJwtToken(data) {
    const token = jwt.sign(data, JWT_SECRET_KEY)
    return token
}


JWT_SECRET_KEY = "JWT_SECRET_KEY"
tokenDB = {}


app.post('/verifyToken', (req, res) => {
    token = req.headers.authorization
    console.log(token)
    var decodedToken = decodeJWT(token);
    console.log(decodedToken)
    email = decodedToken.email
    if (email in tokenDB) {
        res.send("Token Valid")
    }
    else {
        res.send("Token InValid")
    }

})

const decodeJWT = (token) => {
    console.log("decoding JWT token");
    if (token !== null || token !== undefined) {
        const base64String = token.split('.')[1];
        const decodedValue = JSON.parse(Buffer.from(base64String,
            'base64').toString('ascii'));
        console.log(decodedValue);
        return decodedValue;
    }
    return null;
}