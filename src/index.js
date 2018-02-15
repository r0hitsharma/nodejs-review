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

// parsing json bodies
app.use(bodyParser.json());

// logging middleware
app.use((req, res, next) => {
	console.log(req.method, req.url);
	next();
});

// load contacts before each rest request
app.use((req, res, next) => {
	contacts.load()
	.then(() => {
		req.contacts = contacts;
		next();
	})
	.catch(err => next(err));
});

app.get("/", (req, res) => {
	res.send("Welcome to our server!");
});

app.get("/contacts", (req, res) => {
	res.json(req.contacts.list);
});

app.get("/contacts/:id", (req, res) => {
	const id = req.params.id;
	const contact = req.contacts.list[req.params.id - 1];
	if(!contact)
		return res.status(404).send("Contact does not exist");
	res.json(contact);
});

app.post("/contacts", (req, res) => {
	let contact = new Contact(req.body);

	req.contacts.addContact(contact);

	req.contacts.save()
	.then(() => {
		res.status(201).send(contact);
	})
	.catch(err => res.status(400).send(err));
});

app.put("/contacts/:id", (req, res) => {
	const id = req.params.id;
	const contact = new Contact(req.body);

	const oldContact = req.contacts.list[id - 1];

	if(!oldContact)
		return res.status(404).send("Contact does not exist");

	req.contacts.list[id - 1] = contact;

	req.contacts.save()
	.then(() => {
		res.send(contact);
	})
	.catch(err => res.status(400).send(err));
});

app.delete("/contacts/:id", (req, res) => {
	const id = req.params.id;
	let contact = req.contacts.list[req.params.id - 1];

	if(!contact)
		return res.status(404).send("Contact does not exist");
	
	req.contacts.list[req.params.id - 1] = null;

	req.contacts.save()
	.then(() => res.json(contact))
	.catch(err => res.status(500).send(err));
});

app.get("/contacts/:id/cars", (req, res) => {
	const id = req.params.id;

	const contact = req.contacts.list[id - 1];

	if(!contact)
		return res.status(404).send("Contact does not exist");

	res.json(contact.cars);
})

app.post("/contacts/:id/cars", (req, res) => {
	const id = req.params.id;
	const car = new Car(req.body);

	const contact = req.contacts.list[id - 1];

	if(!contact)
		return res.status(404).send("Contact does not exist");

	contact.cars.push(car);

	req.contacts.save()
	.then(() => {
		res.json(car);
	})
	.catch(err => res.status(400).send(err));
});

app.get("/contacts/:id/cars/:carId", (req, res) => {
	const id = req.params.id;
	const carId = req.params.carId;

	const contact = req.contacts.list[id - 1];

	if(!contact)
		return res.status(404).send("Contact does not exist");

	const car = contact.cars[carId - 1];

	if(!car)
		return res.status(404).send("Car does not exist");

	res.json(car);
});

app.delete("/contacts/:id/cars/:carId", (req, res) => {
	const id = req.params.id;
	const carId = req.params.carId;
	let car = null;

	const contact = req.contacts.list[id - 1];

	if(!contact)
		return res.status(404).send("Contact does not exist");

	car = contact.cars[carId - 1];

	if(!car)
		return res.status(404).send("Car does not exist");

	contact.cars[carId - 1] = null;

	req.contacts.save()
	.then(() => {
		res.json(car);
	})
	.catch(err => res.status(400).send(err));
});
