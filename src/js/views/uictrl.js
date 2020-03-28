//UI CONTROLLER

export const domPaths = {
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
};

export const clearInputValues = () => {
    document.querySelector(domPaths.descriptionInput).value = '';
    document.querySelector(domPaths.valueInput).value = '';
};

export const changeBorderColor = () => {
    const inputType = document.querySelector(domPaths.typeInput);
    const children = document.querySelectorAll(`[data-border='toggle']`);
    const childrenArray = Array.from(children);
    inputType.addEventListener('change', () => {
        inputType.classList.toggle('toggle_border');
        document.querySelector(domPaths.descriptionInput).focus();
        childrenArray.forEach((cur) => {
            cur.classList.toggle('toggle_border_description');
        });
    });
};

export const displayItem = (item) => {
    const incList = document.querySelector(domPaths.incomeList);
    const expList = document.querySelector(domPaths.expenseList);
    const incMarkup =
    `<div class="item clearfix" id="${item.type}-${item.id}">
        <div class="item_date">${item.date}</div>
        <div class="item__description">${item.description}</div>
        <div class="right clearfix">
            <div class="item__value">${displayFormatedNumber(item.value, item.type)}</div>
            <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
        </div>
    </div>`;
    const expMarkup =
    `<div class="item clearfix" id="${item.type}-${item.id}">
        <div class="item_date">${item.date}</div>
        <div class="item__description">${item.description}</div>
        <div class="right clearfix">
            <div class="item__value">${displayFormatedNumber(item.value, item.type)}</div>
            <div class="item__percentage">${item.percentage}%</div>
            <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
        </div>
    </div>`;
    item.type === 'inc' ? incList.insertAdjacentHTML('beforeend', incMarkup) : expList.insertAdjacentHTML('beforeend', expMarkup);
};

export const displayFormatedNumber = (number, type) => {
    const formatOptions = { style: 'currency', currency: 'USD' };
    const formatedNumber = new Intl.NumberFormat('en-US', formatOptions);
    return type === 'inc' ? `+${formatedNumber.format(number)}` : `-${formatedNumber.format(number)}`;
};

export const displayItemPercentage = (percentageArr) => {
    const itemPercentageFields = document.querySelectorAll(domPaths.itemPercentage);
    const nodeListToArr = Array.from(itemPercentageFields);
    nodeListToArr.forEach((cur, index) => {
        if (percentageArr[index] > 0) {
            cur.textContent = `${percentageArr[index]}%`;
        } else {
            cur.textContent = '---';
        }
    });
};

export const displayBudgetInfo = (obj) => {
    let type;
    obj.totalBudget > 0 ? type = 'inc' : 'exp';
    document.querySelector(domPaths.totalBudgetDisplay).innerHTML = displayFormatedNumber(obj.totalBudget, type);
    document.querySelector(domPaths.totalIncomeDisplay).innerHTML = displayFormatedNumber(obj.totalIncome, 'inc');
    document.querySelector(domPaths.totalExpenseDisplay).innerHTML = displayFormatedNumber(obj.totalExpense, 'exp');
    if (obj.totalPercentages > 0) {
        document.querySelector(domPaths.totalExpensePercentageDisplay).innerHTML = `${obj.totalPercentages}%`;
    } else {
        document.querySelector(domPaths.totalExpensePercentageDisplay).innerHTML = '---';
    }
};

export const deleteUiItem = (itemId) => {
        const el = document.getElementById(itemId);
        el.parentNode.removeChild(el);
};

export const displayMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dateObj = new Date();
    const date = months[dateObj.getMonth()] + ' ' + dateObj.getFullYear();
    document.querySelector(domPaths.monthDesc).textContent = date;
};

export const deleteAllIncomeItems = () => {
    const parentEl = document.querySelector(domPaths.incomeList);
    while (parentEl.firstChild) {
        parentEl.removeChild(parentEl.lastChild);
    }
};

export const deleteAllExpenseItems = () => {
    const parentEl = document.querySelector(domPaths.expenseList);
    while (parentEl.firstChild) {
        parentEl.removeChild(parentEl.lastChild);
    }
};

export const deleteAllUiItems = () => {
    deleteAllIncomeItems();
    deleteAllExpenseItems();
};

export const getDomPaths = () => {
    return domPaths;
};

export const getInputs = () => {
    const typeInput = document.querySelector(domPaths.typeInput).value;
    const descInput = document.querySelector(domPaths.descriptionInput).value;
    const valueInput = parseFloat(document.querySelector(domPaths.valueInput).value);
    return {
        type: typeInput,
        description: descInput,
        value: valueInput
    };
};
