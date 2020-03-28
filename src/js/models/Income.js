class Income {
    constructor (id, description, value, type) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.type = type;
    }

    incomeDateStamp () {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        if (month < 10) {
            this.date = `${day}.0${month}`;
        } else {
            this.date = `${day}.${month}`;
        }
    }
}

export { Income };
