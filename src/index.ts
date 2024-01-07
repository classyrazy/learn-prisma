import express, { Application, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
const app: Application = express();
const PORT = 5670;
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response): Promise<Response> => {
    const allUsers = await prisma.user.findMany();
    return res.status(200).send({
        message: 'Hello World!',
        data: allUsers
    });
});

app.post('/new', async (req: Request, res: Response) => {
    const newUser = await prisma.user.create({ data: req.body });
    res.status(200).json(newUser);
});
app.post('/new-many', async (req: Request, res: Response) => {
    const newUser = await prisma.user.createMany({ data: req.body });
    res.status(200).json(newUser);
}
);
// house
app.post('/new-house', async (req: Request, res: Response) => {
    const newHouse = await prisma.house.create({ data: req.body });
    res.status(200).json(newHouse);
});
app.get('/house', async (req: Request, res: Response): Promise<Response> => {
    const allUsers = await prisma.house.findMany({
        where:{
            owner:{
                age: {
                    gte: 18
                }
            },
        },
        include: {
            owner: true,
            builtBy: true
        }
    });
    return res.status(200).send({
        message: 'Houses returned',
        data: allUsers
    });
});

app.put('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedUser = await prisma.user.update({
        where: { id: id },
        data: req.body
    });
    res.status(200).json(updatedUser);
})
app.delete('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const deletedUser = await prisma.user.delete({
        where: { id: id }
    })
    res.status(200).json(deletedUser);
})

try {
    app.listen(PORT, (): void => {
        console.log(`Connected successfully on port ${PORT} available at http://localhost:${PORT}`);
    });
} catch (error: any) {
    console.error(`Error occurred: ${error.message}`);
}