import './style.css';
import * as budgetCtrl from './components/budgetctrl';
import * as uiCtrl from './views/uictrl';

//APP CONTROLLER

const dom = uiCtrl.getDomPaths();

const clearStorageData = () => {
    const question = confirm(`Do You want to erase all data? Press 'OK' to confirm, press 'Cancel' to stop the action.`);
    if (question === true) {
        localStorage.clear();
        updateBudget();
        uiCtrl.displayBudgetInfo({
            totalBudget: 0,
            totalIncome: 0,
            totalExpense: 0,
            totalPercentages: '---'
        });
        uiCtrl.deleteAllUiItems();
        location.reload();
    }
};

const addNewItem = () => {
    const input = uiCtrl.getInputs();
    if (input.description !== '' && input.value > 0 && !isNaN(input.value)) {
        const obj = budgetCtrl.newItem(input.type, input.description, input.value);
        uiCtrl.displayItem(obj);
        uiCtrl.clearInputValues();
        updateBudget();
        updatePercentages();
        budgetCtrl.storeData();
        // addStorageItem(obj);
    }
    document.querySelector(dom.descriptionInput).focus();
};

const deleteItem = (item) => {
    const splitItem = item.split('-');
    const itemType = splitItem[0];
    const itemId = parseInt(splitItem[1]);
    budgetCtrl.deleteCtrlItem(itemType, itemId);
    uiCtrl.deleteUiItem(item);
    budgetCtrl.deleteStorageItem(itemId, itemType);
    updateBudget();
    updatePercentages();
};

const updatePercentages = () => {
    budgetCtrl.calculateItemPercentage();
    const itemPercentages = budgetCtrl.getItemPercentage();
    uiCtrl.displayItemPercentage(itemPercentages);
};

const updateBudget = () => {
    budgetCtrl.calculateBudget();
    const budgetInfo = budgetCtrl.getBudgetInfo();
    uiCtrl.displayBudgetInfo(budgetInfo);
};

const setupEventListeners = () => {
    document.querySelector(dom.addBtn).addEventListener('click', addNewItem);
    document.addEventListener('keypress', (e) => {
        if (e.keyCode === 13 || e.which === '13') {
            addNewItem();
        }
    });
    document.querySelector(dom.itemsContainer).addEventListener('click', (e) => {
        // const delItem = e.target.parentNode.parentNode.parentNode.parentNode.id;
        const delItem = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (delItem) {
            deleteItem(delItem);
        }
    });
    document.querySelector(dom.clearStorageBtn).addEventListener('click', clearStorageData);
};

const appInit = () => {
    const localStorageTest = () => {
        const test = 'test' + new Date().valueOf();
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    };

    if (localStorageTest()) {
        if (localStorage.hasOwnProperty('items')) {
            // let loadData = JSON.parse(localStorage.getItem('items'));
            // console.log(loadData);
            // loadData.forEach((item) => {
            //     uiCtrl.displayItem(item);
            // });
            const retrievedData = budgetCtrl.retrieveData();
            retrievedData.forEach((el) => {
                uiCtrl.displayItem(el);
            });
            updateBudget();
            updatePercentages();
        } else {
            uiCtrl.displayBudgetInfo({
                totalBudget: 0,
                totalIncome: 0,
                totalExpense: 0,
                totalPercentages: '---'
            });
        }
    }

    const input = uiCtrl.getInputs();
    setupEventListeners();
    uiCtrl.displayMonth();
    uiCtrl.changeBorderColor(input.type);
    document.querySelector(dom.descriptionInput).focus();
};

appInit();
