class Car {
	constructor(obj){
		if(!obj)
			throw "Car class needs an object to instantiate."

		this.brand = obj.brand;
		this.year = obj.year;
		this.type = obj.type;
	}
}

export { Car };