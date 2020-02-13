import './style.css';

//BUDGET CONTROLLER

const budgetCtrl = (function() {
    
    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
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
        totalBudget: 0
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
            }

            globalData.allData[type].push(newItem);

            return newItem;
        },
        calculateBudget: function() {
            //total income - total expense
            calculateTotalAmounts('inc');
            calculateTotalAmounts('exp');
            globalData.totalBudget = globalData.totalAmount.inc - globalData.totalAmount.exp;
            console.log(globalData.totalAmount);
            console.log(globalData.totalBudget);
        },
        getBudgetInfo: function() {
            return {
                totalBudget: globalData.totalBudget,
                totalIncome: globalData.totalAmount.inc,
                totalExpense: globalData.totalAmount.exp
            }
        }
    }
})();

//UI CONTROLLER

const uiCtrl = (function() {
    
    // const stringToHTML = function (str) {
    //     var parser = new DOMParser();
    //     var doc = parser.parseFromString(str, 'text/html');
        
    // };
    
return {
    getInputValue: function() {
        let descInput = document.querySelector('.add__description').value;
        let valueInput = parseInt(document.querySelector('.add__value').value);
        // console.log(descInput);
        // console.log(valueInput);
        return {
            desc: descInput,
            val: valueInput
        }
    },
    getTypeValue: function() {
        let select = document.querySelector('.add__type').value;
        // let optionValue = select.options[select.selectedIndex].value;
        // console.log(select);
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
        `<div class="item clearfix" id="income-0">
            <div class="item__description">${item.description}</div>
            <div class="right clearfix">
                <div class="item__value">+ ${item.value}</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
        const expMarkup = 
        `<div class="item clearfix" id="expense-0">
            <div class="item__description">${item.description}</div>
            <div class="right clearfix">
                <div class="item__value">- ${item.value}</div>
                <div class="item__percentage">21%</div>
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
    }
}
    
    
})();

//APP CONTROLLER

const appCtrl = (function(budgetCtrl, uiCtrl) {
    document.querySelector('.add__btn').addEventListener('click', function() {
        let type = uiCtrl.getTypeValue();
        // console.log('type', type);
        let values = uiCtrl.getInputValue();
        // console.log('values', values);
        let obj = budgetCtrl.newItem(type, values.desc, values.val);
        // console.log(budgetCtrl.globalData);
        budgetCtrl.calculateBudget();
        let budgetInfo = budgetCtrl.getBudgetInfo();
        uiCtrl.displayBudgetInfo(budgetInfo)
        uiCtrl.displayItem(type, obj);
        uiCtrl.clearInputValues();
        // console.log(obj);

        
        // const test = budgetCtrl.newItem('inc', 'lol', 67);
        // console.log(test);

    });
    document.addEventListener('keypress', function(e) {
        if(e.keyCode == 13 || e.which == '13') {
            // getInputValue();
            
            // const test = budgetCtrl.newItem('inc', 'lol', 67);
            // console.log(test);
        };
    });

    return {
        appInit: function() {
            document.querySelector('.budget__value').innerHTML = 0;
            document.querySelector('.budget__income--value').innerHTML = 0;
            document.querySelector('.budget__expenses--value').innerHTML = 0;
        }
    }
})(budgetCtrl, uiCtrl);

appCtrl.appInit();