import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import JWT, { Secret } from 'jsonwebtoken';
import path from 'path';
import multer from 'multer';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const door = 4002;
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../upload/'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/upload', express.static('upload'));
app.use(bodyParser.json());
app.use(cors());
dotenv.config()

const upload = multer({ storage });
const data = JSON.parse(fs.readFileSync('./src/db.json').toString());

interface ILogin {
    id: number;
    name: string,
    email: string,
    password: string
}

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

app.post('/', (req: express.Request, res: express.Response) => {
    const { email, password }:{ email: string, password: string} = req.body
    
    if (email && password) {
        const { login } = data
        const user:ILogin[] = login.filter((user:ILogin) => {
            return ((user.email.includes(email)) && (user.password.includes(password)));
        });
         
        if (user[0]) {
            const token = JWT.sign({ id: user[0].id } as {id: Number}, process.env.SECRET as Secret, {
                expiresIn: 86400  // expira em 24 horas
            });
            return res.status(200).send({ auth: true, token: token, name: user[0].name});
        }

        return res.status(404).send({ auth: false, message: 'Acesso negado!'});
    } else {
        return res.status(400).send({ auth: false, token: null });
    }
})

app.use(checkToken)

app.get('/upload/:filename', (req: express.Request, res: express.Response) => {
    return res.sendFile(req.params.filename)
})

app.get('/books', (req: express.Request, res: express.Response) => {
    const file = JSON.parse(fs.readFileSync('./src/db.json').toString());
    return res.status(200).json(file.books)
})

app.get('/books/:id', (req: express.Request, res: express.Response) => {
    const { id } = req.params
    const file = JSON.parse(fs.readFileSync('./src/db.json').toString());
    const book = file.books.filter((book:Ibooks)=> book.id === Number(id))

    if (book[0]) {
        return res.status(201).json(book)
    }

    return res.status(404).send({ message: 'Livro não encontrado!'});
})

app.post('/books', upload.single('image'), async (req: express.Request, res: express.Response) => {
    const book:Ibooks = JSON.parse(req.body.book)
    const img = req.file
    if (book && img) {
        const newBook = {
            ...book,
            image: img.filename,
            id: data.books.length +1 
        }

        const file = JSON.parse(fs.readFileSync('./src/db.json').toString());
        file.books.push(newBook)
        fs.writeFileSync(path.join(__dirname, './db.json'), JSON.stringify(file));
    
        return res.status(201).send({ message: 'Adicionado com sucesso!'});
    }
    
    return res.status(400).send({ message: 'Erro, tente mais tarde!'});
})

app.put('/books/:id', upload.single('image'), async (req: express.Request, res: express.Response) => {
    const book:Ibooks = JSON.parse(req.body.book);
    const img = req.file

    const newBook = {
        ...book,
        image: img? img.filename : book.image
    }
    
    const file = JSON.parse(fs.readFileSync('./src/db.json').toString());
    file.books[book.id-1] = newBook;
    fs.writeFileSync(path.join(__dirname, './db.json'), JSON.stringify(file));
    
    return res.status(200).send({ message: 'Editado com sucesso!'});
})

app.listen(door, () => console.log("server rodando na porta " + door))
