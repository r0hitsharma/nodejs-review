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

// fetch contact based on contact id
app.use("/contacts/:id", (req, res, next) => {
	console.log("Contact:", req.params.id);
	if(req.params.id){
		const contact = req.contacts.list[req.params.id - 1];
		if(!contact)
			return res.status(404).send("Contact does not exist");
		req.contact = contact;
	}

	next();
});

// fetch car based on car id
app.use("/contacts/:id/cars/:carId", (req, res, next) => {
	console.log("Car:", req.params.carId);

	if(req.params.carId){
		const carId = req.params.carId;

		const car = req.contact.cars[carId - 1];

		if(!car)
			return res.status(404).send("Car does not exist");
		req.car = car;
	}

	next();
});

app.get("/", (req, res) => {
	res.send("Welcome to our server!");
});

app.get("/contacts", (req, res) => {
	res.json(req.contacts.list);
});

app.get("/contacts/:id", (req, res) => {
	res.json(req.contact);
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

	req.contacts.list[id - 1] = contact;

	req.contacts.save()
	.then(() => {
		res.send(contact);
	})
	.catch(err => res.status(400).send(err));
});

app.delete("/contacts/:id", (req, res) => {
	const id = req.params.id;
	
	req.contacts.list[req.params.id - 1] = null;

	req.contacts.save()
	.then(() => res.json(contact))
	.catch(err => res.status(500).send(err));
});

app.get("/contacts/:id/cars", (req, res) => {
	res.json(req.contact.cars);
})

app.post("/contacts/:id/cars", (req, res) => {
	const car = new Car(req.body);

	req.contact.cars.push(car);

	req.contacts.save()
	.then(() => {
		res.json(car);
	})
	.catch(err => res.status(400).send(err));
});

app.get("/contacts/:id/cars/:carId", (req, res) => {
	res.json(req.car);
});

app.delete("/contacts/:id/cars/:carId", (req, res) => {
	const carId = req.params.carId;
	req.contact.cars[carId - 1] = null;

	req.contacts.save()
	.then(() => {
		res.json(req.car);
	})
	.catch(err => res.status(400).send(err));
});
