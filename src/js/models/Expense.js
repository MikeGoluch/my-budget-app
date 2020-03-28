class Expense {
    constructor (id, description, value, type) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = 0;
        this.type = type;
    }

    calculatePercentage (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }

    getPercentage () {
        return this.percentage;
    }

    expenseDateStamp () {
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

export { Expense };
