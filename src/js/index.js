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

    let globalData = {
        allData: {
            inc: [],
            exp: []
        }
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
        }
    }
})();

//UI CONTROLLER

const uiCtrl = (function() {
    
    
return {
    getInputValue: function() {
        let descInput = document.querySelector('.add__description').value;
        let valueInput = document.querySelector('.add__value').value;
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
    }
}
    
    
})();

//APP CONTROLLER

const appCtrl = (function(budgetCtrl, uiCtrl) {
    document.querySelector('.add__btn').addEventListener('click', function() {
        let type = uiCtrl.getTypeValue();
        console.log('type', type);
        let values = uiCtrl.getInputValue();
        console.log('values', values);
        let obj = budgetCtrl.newItem(type, values.desc, values.val);
        // console.log(budgetCtrl.globalData);
        console.log(obj);

        
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
})(budgetCtrl, uiCtrl);