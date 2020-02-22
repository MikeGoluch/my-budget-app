import './style.css';
//budget__expenses--percentage
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
            //total income - total expense
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
                totalPercentages: globalData.totalPercentages,
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
    
    
return {
    getInputValue: function() {
        let descInput = document.querySelector('.add__description').value;
        let valueInput = parseInt(document.querySelector('.add__value').value);
        return {
            desc: descInput,
            val: valueInput
        }
    },
    getTypeValue: function() {
        let select = document.querySelector('.add__type').value;
        return select;
    },
    clearInputValues: function() {
        let descInput = document.querySelector('.add__description').value = "";
        let valueInput = document.querySelector('.add__value').value = "";
    },
    displayItem: function(type, item) {
        const incList = document.querySelector('.income__list');
        const expList = document.querySelector('.expenses__list');
        
        const incMarkup = 
        `<div class="item clearfix" id="${type}-${item.id}">
            <div class="item__description">${item.description}</div>
            <div class="right clearfix">
                <div class="item__value">+ ${item.value}</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
        const expMarkup = 
        `<div class="item clearfix" id="${type}-${item.id}">
            <div class="item__description">${item.description}</div>
            <div class="right clearfix">
                <div class="item__value">- ${item.value}</div>
                <div class="item__percentage">${item.percentage}%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
        type === 'inc' ? incList.insertAdjacentHTML('beforeend', incMarkup) : expList.insertAdjacentHTML('beforeend', expMarkup);

    },
    displayBudgetInfo: function(obj) {
        document.querySelector('.budget__value').innerHTML = obj.totalBudget;
        document.querySelector('.budget__income--value').innerHTML = obj.totalIncome;
        document.querySelector('.budget__expenses--value').innerHTML = obj.totalExpense;
        document.querySelector('.budget__expenses--percentage').innerHTML = `${obj.totalPercentages}%`;
    },
    deleteUiItem: function(itemId) {
            const el = document.getElementById(itemId);
            el.parentNode.removeChild(el);
        }
    }
})();

//APP CONTROLLER

const appCtrl = (function(budgetCtrl, uiCtrl) {
    document.querySelector('.add__btn').addEventListener('click', function() {
        let type = uiCtrl.getTypeValue();
        let values = uiCtrl.getInputValue();
        let obj = budgetCtrl.newItem(type, values.desc, values.val);
        budgetCtrl.calculateBudget();
        budgetCtrl.calculatePercentage();
        let budgetInfo = budgetCtrl.getBudgetInfo();
        uiCtrl.displayBudgetInfo(budgetInfo)
        uiCtrl.displayItem(type, obj);
        uiCtrl.clearInputValues();
        console.log(budgetInfo);


    });
    document.addEventListener('keypress', function(e) {
        if(e.keyCode == 13 || e.which == '13') {
            let type = uiCtrl.getTypeValue();
            let values = uiCtrl.getInputValue();
            let obj = budgetCtrl.newItem(type, values.desc, values.val);
            budgetCtrl.calculateBudget();
            budgetCtrl.calculatePercentage();
            let budgetInfo = budgetCtrl.getBudgetInfo();
            uiCtrl.displayBudgetInfo(budgetInfo);
            uiCtrl.displayItem(type, obj);
            uiCtrl.clearInputValues();
        };
    });
    
    document.querySelector('.container').addEventListener('click', function(e) {
        const delItem = e.target.parentNode.parentNode.parentNode.parentNode.id;
        budgetCtrl.deleteCtrlItem(delItem);
        uiCtrl.deleteUiItem(delItem);
        budgetCtrl.calculateBudget();
        let budgetInfo = budgetCtrl.getBudgetInfo();
        uiCtrl.displayBudgetInfo(budgetInfo);
    });
    
    return {
        appInit: function() {
            document.querySelector('.budget__value').innerHTML = 0;
            document.querySelector('.budget__income--value').innerHTML = 0;
            document.querySelector('.budget__expenses--value').innerHTML = 0;
            document.querySelector('.budget__expenses--percentage').innerHTML = `---`;
        }
    }
})(budgetCtrl, uiCtrl);

appCtrl.appInit();