export class Classroom {
    _app;

    // Environment
    _students = [];
    _teachers = [];
    _desks = [];

    constructor(app) {
        this._app = app;
        console.log(this._app);
    }

    addStudent(student) {
        this._students.push(student);
    }

    addDesk(desk) {
        this._desks.push(desk);
    }
}

export default Classroom;