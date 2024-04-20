import ObjectList from './ObjectList.js';
import StudentDAO from './StudentDAO.js';

export default function Facade(baseurl) {
    this.studentList = new ObjectList();
    this.studentdao = new StudentDAO(baseurl);
}

Facade.prototype.getStudentList = function() {
    return this.studentList;
}

Facade.prototype.loadStudents = function(renderCallback) {
    this.studentdao.loadStudents((studentList) => {
        
        this.studentList.clear();
        for(let student of studentList)
            this.studentList.add(student);
        
        renderCallback();
    });
}

Facade.prototype.addStudent = function(student, callback) {
    this.studentList.add(student);
    this.studentdao.addStudent(student, (response) => console.log(response));
    
    callback();
}

Facade.prototype.deleteStudent = function(index, callback) {
    let id = this.studentList.getByIndex(index).id;
    
    this.studentList.deleteByIndex(index);
    this.studentdao.deleteStudent(id, (response) => console.log(response));

    callback();
}
