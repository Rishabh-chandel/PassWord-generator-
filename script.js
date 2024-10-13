const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCnt = 0;
setIndicator("#ccc")
handleSlider();

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "%100%";
}

function handlecheckBoxChange() {
    checkCnt = 0;
    allCheckBox.forEach((checkBox) => {
        if(checkBox.checked) checkCnt++;
    });

    if(passwordLength < checkCnt) {
        passwordLength = checkCnt;
        handleSlider();
    }
}

allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change' , handlecheckBoxChange);
})

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max) {
    return Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function getLowerCase() {
    return String.fromCharCode(getRndInteger(97,123));
}

function getUpperCase() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function shufflePassword(array) {     // algo hai, fisher yeild
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } 
    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

inputSlider.addEventListener('input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click' , () => {
    if(passwordDisplay)
    {
        copyContent();
    }
});

generateBtn.addEventListener('click', () => {
    if(checkCnt == 0) return;
    if(passwordLength < checkCnt)
    {
        passwordLength = checkCnt;
        handleSlider();
    }
    // remove the old pass
    password = "";
    // // putting stuff mentioned in check boc-->
    // if(uppercaseCheck.checked)
    // {
    //     password+=getUpperCase();
    // }
    // if(lowercaseCheck.checked)
    // {
    //     password+=getLowerCase();
    // }
    // if(numbersCheck.checked)
    // {
    //     password+=generateRandomNumber();
    // }
    // if(symbols.checked)
    // {
    //     password+=generateSymbol();
    // }
    let funArr = [];
    if(uppercaseCheck.checked) {
        funArr.push(getUpperCase);
    }
    if(lowercaseCheck.checked) {
        funArr.push(getLowerCase);
    }
    if(numbersCheck.checked) {
        funArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked) {
        funArr.push(generateSymbol);
    }
    for(let i=0;i<funArr.length;i++)
    {
        password+=funArr[i]();
    }
    for(let i=0;i<passwordLength-funArr.length;i++)
    {
        let randomIdx = getRndInteger(0,funArr.length);
        password+=funArr[randomIdx]();
    }
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});