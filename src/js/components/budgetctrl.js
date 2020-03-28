import { Expense } from '../models/Expense.js';
import { Income } from '../models/Income.js';

//BUDGET CONTROLLER

export const calculateTotalAmounts = (type) => {
    let total = 0;
    globalData.allData[type].forEach((cur) => {
        total += cur.value;
    });
    globalData.totalAmount[type] = total;
};

export const globalData = {
    allData: {
        inc: [],
        exp: []
    },
    totalAmount: {
        inc: [],
        exp: []
    },
    totalBudget: 0,
    totalPercentages: 0
};

export const calculateBudget = () => {
    calculateTotalAmounts('inc');
    calculateTotalAmounts('exp');
    globalData.totalBudget = globalData.totalAmount.inc - globalData.totalAmount.exp;
    if (globalData.totalAmount.inc > 0) {
        globalData.totalPercentages = Math.round((globalData.totalAmount.exp / globalData.totalAmount.inc) * 100);
    } else {
        globalData.totalPercentages = -1;
    }
};

export const deleteCtrlItem = (itemType, itemId) => {
    const ids = globalData.allData[itemType].map((cur) => {
        return cur.id;
    });
    const indexNumber = ids.indexOf(itemId);
    if (indexNumber !== -1) {
        globalData.allData[itemType].splice(indexNumber, 1);
    }
    return {
        itemType: itemType,
        itemId: itemId
    };
};

export const getBudgetInfo = () => {
    return {
        totalBudget: globalData.totalBudget,
        totalIncome: globalData.totalAmount.inc,
        totalExpense: globalData.totalAmount.exp,
        totalPercentages: globalData.totalPercentages,
        totalData: globalData.allData
    };
};

export const getItemPercentage = () => {
    const allPercentages = globalData.allData.exp.map((cur) => {
        return cur.getPercentage();
    });
    return allPercentages;
};

export const newItem = (type, description, value) => {
    let newItem;
    let id;
    if (globalData.allData[type].length > 0) {
        id = (globalData.allData[type][globalData.allData[type].length - 1].id) + 1;
    } else {
        id = 0;
    }
    if (type === 'inc') {
        newItem = new Income(id, description, value, type);
        newItem.incomeDateStamp();
    } else if (type === 'exp') {
        newItem = new Expense(id, description, value, type);
        newItem.expenseDateStamp();
    }
    globalData.allData[type].push(newItem);
    return newItem;
};

export const calculateItemPercentage = () => {
    if (globalData.allData.exp) {
        globalData.allData.exp.forEach((cur) => {
            cur.calculatePercentage(globalData.totalAmount.inc);
        });
    }
};

export const storeData = () => {
    const allItems = [...globalData.allData.inc, ...globalData.allData.exp];
    if (localStorage) {
        localStorage.setItem('items', JSON.stringify(allItems));
    }
};

export const retrieveData = () => {
    const storage = JSON.parse(localStorage.getItem('items'));
    storage.forEach((cur) => {
        if (cur.type === 'exp') {
            Object.setPrototypeOf(cur, Expense.prototype);
        } else if (cur.type === 'inc') {
            Object.setPrototypeOf(cur, Income.prototype);
        }
    });
    storage.forEach((el) => {
        if (el.type === 'inc') {
            globalData.allData.inc.push(el);
        } else {
            globalData.allData.exp.push(el);
        }
    });
    return storage;
};

export const deleteStorageItem = (id, type) => {
    const retrieveData = JSON.parse(localStorage.getItem('items'));
    retrieveData.forEach((cur, index) => {
        if (cur.id === id && cur.type === type) {
            retrieveData.splice(index, 1);
            localStorage.setItem('items', JSON.stringify(retrieveData));
        }
    });
};
