import './style.css';

//BUDGET CONTROLLER

const budgetCtrl = (function() {
    
    const Expense = function(id, description, value, type) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = 0;
        this.type = type;
    };

    const Income = function(id, description, value, type) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.type = type;
    };

    Expense.prototype.calculatePercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome)*100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    const calculateTotalAmounts = function(type) {
        let total = 0;
        globalData.allData[type].forEach(function(cur) {
            total += cur.value;
        });
        globalData.totalAmount[type] = total;
    };

    let globalData = {
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
    }
    
    return {
        calculateBudget: function() {
            calculateTotalAmounts('inc');
            calculateTotalAmounts('exp');
            globalData.totalBudget = globalData.totalAmount.inc - globalData.totalAmount.exp;
            if (globalData.totalAmount.inc > 0) {
                globalData.totalPercentages = Math.round((globalData.totalAmount.exp / globalData.totalAmount.inc) * 100);
            } else {
                globalData.totalPercentages = -1;
            }
        },
        
        deleteCtrlItem: function(itemType, itemId) {
            const ids = globalData.allData[itemType].map((cur) => {
                return cur.id;
            });
            const indexNumber = ids.indexOf(itemId);
            console.log(indexNumber);
            if (indexNumber !== -1) {
                globalData.allData[itemType].splice(indexNumber, 1);
            };
            return {
                itemType: itemType,
                itemId: itemId
            };
        },

        getBudgetInfo: function() {
            return {
                totalBudget: globalData.totalBudget,
                totalIncome: globalData.totalAmount.inc,
                totalExpense: globalData.totalAmount.exp,
                totalPercentages: globalData.totalPercentages,
                totalData: globalData.allData
            }
        },

        getItemPercentage: function() {
            const allPercentages = globalData.allData.exp.map((cur) => {
                return cur.getPercentage();
            });
            return allPercentages;
        },

        newItem: function(type,description,value) {
            let newItem;
            let id;
            if (globalData.allData[type].length > 0) {
                id = (globalData.allData[type][globalData.allData[type].length - 1].id) + 1;
            } else {
                id = 0;
            }
            if (type === 'inc') {
                newItem = new Income(id, description, value, type);
            } else if (type === 'exp') {
                newItem = new Expense(id, description, value, type);
            }
            globalData.allData[type].push(newItem);
            return newItem;
        },

        calculateItemPercentage: function() {
            globalData.allData.exp.forEach((cur) => {
                cur.calculatePercentage(globalData.totalAmount.inc);
            });
        },
    }
})();

//UI CONTROLLER

