import { Contact, ContactList } from './ContactList';

let james = new Contact({
	name: "james"
});
// console.log(james);

let contacts = new ContactList("./src/contacts.json");

contacts.load()
.then(() => {
	contacts.addContact(james);
	// console.log(contacts);
	return contacts.save();
})
.then(() => {
	console.log("Contacts save successfully.")
})
.catch(console.log);