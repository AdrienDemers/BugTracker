var database = firebase.database();

// Create Account Inputs
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const createAccountEmailInput = document.querySelector('#createAccountEmailInput');
const createAccountPasswordInput = document.querySelector('#createAccountPasswordInput');

// Create Bug Inputs
const bugTitleInput = document.querySelector('#bug-title');
const bugDescriptionInput = document.querySelector('#bug-description');
const newBugTitleInput = document.querySelector('#new-bug-title');
const newBugDescriptionInput = document.querySelector('#new-bug-description');
const bugDate = document.querySelector("#bug-date");
const bugTime = document.querySelector("#bug-time");


// Msg
const addBugMsg = document.querySelector('.msg');
const editBugMsg = document.getElementById('edit-msg');
const mainMsg = document.getElementById('main-message');
const projectMsg = document.getElementById('project-message');


var currentUser = {}
var currentProject = ""
var loginDiv = document.getElementsByClassName("login-form");
var signOutDivs = document.getElementsByClassName("sign-out");
var showBugs = document.querySelector('.show-bugs');

// Get modal element
var editBugMmodal = document.getElementById('editBugModal');
var closeBtn = document.getElementsByClassName('closeBtn')[0];

var createAccountModal = document.getElementById('CreateAccountModal');
var createAccountModalCloseBtn = document.getElementsByClassName('closeBtn')[1];
var rdProgrammer = document.getElementById('programmer');
var rdManager = document.getElementById('manager');



// Listeners

// edit bug modal exit
window.addEventListener('click', (e) => {
    if (e.target == editBugMmodal) 
        {editBugMmodal.style.display = 'none'; }
})
closeBtn.addEventListener('click', (e) => {
    editBugMmodal.style.display = 'none';
})
createAccountModalCloseBtn.addEventListener('click', (e) => {
    createAccountModal.style.display = 'none';
})

passwordInput.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        document.getElementById("sign-in-button").click();
    }
});

document.getElementById("create-account-modal-button").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("create account modal btn clicked");
    createAccountModal.style.display = 'block';

})
document.getElementById("create-account-button").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("create account btn clicked");
    console.log( "value radio: " + rdProgrammer.checked);
    var email = createAccountEmailInput.value;
    var password = createAccountPasswordInput.value;
    createAccount(email, password);
})
document.getElementById("sign-in-button").addEventListener("click", (e) => {
    e.preventDefault();
    var email = emailInput.value;
    var password = passwordInput.value;
    signIn(email, password);
})
document.getElementById("sign-out-button").addEventListener("click", (e) => {
    e.preventDefault();
    var loginHTML = "<h3>Sign in or create new account</h3>";


    loginHTML += "<form>";
    loginHTML += "<div class='form-group'> <label for='emailInput'>Email Address</label> <input type='email' class='form-control' id='emailInput' placeholder='Email'/> </div>";
    loginHTML += "<div class='form-group'> <label for='passwordInput'>Password</label> <input type='password' class='form-control' id='passwordInput' placeholder='Password'/> </div>";
    loginHTML += "<button type='button' class='btn' id='sign-in-button'>Sign in</button>";
    loginHTML += "<button type='button' class='btn' id='create-account-button'>Create Account</button>";
    loginHTML += "<button type='google-login-button' class='btn' id='google-sign-in-button'>Sign in with Googlesdf</button></form>";


    //document.getElementById("login-form").innerHTML = loginHTML;
    signOut();
})
document.getElementById("save-bug-btn").addEventListener("click", (e) => {
    var d = new Date();

    var bug = {
        id: bugTitleInput.value + Date.now(),
        owner: currentUser.uid,
        title: bugTitleInput.value,
        description: bugDescriptionInput.value,
        // time: Date.now(),
        dateAdded: getCurrentDate(),
        resolved: false,
        project: currentProject
    }

    console.log(`New bug parent project is: ${currentProject}`)

    if (bug.title != "") {
        addBugToDatabase(bug);
    } else {
        if (!addBugMsg.classList.contains('error') ) {
            addBugMsg.classList.add('error');
        }
        addBugMsg.innerHTML = "Please enter a title";
        setTimeout(() => addBugMsg.remove(), 2500);
    }
    bugTitleInput.value = "";
    bugDescriptionInput.value = "";
})
document.getElementById("update-bug-btn").addEventListener("click", (e) => {
    console.log("update bug btn clicked for : " + document.getElementById("bug-id").value);
    var bug = {
        id: document.getElementById("bug-id").value,
        owner: currentUser.uid,
        title: newBugTitleInput.value,
        description: newBugDescriptionInput.value,
        time: Date.now(),
        dateAdded: bugDate.innerHTML,
        resolved: document.getElementById("is-resolved").checked
    }

    if (bug.title != "") {
        addBugToDatabase(bug);
        editBugMmodal.style.display = 'none';
    } else {
        console.log("check");
        editBugMsg.classList.add('error');
        editBugMsg.innerHTML = "Please enter a title";
        setTimeout(() => editBugMsg.remove(), 2500);
    }
})
// End of Listeners


