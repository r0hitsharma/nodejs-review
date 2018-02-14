import * as fs from "fs";
import * as util from "util";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class Contact {
	constructor (obj){
		// console.log("new contact");

		this.name = obj.name;
		this.phone = obj.phone;
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
		return readFile(this.filename, "utf8")
		.then(fileString => {
			// console.log(fileString);
			JSON.parse(fileString)
			.forEach(contact => this.addContact(contact));
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