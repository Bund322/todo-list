function getDate () {
    let data = new Date();

    let day = data.getDate();
    let month = data.getMonth();
    let year = data.getFullYear();
    const arr = new Map([
        [0, 'Января'],
        [1, 'Февраля'],
        [2, 'Марта'],
        [3, 'Апреля'],
        [4, 'Мая'],
        [5, 'Июня'],
        [6, 'Июля'],
        [7, 'Августа'],
        [8, 'Сентября'],
        [9, 'Октября'],
        [10, 'Ноября'],
        [11, 'Декабря']
      ]);
      if(day < 10){day = "0" + day}
      let date = day + " " + arr.get(month) + " " + year;
      document.querySelector('#actuallyDate').innerHTML = date;
}

function clock () {
    let data = new Date();  
    let hour = data.getHours();
    let minute = data.getMinutes();
    let second =  data.getSeconds();
    if(hour < 10){hour = "0" + hour;}
    if(minute < 10){minute = "0" + minute;}
    if(second < 10){second = "0" + second;}
    let time = hour + ":" +  minute + ":" + second;
    document.querySelector('#actuallyTime').innerHTML = time;
}

const form = document.querySelector('#form');
const formInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
let tasks = [];

//Проверка local storage на наличие задач
if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

//рендер задачи на страницу
function renderTask(task) {
    //Формируем css классы
    const cssClassLabel = task.done?'input-done done-check':'input-done';
    const cssClass = task.done?'list-group-item__check list-group-item__check--active':'list-group-item__check';

    const taskTemplate = `
    <li id = "%idTask%" class="list-group-item">
        <div class="list-group-item__left">
        <input type="checkbox" class="done" id = "done">
        <label data-action = "done" for="done" class = "${cssClassLabel}"></label>
            <span class = "${cssClass}">%task%</span>
        </div>
        <button data-action = "delete" class="btn-action delete-btn">
            <img src="./img/trash.svg" alt="Delete">
        </button>
    </li>
    `;
    const taskHTML = taskTemplate.replace('%task%', task.text).replace('%idTask%', task.id);
    taskList.insertAdjacentHTML('beforeend', taskHTML);
}

//Проверка на существующие задачи
function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = `
        <li id = "emptyList" class = "list-group-item empty-list">
            <div class="list-group-item__left empty-list__block">
                <img src="./img/empty-list.svg" alt="">
                <div class="empty-list__title">Список дел пуст</div>
            </div>
        </li>
        `;
        taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } 
    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null ;
    }
}

//Сохранение массива задач в local storage
function saveToLocalStorage() {localStorage.setItem('tasks', JSON.stringify(tasks));}


clock();
getDate();
setInterval(clock, 1000);
checkEmptyList();


//Добавление задачи
form.addEventListener('submit', (event) => {
    event.preventDefault(); //отмена отправки формы
    const taskText = formInput.value;

    //описание задачи в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    //добавляем задачу в массив с задачами
    tasks.push(newTask);

    //отображаем новую задачу
    renderTask(newTask);
    
    formInput.value = '';
    formInput.focus();

    checkEmptyList();
    saveToLocalStorage();
});

//Удаление задачи
taskList.addEventListener('click', (event) => {
    if(event.target.dataset.action === 'delete') {
        const parentNode = event.target.closest('.list-group-item');

        //определяем id задачи
        const id = Number(parentNode.id);
        const index = tasks.findIndex((task) => task.id === id);

        //удаление задачи из массива
        tasks.splice(index, 1);

        //удаление задачи из разметки
        parentNode.remove();
    }
    checkEmptyList();
    saveToLocalStorage();
});

//Отмечаем завершенной задачу
taskList.addEventListener('click', (event) => {
    if(event.target.dataset.action === 'done') {
        const parentNode = event.target.closest('.list-group-item');
        
        //Определяем id задачи
        const id = Number(parentNode.id);

        const task = tasks.find((task) => task.id === id);

        //меняем с true на false и наоборот
        task.done = !task.done;
        
        const taskTitle = parentNode.querySelector('.list-group-item__check');
        const taskLabel = parentNode.querySelector('.input-done');
        taskLabel.classList.toggle('done-check');
        taskTitle.classList.toggle('list-group-item__check--active');
    }
});



