import express from "express";
import bodyParser from "body-parser";

import { Contact, ContactList } from './ContactList';
import { Car } from './Car';

let contacts = new ContactList("./src/contacts.json");

const port = 8080;
const app = express();

app.listen(port, () => {
	console.log(`App is listening at port: ${ port }`);
});

// logging middleware
app.use((req, res, next) => {
	console.log(req.method, req.url);
	next();
});

// parsing json bodies
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("Welcome to our server!");
});

app.get("/contacts", (req, res) => {
	contacts.load()
	.then(() => {
		res.json(contacts.list);
	})
	.catch(err => res.status(500).send(err));
});

app.get("/contacts/:id", (req, res) => {
	const id = req.params.id;
	contacts.load()
	.then(() => {
		const contact = contacts.list[req.params.id - 1];
		if(!contact)
			return res.status(404).send("Contact does not exist");
		res.json(contact);
	})
	.catch(err => res.status(500).send(err));
});

app.post("/contacts", (req, res) => {
	let contact = new Contact(req.body);
	contacts.load()
	.then(() => {
		contacts.addContact(contact);
		return contacts.save();
	})
	.then(() => {
		res.status(201).send(contact);
	})
	.catch(err => res.status(400).send(err));
});

app.put("/contacts/:id", (req, res) => {
	const id = req.params.id;
	const contact = new Contact(req.body);

	contacts.load()
	.then(() => {
		const oldContact = contacts.list[id - 1];

		if(!oldContact)
			return res.status(404).send("Contact does not exist");

		contacts.list[id - 1] = contact;

		return contacts.save();
	})
	.then(() => {
		res.send(contact);
	})
	.catch(err => res.status(400).send(err));
});

app.delete("/contacts/:id", (req, res) => {
	const id = req.params.id;
	let contact = null;
	contacts.load()
	.then(() => {
		contact = contacts.list[req.params.id - 1];
		if(!contact)
			return res.status(404).send("Contact does not exist");
		
		contacts.list[req.params.id - 1] = null;

		return contacts.save();
	})
	.then(() => res.json(contact))
	.catch(err => res.status(500).send(err));
});

app.get("/contacts/:id/cars", (req, res) => {
	const id = req.params.id;

	contacts.load()
	.then(() => {
		const contact = contacts.list[id - 1];

		if(!contact)
			return res.status(404).send("Contact does not exist");

		res.json(contact.cars);
	})
	.catch(err => res.status(400).send(err));
})

app.post("/contacts/:id/cars", (req, res) => {
	const id = req.params.id;
	const car = new Car(req.body);

	contacts.load()
	.then(() => {
		const contact = contacts.list[id - 1];

		if(!contact)
			return res.status(404).send("Contact does not exist");

		contact.cars.push(car);

		return contacts.save();
	})
	.then(() => {
		res.json(car);
	})
	.catch(err => res.status(400).send(err));
});

app.get("/contacts/:id/cars/:carId", (req, res) => {
	const id = req.params.id;
	const carId = req.params.carId;

	contacts.load()
	.then(() => {
		const contact = contacts.list[id - 1];

		if(!contact)
			return res.status(404).send("Contact does not exist");

		const car = contact.cars[carId - 1];

		if(!car)
			return res.status(404).send("Car does not exist");

		res.json(car);
	})
	.catch(err => res.status(400).send(err));
});

app.delete("/contacts/:id/cars/:carId", (req, res) => {
	const id = req.params.id;
	const carId = req.params.carId;
	let car = null;

	contacts.load()
	.then(() => {
		const contact = contacts.list[id - 1];

		if(!contact)
			return res.status(404).send("Contact does not exist");

		car = contact.cars[carId - 1];

		if(!car)
			return res.status(404).send("Car does not exist");

		contact.cars[carId - 1] = null;

		return contacts.save()
	})
	.then(() => {
		res.json(car);
	})
	.catch(err => res.status(400).send(err));
});
