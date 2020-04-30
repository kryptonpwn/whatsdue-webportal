if(document.getElementById("addStudent")){
    document.getElementById("addStudent").addEventListener("click", studentForm);
    studentCount=1;
}

if(document.getElementById("addOfficeHours")){
    document.getElementById("addOfficeHours").addEventListener("click", officeHours);
    officeCount=1;
}

if(document.getElementById("addAssignment")){
    document.getElementById("addAssignment").addEventListener("click", assignmentForm);
    assignmentCount=1;
}

// on click, this function creates a new div element and populates it with the 
// needed input fields, then appends the div to the main page.
// used in the CreateCourse page
// th:field="*{students[__${index.index}__].lastName}"
function studentForm() {
    let newDiv = document.createElement('div');
    newDiv.innerHTML = `<div class="row">
                        <div class="col">
                            Student Information
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <input type="text" class="form-control" name = "firstName"placeholder="First name">
                        </div>
                        <div class="col">
                            <input type="text" name="lastName" class="form-control" placeholder="Last name">
                        </div>
                        <div class="col">
                            <input type="text" class="form-control" name = "id" placeholder="Student ID number">
                        </div>
                    </div>
                    <hr>`;
    newDiv.setAttribute('id', 'student'+studentCount);
    document.getElementById('formBody').append(newDiv);
    studentCount++;
}

// used on the CreateSyllabus page
// nearlly identical to the studentForm function, only this one is for office hours
function officeHours(){
    let newDiv = document.createElement('div');
    newDiv.innerHTML = `<div class="row">
                            <div class="col">
                                <label>Office hours date</label>
                                <input type="date" class="form-control" placeholder="">
                            </div>
                            <div class="col">
                                <label>Office hours time start</label>
                                <input type="time" class="form-control">
                            </div>
                            <div class="col">
                                <label>Office hours time end</label>
                                <input type="time" class="form-control">
                            </div>

                        </div>`;
    newDiv.setAttribute('id', 'officeHours'+officeCount);
    document.getElementById('hoursBody').append(newDiv);
    officeCount++;
}

// used on the CreateSyllabus page
// nearlly identical to the studentForm function, only this one is for assignments
function assignmentForm() {
    var newDiv = document.createElement('div');
    // language=HTML
    newDiv.innerHTML = `<div class="row">
                            <div class="col">
                                <label>Assignment Title</label>
                                <input type="text" class="form-control" placeholder="Assignment name">
                            </div>
                            <div class="col">
                                <label>Due Date</label>
                                <input type="date" class="form-control" placeholder="">
                            </div>
                        </div>
                        <hr>`;
    newDiv.setAttribute('id', 'assignment'+assignmentCount);
    document.getElementById('assignmentBody').append(newDiv);
    assignmentCount++;
}