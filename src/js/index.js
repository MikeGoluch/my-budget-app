import './style.css';
//BUDGET CONTROLLER

const budgetCtrl = (function() {
    
    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = 0;
    };

    const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    Expense.prototype.calculatePerc = function() {
        if (globalData.totalAmount.inc > 0) {
            const roundPerc = Math.round((this.value / globalData.totalAmount.inc)*100);
            this.percentage = roundPerc;
        } else {
            this.percentage = -1;
        }
    };
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
        newItem: function(type,description,value) {
            let newItem;
            let id;
            if (globalData.allData[type].length > 0) {
                id = (globalData.allData[type][globalData.allData[type].length - 1].id) + 1;
            } else {
                id = 0;
            }
            if (type === 'inc') {
                newItem = new Income(id, description, value);
            } else if (type === 'exp') {
                newItem = new Expense(id, description, value);
                newItem.calculatePerc();
            }

            globalData.allData[type].push(newItem);
            return newItem;
        },
        calculateBudget: function() {
            calculateTotalAmounts('inc');
            calculateTotalAmounts('exp');
            globalData.totalBudget = globalData.totalAmount.inc - globalData.totalAmount.exp;
            console.log(globalData.totalBudget);
        },
        
        getBudgetInfo: function() {
            return {
                totalBudget: globalData.totalBudget,
                totalIncome: globalData.totalAmount.inc,
                totalExpense: globalData.totalAmount.exp,
                totalPercentages: globalData.totalPercentages + '%',
                totalData: globalData.allData
            }
        },
        calculatePercentage: function() {
            let percentages = 0;
            globalData.allData.exp.forEach(function(cur) {
                percentages += cur.percentage;
            });
            globalData.totalPercentages = percentages;
        },
        deleteCtrlItem: function(item) {
            const splitItem = item.split('-');
            const itemType = splitItem[0];
            const itemId = splitItem[1];
            globalData.allData[itemType].splice(itemId, 1);

            return {
                item: item,
                itemType: itemType,
                itemId: itemId
            };
        }
    }
})();

//UI CONTROLLER

const uiCtrl = (function() {
const domPaths = {
    addBtn: '.add__btn',
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
    monthDesc: '.budget__title--month'
}
    
return {
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
    clearInputValues: function() {
        document.querySelector(domPaths.descriptionInput).value = "";
        document.querySelector(domPaths.valueInput).value = "";
    },
    displayItem: function(type, item) {
        const incList = document.querySelector(domPaths.incomeList);
        const expList = document.querySelector(domPaths.expenseList);
        const incMarkup = 
        `<div class="item clearfix" id="${type}-${item.id}">
            <div class="item__description">${item.description}</div>
            <div class="right clearfix">
                <div class="item__value">${this.displayFormatedNumber(item.value, type)}</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
        const expMarkup = 
        `<div class="item clearfix" id="${type}-${item.id}">
            <div class="item__description">${item.description}</div>
            <div class="right clearfix">
                <div class="item__value">${this.displayFormatedNumber(item.value, type)}</div>
                <div class="item__percentage">${item.percentage}%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
        type === 'inc' ? incList.insertAdjacentHTML('beforeend', incMarkup) : expList.insertAdjacentHTML('beforeend', expMarkup);
    },
    displayFormatedNumber: function(number, type) {
        const formatOptions = { style: 'currency', currency: 'USD' };
        const formatedNumber = new Intl.NumberFormat('en-US', formatOptions);
        return type === 'inc' ? `+${formatedNumber.format(number)}` : `-${formatedNumber.format(number)}`;
    },
    displayBudgetInfo: function(obj) {
        let type;
        obj.totalBudget > 0 ? type = 'inc' : 'exp';
        document.querySelector(domPaths.totalBudgetDisplay).innerHTML = this.displayFormatedNumber(obj.totalBudget, type);
        document.querySelector(domPaths.totalIncomeDisplay).innerHTML = this.displayFormatedNumber(obj.totalIncome, 'inc');
        document.querySelector(domPaths.totalExpenseDisplay).innerHTML = this.displayFormatedNumber(obj.totalExpense, 'exp');
        document.querySelector(domPaths.totalExpensePercentageDisplay).innerHTML = obj.totalPercentages;
    },
    deleteUiItem: function(itemId) {
            const el = document.getElementById(itemId);
            el.parentNode.removeChild(el);
    },
    getDomPaths: function() {
        return domPaths;
    },
    displayMonth: function() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dateObj = new Date();
        const date = months[dateObj.getMonth()] + ' ' + dateObj.getFullYear();
        console.log(date);
        document.querySelector(domPaths.monthDesc).textContent = date;
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
    }
}})();

//APP CONTROLLER

const appCtrl = (function(budgetCtrl, uiCtrl) {

    const addNewItem = function() {
        let input = uiCtrl.getInputs();
        console.log(input);
        
        if (input.description !== "" && input.value > 0 && !isNaN(input.value)) {
            let obj = budgetCtrl.newItem(input.type, input.description, input.value);
            uiCtrl.displayItem(input.type, obj);
            uiCtrl.clearInputValues();
            updateBudget();
        }
    };

    const deleteItem = function(item) {
        budgetCtrl.deleteCtrlItem(item);
        uiCtrl.deleteUiItem(item);
    }

    const updateBudget = function() {
        budgetCtrl.calculateBudget();
        budgetCtrl.calculatePercentage();
        let budgetInfo = budgetCtrl.getBudgetInfo();
        uiCtrl.displayBudgetInfo(budgetInfo);
    };


    const setupEventListeners = function() {
        const dom = uiCtrl.getDomPaths();
        document.querySelector(dom.addBtn).addEventListener('click', addNewItem);
        document.addEventListener('keypress', function(e) {
            if(e.keyCode == 13 || e.which == '13') {
                addNewItem();
            };
        });
        document.querySelector(dom.itemsContainer).addEventListener('click', function(e) {
            const delItem = e.target.parentNode.parentNode.parentNode.parentNode.id;
            deleteItem(delItem);
            budgetCtrl.calculateBudget();
            let budgetInfo = budgetCtrl.getBudgetInfo();
            uiCtrl.displayBudgetInfo(budgetInfo);
        });

    };
    
    return {
        appInit: function() {
            let input = uiCtrl.getInputs();
            uiCtrl.displayBudgetInfo({
                totalBudget: 0,
                totalIncome: 0,
                totalExpense: 0,
                totalPercentages: `---`
            });
            setupEventListeners();
            uiCtrl.displayMonth();
            uiCtrl.changeBorderColor(input.type);
        }
    };
})(budgetCtrl, uiCtrl);

appCtrl.appInit();