// Functions
function createAccount(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            //var user = userCredential.user;
            // ...
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            window.alert(errorMessage);
        });
}
function signIn(email, password) {
    console.log("Sign in fct called");

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;

            for (var i = 0; i < loginDiv.length; i++) {
                loginDiv[i].style.visibility = "hidden";
            }
            // ...
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
}
function signOut() {
    firebase.auth().signOut().then(() => {
        // Signed-out success
        console.log("Logged out");
        for (var i = 0; i < loginDiv.length; i++) {
            loginDiv[i].style.visibility = "initial";
        }
        for (var i = 0; i < signOutDivs.length; i++) {
            //signOutDivs[i].style.visibility = "hidden";
        }

    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
    })
}
function addBugToDatabase(b) {
    var database = firebase.database()
    firebase.database().ref("bugs/" + b.id).set(b)
    firebase.database().ref("users/" + currentUser.uid + "/bugs/" + b.id).set(b)
}
function deleteBug(b) {
    var bugID = b.getAttribute("id");
    firebase.database().ref("bugs/" + bugID).remove();
    firebase.database().ref("users/" + currentUser.uid + "/bugs/" + bugID).remove();
}
function editBug(b) {
    console.log(b);

    editBugModal.style.display = 'block';
    
    var bugID = b.getAttribute("bug-data-id");
    console.log(bugID);

    document.getElementById("bug-id").value = bugID;
    document.getElementById("edit-msg").innerHTML = `<p id='modal-mes'>"${bugID}"</p>`;
    document.getElementById("new-bug-title").value = b.getAttribute("bug-data-title");
    document.getElementById("new-bug-description").value = b.getAttribute("bug-data-desc");
    document.getElementById("bug-date").innerText = b.getAttribute("bug-data-date");

    if(b.getAttribute("bug-data-resolved") == "true") {
        document.getElementById("is-resolved").checked = true;
    } else {
        document.getElementById("is-resolved").checked = false;
    }
    /*
    firebase.database().ref("bugs/" + bugID).remove();
    firebase.database().ref("users/" + currentUser.uid + "/bugs/" + bugID).remove();
    */
}
function markResolvedBug(b) {
    var bugID = b.getAttribute("bug-data-id");
    console.log(`Mark resolved for this ID : ${bugID}`);
    console.log(`this b : ${b} `);

    firebase.database().ref("bugs/" + bugID + "/resolved").set(true);
    firebase.database().ref("users/" + currentUser.uid + "/bugs/" + bugID + "/resolved").set(true);
}

function createNewProject() {
    // var database = firebase.database()

    newProjectName = document.getElementById("new-project-name").value
    console.log("createNewProject fct called")

    var d = new Date();

    var project = {
        id: newProjectName + Date.now(), //Date.now() returns nbr of millisecs since jan 1 1970
        owner: currentUser.uid,
        name: newProjectName,
        // time: Date.now(),
        dateAdded: getCurrentDate()
    }

    if(project.name != "") {
        firebase.database().ref("projects/" + project.id).set(project)
        firebase.database().ref("users/" + currentUser.uid + "/projects/" + newProjectName).set(project)
        currentProject = newProjectName
        console.log(`Current Project is : ${currentProject}`)
        updateProjectDiv()
    }

}

// Project list does not show up initially, not sure why
function updateProjectList() {
        updateProjectDiv()
}

function updateProjectDiv() {
    var projectMsgString = `<br> <p>Current Project: ${currentProject} </p>` ;
        
        projectMsgString += "<br></br> <label for=''>Create new Project: </label>"
        projectMsgString += "<input type='text' id='new-project-name' placeholder='New Project Name'></input>"
        projectMsgString += "<br></br>"
        projectMsgString += "<button onclick=createNewProject()>Create New Project</button>"
        projectMsgString += "<button onclick=updateProjectList()>Update Project List</button>"
        projectMsgString += "<br></br> <p>Select project: </p>"

        var projectReference = firebase.database().ref().child("projects")

        projectReference.on("value", function (snapshot) {
            snapshot.forEach(function (childsnapshot) {

                var project = childsnapshot.val()
                if(project.owner === currentUser.uid) {
                    if(project.name != currentProject) {
                        projectMsgString += `<button onclick=selectProject(this)>${project.name}</button>`
                    } else {
                        projectMsgString += `<button onclick=selectProject(this) class='selected-btn'>${project.name}</button>`
                    }
                }
            })
            console.log('project html item set with string')
            projectMsg.innerHTML = projectMsgString
        })
}

function selectProject(project) {
    console.log(`selected project: ${project.innerHTML}`)
    currentProject = project.innerHTML
    updateProjectDiv()
    console.log(`current user: ${currentUser}`)
    loadBugs(currentUser)
}



