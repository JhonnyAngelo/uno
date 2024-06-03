import Student from './Student.js';
import ObjectList from './ObjectList.js';
export default function ViewHandler() {
    this.studentList = new ObjectList();
    this.fnEl = document.getElementById('firstname');
    this.lnEl = document.getElementById('lastname');
    this.emailEl = document.getElementById('email');
    this.outEl = document.getElementById('outputlist');
}

ViewHandler.prototype.renderStudents = function() {
    let studentList = this.studentList.getAll();

    this.outEl.innerHTML = '';

    for(let i = 0; i < studentList.length; i++) {
        this.outEl.append(this.createStudentCard(studentList[i], i));
    }
}

ViewHandler.prototype.createStudentCard = function(student, index) {
    let that = this;
    
    let studentCard = document.createElement('div');
    studentCard.className = 'card col-2.5';

    // smaller elements
    let iconUser = '<i class="fa-solid fa-user fa-6x"></i>';
    let iconEnvelope = '<i class="fa-solid fa-envelope"></i>';
    let iconTrash = '<i class="fa-solid fa-trash"></i>';
    
    let title = `<h6 class="card-title">${student.firstname} ${student.lastname}</h6>`;
    
    let linkEmail = document.createElement('button');
    linkEmail.type = 'button';
    linkEmail.className = 'btn btn-link small';
    linkEmail.innerHTML = `${iconEnvelope} E-Mail`;
    linkEmail.onclick = () => alert(student.email);

    let deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-outline-danger small';
    deleteButton.style.padding = '0.2rem 0.4rem';
    deleteButton.dataset.index = index;
    deleteButton.innerHTML = `${iconTrash} DELETE`;
    deleteButton.onclick = function() {
        let indexToDelete = Number(this.getAttribute('data-index'));
        that.studentList.deleteByIndex(indexToDelete);
        that.renderStudents();
    };

    // 3 main elements
    let cardHeader = `<div class="card-header">${iconUser}</div>`;  // studentCard.children[0]
    let cardBody = `<div class="card-body">${title}</div>`;         // studentCard.children[1]
    let cardFooter = `<div class="card-footer"></div>`;             // studentCard.children[2]
    studentCard.innerHTML = `${cardHeader}${cardBody}${cardFooter}`;
    
    studentCard.children[1].append(linkEmail);      // cardBody
    studentCard.children[2].append(deleteButton);   // cardFooter

    // little display changes
    studentCard.children[0].classList.add('d-inline-flex'); 
    studentCard.children[0].classList.add('justify-content-center');

    studentCard.children[1].children[1].style.paddingBottom = '0';
    studentCard.children[1].style.padding = '1rem';

    studentCard.children[2].classList.add('d-inline-flex'); 
    studentCard.children[2].classList.add('justify-content-end');

    return studentCard;
}

ViewHandler.prototype.bind = function(buttonId) {
    let buttonEl = document.getElementById(buttonId);

    buttonEl.onclick = () => {    
        if(this.validateInput()) {
            this.studentList.add(new Student(this.fnEl.value, this.lnEl.value, this.emailEl.value));
            this.renderStudents();
        }
    };
}

ViewHandler.prototype.validateInput = function() {
    let firstname = this.fnEl.value;
    let lastname = this.lnEl.value;
    let email = this.emailEl.value;
    let valid = true;

    if(firstname == '' || firstname.includes(' ')) {
        this.fnEl.classList.add('is-invalid');
        hide('errorFn', false);
        valid = false;
    } else {
        this.fnEl.classList.remove('is-invalid');
        hide('errorFn', true);
    }

    if(lastname == '' || lastname.includes(' ')) {
        this.lnEl.classList.add('is-invalid');
        hide('errorLn', false);
        valid = false;
    } else {
        this.lnEl.classList.remove('is-invalid');
        hide('errorLn', true);
    }

    if(email.includes('@') == false || email == '@' || email.includes(' ')) {
        this.emailEl.classList.add('is-invalid');
        hide('errorEmail', false);
        valid = false;
    } else {
        this.emailEl.classList.remove('is-invalid');
        hide('errorEmail', true);
    }

    return valid;
}

function hide(id, boolean) {
    let el = document.getElementById(id);

    if(boolean && el.classList.contains('hide') == false)
        el.classList.add('hide');
    else if(!boolean && el.classList.contains('hide') == true)
        el.classList.remove('hide');
}

function clearInputFields(formId) {
    let inputElementList = document.querySelectorAll(`#${formId} input`);

    for(let inputEl of inputElementList) {
        inputEl.value = '';
    }
}

function start() {
    let view = new ViewHandler();

    document.getElementById('clearForm').onclick = () => clearInputFields('formStudent');
    view.bind('addStudent');
}

start();