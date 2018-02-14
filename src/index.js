import express from "express";

import { Contact, ContactList } from './ContactList';

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

app.get("/", (req, res) => {
	res.send("Welcome to our server!");
});

app.get("/contacts", (req, res) => {
	contacts.load()
	.then(() => {
		res.json(contacts.list);
	})
	.catch(() => res.status(500).send(err));
});
