import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

/* ----- Init ----- */
const app: Express = express();
app.use(express.json());
const PORT: number = 3001;
const prisma: PrismaClient = new PrismaClient();

/* ----- Routes ----- */

// Create user (would normally hash passwords before going into DB, but this is just a tutorial)
app.post('/', async (req: Request, res: Response) => {
	const { username, password } = req.body;
	const user = await prisma.user.create({
		data: {
			username: username,
			password: password
		}
	});
	res.json(user);
});

// Create many users
app.post('/createManyUsers', async (req: Request, res: Response) => {
	const { userList } = req.body;
	const users = await prisma.user.createMany({
		data: userList
	});
	res.json(users);
});

// Create many cars
app.post('/createManyCars', async (req: Request, res: Response) => {
	const { carList } = req.body;
	const cars = await prisma.car.createMany({
		data: carList
	});
	res.json(cars);
});

// Get all users
app.get('/', async (req: Request, res: Response) => {
	const users = await prisma.user.findMany({
		include: { cars: true }
	});
	res.json(users);
});

// Get single user by id
app.get('/byId/:id', async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const user = await prisma.user.findUnique({
		where: {
			id: id
		}
	});
	res.json(user);
});

// Update username
app.put('/', async (req: Request, res: Response) => {
	const { id, username } = req.body;
	const updatedUser = await prisma.user.update({
		where: {
			id: id
		},
		data: {
			username: username
		}
	});
	res.json(updatedUser);
});

// Delete user
app.delete('/:id', async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	const user = await prisma.user.findUnique({
		where: {
			id: id
		}
	});

	if (user) {
		const deletedUser = await prisma.user.delete({
			where: {
				id: id
			}
		});
		res.json(deletedUser);
	} else res.send({ message: 'User not found' });
});

/* ----- Start Server ----- */
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