function loadBugs(currentUser) {
    if (currentUser.email != null) {
        var bugReference = firebase.database().ref().child("bugs");
        console.log(`this is a bugReference: ${bugReference}`);
        //console.log(bugReference.path.pieceNum_);
        var bugHTMLitem = "<h3>No unresolved bugs are logged.</h3>";

            bugReference.on("value", function (snapshot) {
                document.getElementById("show-bugs").innerHTML = "";
                bugHTMLitem = "<h3>Here are the bugs logged in the database.</h3>";

                bugHTMLitem += "<table class='content-table'>";
                bugHTMLitem += "<thead> <tr> <th>Name</th> <th>Description</th> <th>Date Added</th>  <th>Resolved</th> <th>Parent Project</th> <th>Actions</th> </tr> </thead> ";
                bugHTMLitem += "<tbody>"; // <th>ID of owner</th>

                snapshot.forEach(function (childsnapshot) {
                    var bug = childsnapshot.val();
                    // (!bug.resolved && bug.owner === currentUser.uid)
                    if (bug.owner === currentUser.uid && bug.project === currentProject) {
                        console.log(`Current project: ${currentProject}`)
                        bugHTMLitem += "<tr>";
                        bugHTMLitem += `<td class='bug-data-title'>${bug.title.replace("'", '*')}</td>`;
                        bugHTMLitem += `<td class='bug-data-desc'>${bug.description}</td>`;
                        bugHTMLitem += `<td class='bug-data-date'>${bug.dateAdded}</td>`;
                        // bugHTMLitem += "<td>" + bug.owner + "</td>";
                        bugHTMLitem += `<td class='bug-data-resolved'>${bug.resolved}</td>`;
                        bugHTMLitem += `<td class='bug-data-project'>${bug.project}</td>`;

                        // issue : ' causes bug when in bug title
                        bugHTMLitem += "<td> <button onclick=deleteBug(this) type='button' ";
                        bugHTMLitem += "class= ";
                        bugHTMLitem += "'btn delete-bug' ";
                        bugHTMLitem += "id='" + bug.id + "'>Delete</bclass=>";

                        bugHTMLitem += "<button onclick=editBug(this) type='button' class='btn edit-bug' bug-data-id='" + bug.id + "' bug-data-title='"+bug.title+"' bug-data-desc='"+bug.description+"' bug-data-resolved='" + bug.resolved+"' bug-data-date='" + bug.dateAdded + "'>Edit</button>";

                        if (!bug.resolved) {
                             bugHTMLitem += "<button onclick=markResolvedBug(this) type='button' class='btn mark-fixed-bug' bug-data-id='" + bug.id + "'>Mark as Resolved</button>";
                        }
                        
                        bugHTMLitem += "</td>";
                        // bugHTMLitem += "</div>";
                    }
                });
                bugHTMLitem += "</tbody>";
                bugHTMLitem += "</table>";
                document.getElementById("show-bugs").innerHTML = bugHTMLitem;
            })


    }
}


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        var email = user.email;
        currentUser = user;
        
        writeUserData(user);
        
        console.log(currentUser.email + " has logged in.")
        console.log("user's type is :  " + currentUser.type);
        
        var mainMsgString = "<p>This is under development !</p>" ;
        mainMsgString += "<br>" ;
        mainMsgString += "<br>" ;
        mainMsgString += "<p>Signed in as: " + currentUser.email + "</p> <br> <p>Account type: " + currentUser.type + "</p>" ;

        mainMsg.innerHTML = mainMsgString
        
        
        hideLoginForm();
        
        updateProjectDiv();
        loadBugs(currentUser);

    } else {
        // User is signed out
        switchToLoggedOutStyle()
    }
});



function writeUserData(user) {
    if (user.type === undefined) {
        if (rdProgrammer.checked === true) {
            user.type = "Programmer";
        } else {
            user.type = "Manager";
        }
    }
    console.log(user.type);
    // firebase.database().ref('users/' + user.uid).set({
    //     email: user.email,
    //     type: user.type
    // });

}







function switchToLoggedOutStyle() {
    document.getElementById("sign-out-button").style.visibility = "hidden";
    document.getElementById("show-bugs").innerHTML = "";
    document.getElementById("login-form").style.height = "344px";
    document.getElementById("add-bug-form").style.visibility = "hidden";
    document.getElementById("main-message").innerHTML = "" ;
}

function hideLoginForm() {
    for (var i = 0; i < loginDiv.length; i++) {
        loginDiv[i].style.visibility = "hidden";
    }
    document.getElementById("login-form").style.height = 0;
    document.getElementById("sign-out-button").style.visibility = "visible";
    document.getElementById("add-bug-form").style.visibility = "visible";
}

function getCurrentDate() {
    var d = new Date();
    return (d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " + d.getHours() + ":" + ((d.getMinutes()<10?'0':'') + d.getMinutes()))
}


// End of Functions
