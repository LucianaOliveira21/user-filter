let countUsers = 0;
let countMen   = 0;
let countWomen = 0;
let sumAges    = 0;
let avgAges    = 0;

let btnSearch     = null;
let inputSearch   = null;
let numberFormat  = null;

let allUsers      = [];
let filteredUsers = [];

let tabUserList   = null;

window.addEventListener('load', start);

function start(event) {
    event.preventDefault();

    tabUserList = document.querySelector('#tabUserList');
    btnSearch   = document.querySelector('#btnSearch');
    inputSearch = document.querySelector('#inputSearch');
    countUsers  = document.querySelector('#countUsers');
    countMen    = document.querySelector('#countMen');
    countWomen  = document.querySelector('#countWomen');
    sumAges     = document.querySelector('#sumAges');
    avgAges     = document.querySelector('#avgAges');

    numberFormat = Intl.NumberFormat('pt-BR');

    fetchUser();
    activateInput();
    btnSearchClick();
}

async function fetchUser() {
    const res  = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const json = await res.json();

    allUsers = json.results.map(user => {
        const {name, picture, dob, gender} = user;

        return {
            name: name.first + ' ' + name.last,
            picture: picture.medium,
            age: dob.age,
            gender
        }
    });

    filteredUsers = allUsers;

    filteredUsers.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    render();
}

function activateInput(event) {
    inputSearch.focus();

    inputSearch.addEventListener('keyup', handleTyping);

    function handleTyping(event) {
        let value = event.target.value;

        if (event.key === 'Enter') {
            search(value.toLowerCase());
        } else if (value !== '') {
            btnSearch.classList.remove('disabled');
        } else {
            btnSearch.classList.add('disabled');
        }
    }
}

function btnSearchClick() {
    function handleTyping(event) {
        let value = inputSearch.value;
        search(value.toLowerCase());

        inputSearch.focus();
    }

    btnSearch.addEventListener('click', handleTyping);
}

function render() {
    let userListHTML = '<div>';

    filteredUsers.forEach(user => {
        const {name, age, picture} = user;

        const userHTML = `
            <div class="user">
                <div>
                    <img src="${picture}" alt="">                
                </div>
                <div>
                    <ul>
                        <li>${name}, ${age} anos</li>
                    </ul>
                </div>
            </div>`;

        userListHTML += userHTML;
    });

    userListHTML += '<div>';
    tabUserList.innerHTML = userListHTML;

    setStatistics();
}

function setStatistics() {
    const totalUsers = filteredUsers.length;
    countUsers.textContent = filteredUsers.length;

    //Total de homens
    const men = filteredUsers.filter(user => {
       return user.gender === 'male';
    });

    countMen.textContent = men.length;

    //Total de mulheres
    const women = filteredUsers.filter(user => {
        return user.gender === 'female';
    });

    countWomen.textContent = women.length;

    //Soma das idades
    const totalAges = filteredUsers.reduce((acc, current) => {
        return acc + current.age;
    }, 0);

    sumAges.textContent = formatNumber(totalAges);

    //Média das idades
    avgAges.textContent = formatNumber(totalAges / totalUsers);
}

function search(value) {
    filteredUsers = allUsers.filter(user => {
        return user.name.toLowerCase().includes(value);
    });

    render();
}

function formatNumber(number) {
    return numberFormat.format(number);
}