const uiCtrl = (function() {
const domPaths = {
    addBtn: '.add__btn',
    clearStorageBtn: '.clear__btn',
    descriptionInput: '.add__description',
    valueInput: '.add__value',
    typeInput: '.add__type',
    incomeList: '.income__list',
    expenseList: '.expenses__list',
    totalBudgetDisplay: '.budget__value',
    totalIncomeDisplay: '.budget__income--value',
    totalExpenseDisplay: '.budget__expenses--value',
    totalExpensePercentageDisplay: '.budget__expenses--percentage',
    itemsContainer: '.container',
    itemPercentage: '.item__percentage',
    monthDesc: '.budget__title--month'
}

return {
    clearInputValues: function() {
        document.querySelector(domPaths.descriptionInput).value = "";
        document.querySelector(domPaths.valueInput).value = "";
    },

    changeBorderColor: function(type) {
        const inputType  = document.querySelector(domPaths.typeInput);
        const children = document.querySelectorAll(`[data-border='toggle']`);
        const childrenArray = Array.from(children);
        inputType.addEventListener('change', function() {
            inputType.classList.toggle('toggle_border');
            childrenArray.forEach((cur) => {
                cur.classList.toggle('toggle_border_container');
            })
        });
    },

    displayDateItem: function() {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        if (month < 10) {
            return `${day}.0${month}`;
        } else {
            return `${day}.${month}`;
        }
    },

    displayItem: function(item) {
        const incList = document.querySelector(domPaths.incomeList);
        const expList = document.querySelector(domPaths.expenseList);
        const incMarkup = 
        `<div class="item clearfix" id="${item.type}-${item.id}">
            <div class="item_date">${this.displayDateItem()}</div>
            <div class="item__description">${item.description}</div>
            <div class="right clearfix">
                <div class="item__value">${this.displayFormatedNumber(item.value, item.type)}</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
        const expMarkup = 
        `<div class="item clearfix" id="${item.type}-${item.id}">
            <div class="item_date">${this.displayDateItem()}</div>
            <div class="item__description">${item.description}</div>
            <div class="right clearfix">
                <div class="item__value">${this.displayFormatedNumber(item.value, item.type)}</div>
                <div class="item__percentage">${item.percentage}%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
        item.type === 'inc' ? incList.insertAdjacentHTML('beforeend', incMarkup) : expList.insertAdjacentHTML('beforeend', expMarkup);
    },

    displayFormatedNumber: function(number, type) {
        const formatOptions = { style: 'currency', currency: 'USD' };
        const formatedNumber = new Intl.NumberFormat('en-US', formatOptions);
        return type === 'inc' ? `+${formatedNumber.format(number)}` : `-${formatedNumber.format(number)}`;
    },

    displayItemPercentage: function(percentageArr) {
        const itemPercentageFields = document.querySelectorAll(domPaths.itemPercentage);
        const nodeListToArr = Array.from(itemPercentageFields);
        nodeListToArr.forEach((cur, index) => {
            if (percentageArr[index] > 0) {
                cur.textContent = `${percentageArr[index]}%`;
            } else {
                cur.textContent = `---`;
            }
        })
    },

    displayBudgetInfo: function(obj) {
        let type;
        obj.totalBudget > 0 ? type = 'inc' : 'exp';
        document.querySelector(domPaths.totalBudgetDisplay).innerHTML = this.displayFormatedNumber(obj.totalBudget, type);
        document.querySelector(domPaths.totalIncomeDisplay).innerHTML = this.displayFormatedNumber(obj.totalIncome, 'inc');
        document.querySelector(domPaths.totalExpenseDisplay).innerHTML = this.displayFormatedNumber(obj.totalExpense, 'exp');
        if (obj.totalPercentages > 0) {
            document.querySelector(domPaths.totalExpensePercentageDisplay).innerHTML = `${obj.totalPercentages}%`;
        } else {
            document.querySelector(domPaths.totalExpensePercentageDisplay).innerHTML = `---`;
        }
    },

    deleteUiItem: function(itemId) {
            const el = document.getElementById(itemId);
            el.parentNode.removeChild(el);
    },
    
    displayMonth: function() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dateObj = new Date();
        const date = months[dateObj.getMonth()] + ' ' + dateObj.getFullYear();
        document.querySelector(domPaths.monthDesc).textContent = date;
    },
    
    deleteAllIncomeItems: function() {
        const parentEl = document.querySelector(domPaths.incomeList);
        while (parentEl.firstChild) {
            parentEl.removeChild(parentEl.lastChild);
        };
    },

    deleteAllExpenseItems: function() {
        const parentEl = document.querySelector(domPaths.expenseList);
        while (parentEl.firstChild) {
            parentEl.removeChild(parentEl.lastChild);
        };
    },

    deleteAllUiItems: function() {
        this.deleteAllIncomeItems();
        this.deleteAllExpenseItems();
    },

    getDomPaths: function() {
        return domPaths;
    },
    
    getInputs: function() {
        let typeInput = document.querySelector(domPaths.typeInput).value;
        let descInput = document.querySelector(domPaths.descriptionInput).value;
        let valueInput = parseFloat(document.querySelector(domPaths.valueInput).value);
        return {
            type: typeInput,
            description: descInput,
            value: valueInput
        }
    },
}})();

//APP CONTROLLER

