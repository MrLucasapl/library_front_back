import express from 'express';
import data from './db.json';
import cors from 'cors';
import bodyParser from 'body-parser';
import JWT, { Secret } from 'jsonwebtoken';
import path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const door = 4002;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
dotenv.config()

interface Ibooks {
    id: number;
    title: string;
    author: string;
    genre: string;
    status: {
        description: string;
        isActive: boolean;
    };
    systemEntryDate: string;
    synopsis: string;
    rentHistory: {
        studentName: string;
        class: string;
        withdrawalDate: string;
        deliveryDate: string;
    }[];
    image: string;
}

function checkToken(
    req: express.Request, 
    res: express.Response, 
    next: express.NextFunction
  ) {
    const authHeader: string | undefined = req.headers['authorization'];
    const token: string | undefined = authHeader && authHeader.split(" ")[1];

    if (typeof token !== 'string') return res.status(401).json(
        { auth: false, message: 'Acesso negado!' } as { auth: boolean, message: string }
    );

    const validation: unknown = JWT.verify(token, process.env.SECRET as Secret);
    
    if (validation && typeof validation === 'object') return next();
}

app.get('/books', checkToken, (req: express.Request, res: express.Response) => {
    return res.status(200).json(data.books)
})

app.get('/books/:id', checkToken, (req: express.Request, res: express.Response) => {
    const { id } = req.params
    const book = data.books.filter((book)=> book.id === Number(id))

    if (book[0]) {
        return res.status(200).json(book)
    }

    return res.status(404).send({ message: 'Livro não encontrado!'});
})

app.post('/', async (req: express.Request, res: express.Response) => {
    const { email, password }:{ email: string, password: string} = req.body
    
    if (email && password) {
        const { login } = data
        const user = login.filter((user) => {
            return ((user.email.includes(email)) && (user.password.includes(password))) ? user : '';
        });
         
        if (user[0]) {
            const token = JWT.sign({ id: user[0].id }, process.env.SECRET as Secret, {
                expiresIn: 86400  // expira em 24 horas
            });
            return res.status(200).send({ auth: true, token: token, name: user[0].name});
        }

        return res.status(404).send({ auth: false, message: 'Acesso negado!'});
    } else {
        return res.status(411).send({ auth: false, token: null });
    }
})

app.post('/books', checkToken, async (req: express.Request, res: express.Response) => {
    const book:Ibooks = req.body
    
    try {
        const newBook = {
            ...book,
            id: data.books.length +1 
        }
        const file = JSON.parse(fs.readFileSync('./src/db.json').toString());
        file.books.push(newBook)
        fs.writeFileSync(path.join(__dirname, './db.json'), JSON.stringify(file));
    
        return res.status(200).send({ message: 'Adicionado com sucesso!'});
    } catch (error) {
        console.log(error);
        return res.status(411).send({ message: 'Erro, tente mais tarde!'});
    }
})

app.put('/books/:id', checkToken, async (req: express.Request, res: express.Response) => {
    const bookEdit:Ibooks = req.body
    
   if (bookEdit) {
       const file = JSON.parse(fs.readFileSync('./src/db.json').toString());
       file.books[bookEdit.id-1] = bookEdit
       fs.writeFileSync(path.join(__dirname, './db.json'), JSON.stringify(file));
       return res.status(200).send({ message: 'Editado com sucesso!'});
   }

    return res.status(411).send({ message: 'Erro, tente mais tarde!'});
})

app.listen(door, () => console.log("server rodando na porta " + door))
