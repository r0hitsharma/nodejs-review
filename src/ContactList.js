import * as fs from "fs";
import * as util from "util";

import { Car } from './Car';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class Contact {
	constructor (obj){
		// console.log("new contact");
		if(!obj)
			throw "Need an object to instantiate Contact class.";

		this.name = obj.name;
		this.phone = obj.phone;
		if(obj.cars)
			this.cars = obj.cars.map(car => new Car(car));
		else
			this.cars = [];
	}

	set name (name){
		if(!name)
			throw "Contact class needs a name property."

		if(typeof name !== "string")
			throw "Contact.name needs to be a string."

		this._name = name;
	}

	get name (){
		return this._name;
	}

	toJSON (){
		return {
			name: this._name,
			phone: this.phone,
			cars: this.cars
		};
	}
};

class ContactList {
	constructor (filename){
		this.list = [];
		this.filename = filename;
	}

	addContact(contact){
		this.list.push(contact);
	}

	load(){
		this.list = [];

		return readFile(this.filename, "utf8")
		.then(fileString => {
			// console.log(fileString);
			JSON.parse(fileString)
			.forEach(contactObj => {
				const contact = contactObj ?new Contact(contactObj) : null;
				this.addContact(contact);
			});
		})
	}

	save(){
		return writeFile(
			this.filename,
			JSON.stringify(this.list),
			"utf8"
		)
	}
}

export { Contact, ContactList };