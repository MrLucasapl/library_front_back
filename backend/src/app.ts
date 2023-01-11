import express from 'express';
import data from './db.json';
import cors from 'cors';
import bodyParser from 'body-parser';
import JWT, { Secret } from 'jsonwebtoken';
import * as dotenv from 'dotenv';

const door = 4002;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
dotenv.config()

app.get('/', (req, res) => {
    res.status(401).json({ data })
})

app.post('/', (req, res) => {
    const { email, password }:{ email: string, password: string} = req.body
    
    if (email && password) {
        const { login } = data
        const resUser = login.filter((user) => {
            return ((user.email.includes(email)) && (user.password.includes(password))) ? user : '';
        });

        if (resUser) {
            const token = JWT.sign({ id: resUser.id }, process.env.SECRET as Secret, {
                expiresIn: 86400  // expira em 24 horas
            });
            res.status(200).send({ auth: true, token: token, name: resUser.name});
        }
    } else {
        res.status(411).send({ auth: true, token: '' });
    }
})

app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

/* function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
} */
// https://www.luiztools.com.br/post/autenticacao-json-web-token-jwt-em-nodejs/
app.listen(door, () => console.log("server rodando na porta " + door))