const appCtrl = (function(budgetCtrl, uiCtrl) {
    const dom = uiCtrl.getDomPaths();

    
    //LOCAL STORAGE
    const itemsStorage = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    const addStorageItem = function(newItem) {
        itemsStorage.push(newItem);
        localStorage.setItem('items', JSON.stringify(itemsStorage));
    };

    const clearStorageData = function() {
        const question = confirm(`Do You want to erase all data? Press 'OK' to confirm, press 'Cancel' to stop the action.`);
        if (question == true) {
            localStorage.clear();
            updateBudget();
            uiCtrl.displayBudgetInfo({
                totalBudget: 0,
                totalIncome: 0,
                totalExpense: 0,
                totalPercentages: `---`
            });
            uiCtrl.deleteAllUiItems();
            location.reload();
            console.log('1', budgetCtrl.globalData);
        }
    };

    const deleteStorageItem = function(selectedItem) {
        console.log(selectedItem)
        let retrieveData = JSON.parse(localStorage.getItem('items'));
        console.log('rd', retrieveData);
        for (let specificItem of retrieveData) {
            if (specificItem.id === parseInt(selectedItem.itemId)) {
                retrieveData.splice(specificItem.id, 1);
                localStorage.setItem('items', JSON.stringify(retrieveData));
            }
        }
    };

    const addNewItem = function() {
        let input = uiCtrl.getInputs();
        if (input.description !== "" && input.value > 0 && !isNaN(input.value)) {
            let obj = budgetCtrl.newItem(input.type, input.description, input.value);
            console.log('obj', obj);
            uiCtrl.displayItem(obj);
            uiCtrl.clearInputValues();
            updateBudget();
            updatePercentages();
            // addStorageItem(obj);
        };
        document.querySelector(dom.descriptionInput).focus();
    };

    const deleteItem = function(item) {
        const splitItem = item.split('-');
        const itemType = splitItem[0];
        const itemId = parseInt(splitItem[1]);
        budgetCtrl.deleteCtrlItem(itemType, itemId);
        uiCtrl.deleteUiItem(item);
        updateBudget();
        updatePercentages();
    };

    const updatePercentages = function() {
        budgetCtrl.calculateItemPercentage();
        const itemPercentages = budgetCtrl.getItemPercentage();
        uiCtrl.displayItemPercentage(itemPercentages);
    }

    const updateBudget = function() {
        budgetCtrl.calculateBudget();
        let budgetInfo = budgetCtrl.getBudgetInfo();
        console.log('budgetinfo', budgetInfo);
        uiCtrl.displayBudgetInfo(budgetInfo);
    };

    const setupEventListeners = function() {
        document.querySelector(dom.addBtn).addEventListener('click', addNewItem);
        document.addEventListener('keypress', function(e) {
            if(e.keyCode == 13 || e.which == '13') {
                addNewItem();
            };
        });
        document.querySelector(dom.itemsContainer).addEventListener('click', function(e) {
            const delItem = e.target.parentNode.parentNode.parentNode.parentNode.id;
            if (delItem) {
                deleteItem(delItem);
            }
        });
        document.querySelector(dom.clearStorageBtn).addEventListener('click', clearStorageData);
    };
    
    return {
        appInit: function() {
            function localStorageTest(){
                const test = "test" + new Date().valueOf();
                try {
                    localStorage.setItem(test, test);
                    localStorage.removeItem(test);
                    return true;
                } catch(e) {
                    return false;
                }
            };

            if (localStorageTest()) {
                if (localStorage.hasOwnProperty('items')) {
                    let loadData = JSON.parse(localStorage.getItem('items'));
                    console.log(loadData);
                    loadData.forEach((item) => {
                        uiCtrl.displayItem(item);
                    });
                } else {
                    uiCtrl.displayBudgetInfo({
                        totalBudget: 0,
                        totalIncome: 0,
                        totalExpense: 0,
                        totalPercentages: `---`
                    });
                }
            };

            let input = uiCtrl.getInputs();
            setupEventListeners();
            uiCtrl.displayMonth();
            uiCtrl.changeBorderColor(input.type);
        }
    };
})(budgetCtrl, uiCtrl);

appCtrl.appInit();


// to do
/*
    - store dates in localStorage
    - localStorage ()
*/