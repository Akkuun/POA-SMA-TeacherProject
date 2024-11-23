export class Classroom {
    _app;

    // Environment
    _students = [];
    _teachers = [];
    _tables = [];

    constructor(app) {
        this._app = app;
        console.log(this._app);
    }

    addStudent(student) {
        this._students.push(student);
    }
}

export default Classroom;