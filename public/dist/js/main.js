let lstTask = [];
let User;
let lstDoneTasks = [];

const renderUser = (User) => {
    $('.content').empty();
    $('.content').append(
        `
        <h1>Task Manager</h1>
        <h3>A Web App For Everybody!</h3>
        <h3 class="username">${User.name}</h3>
        `
    );
}

const getDataUser = async(User) => {
    axios.get('/users/me', {
            headers: {
                Authorization: `Bearer ${User.token}`
            }
        })
        .then(function(response) {
            User = response.data;
            renderUser(User);
            console.log(User);
        })
        .catch(function(error) {
            console.log(error);
        })
}

const getDataTasks = (User) => {
    axios.get('/tasks', {
            headers: {
                Authorization: `Bearer ${User.token}`
            }
        })
        .then(function(response) {
            lstTask = response.data;
            renderListTasks(lstTask);
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
}
const getDataDoneTasks = (User) => {
    axios.get('/tasks/completed', { headers: { Authorization: `Bearer ${User.token}` } })
        .then(function(response) {
            lstDoneTasks = response.data;
            renderListDoneTasks(lstDoneTasks);
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        })
}

const deleteDataTasks = (task) => {
    axios.delete(`/tasks/${task._id}`, {
            headers: {
                Authorization: `Bearer ${User.token}`
            }
        })
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
}
const deleteTask = (task, lstTasks) => {
    const index = lstTasks.findIndex((val) => val.description === task.description);
    if (index !== -1)
        lstTasks.splice(index, 1);

}

const addDoneTasks = (task, User) => {
    axios.patch(`/tasks/${task._id}`, { completed: true }, { headers: { Authorization: `Bearer ${User.token}` } })
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
}

const renderListTasks = (lstTask) => {
    $('.doing-tasks').empty();
    lstTask.map((val, index) => {
        $('.doing-tasks').append(
            `
            <div class="tasks flex" data-id="${index}">
            <label class="radCheck"></label> <label for="radCheck">${val.description}</label><span class="delete-task">X</span>
             </div>
       `
        );
    })
}

const renderListDoneTasks = (lstDoneTasks) => {
    $('.done-tasks').empty();
    lstDoneTasks.map((val, index) => {
        $('.done-tasks').append(
            `
            <div class="done-task flex" data-id="${index}">
                 <p><strike>${val.description}</strike></p>
                 <span class="delete-done" data-id="${index}">X</span>
            </div>
            `
        );
    })
}

const checkEmail = (email) => {
    let reget = /^\w+@\w+\.com$/;
    if (reget.test(email))
        return true;
    return false;
}

const checkPass = (string) => {
    let reget = /^(?=.*[a-zA-Z](?=.*[0-9])).{6,}$/;
    if (reget.test(string))
        return true;
    return false;
}

const checkFrmSignIn = (name, mail, password) => {
    let message = [];
    if (name.trim === "") {
        message.push("Name is empty!!");
    }
    if (mail.trim === "") {
        message.push("email is empty!!");
    } else {
        if (!checkEmail(mail))
            message.push("email id not valid!!");
    }
    if (password.trim === "") {
        message.push("password is empty!!");
    } else {
        if (!checkPass(password))
            message.push("password is not valid!");
    }
    if (message.length > 0) {
        let error = message.toString();
        $('.signinLG-error').html(error);
        return false;
    }
    return true;
}

const checkFrmLogin = (mail, password) => {
    let message = [];
    if (mail.trim() === '') {
        message.push('email is empty!!');
    } else {
        if (!checkEmail(mail))
            message.push('email is not valid!!');
    }
    if (password.trim === '') {
        message.push('password id empty!!');
    } else {
        if (!checkPass(password))
            message.push('password is not valid!');
    }

    if (message.length > 0) {
        const error = message.toString();
        $('.login-error').html(error);
        return false;
    }
    return true;
}
$(document).ready(function() {
    // open Sign Up modal
    lstTask = [];
    $('.btnSignUp').on('click', (e) => {
        e.preventDefault();
        $('.modal-signup').addClass('active');
    });
    // render todo
    renderListTasks(lstTask);
    renderListDoneTasks(lstDoneTasks);
    // open Login modal
    $('.btnLogin').click((e) => {
        e.preventDefault();
        $('.modal-login').addClass('active');
    });
    // CANCEL MODAL
    $(document).click(function(e) {
        e.preventDefault();
        const target = e.target;
        //cancel sign up
        if ((target.classList.contains('modal-signup') && target.classList.contains('active')) || target.classList.contains('close-modal')) {
            $('.modal-signup').removeClass('active');
        }
        // cancel login
        if ((target.classList.contains('modal-login') && target.classList.contains('active')) || target.classList.contains('close-modal')) {
            $('.modal-login').removeClass('active');
        }
    });

    $('#btnSign-up').on('click', (e) => {
        e.preventDefault();
        //  creatUser();
        const name = $('.txtName').val();
        const email = $('.txtmail').val();
        const password = $('.txtPassword').val();
        if (!checkFrmSignIn(name, email, password)) {
            alert("Please enter full information!!");
            return false;
        }
        axios.post('/users', {
                name,
                email,
                password
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
        alert('create user succeful!!');
        $('#formSignIn').trigger("reset");
        $('.modal-signup').removeClass('active');
        return true;
    });


    $('.btnLogout').click(async(e) => {
        e.preventDefault();
        await axios.post('/users/logout', {}, {
                headers: {
                    Authorization: `Bearer ${User.token}`
                }
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
        $('.btnLogin').removeClass('diplaynone');
        $('.btnLogout').addClass('diplaynone');
        location.href = '/';
    });
    $('#btnlogin').on('click', (e) => {
        e.preventDefault();
        const email = $('.txtmail-login').val();
        const password = $('.txtPassword-login').val();
        if (!checkFrmLogin(email, password)) {
            alert("Please enter full information!!");
            return false;
        }
        axios.post('/users/login', {
                email,
                password
            })
            .then(function(response) {
                User = response.data;
                getDataUser(User);
                getDataTasks(User);
                getDataDoneTasks(User)
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
        alert('Login success!');
        $('.btnLogout').removeClass('diplaynone');
        $('.btnLogin').addClass('diplaynone');
        return true;
    });

    //============ TASKS ====================
    $('.btnAddTasks').click(function(e) {
        e.preventDefault();
        const description = $('.txtToDo').val();
        const task = {
            description,
            completed: false
        }
        axios.post('/tasks', task, {
                headers: {
                    Authorization: `Bearer ${User.token}`
                }
            })
            .then(function(response) {
                lstTask = response.data;
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
        getDataTasks(User);
    });


    $(document).on('click', '.radCheck', function(e) {
        const id = $(this).parent().data('id');
        const task = lstTask.find((val, index) => index === id);
        lstDoneTasks.push({...task, completed: true });
        addDoneTasks(task, User);
        deleteTask(task, lstTask);
        renderListTasks(lstTask);
        renderListDoneTasks(lstDoneTasks);
    });

    //remove doing tasks
    $(document).on('click', '.delete-task', function() {
        const id = $(this).parent().data('id');
        const task = lstTask.find((val, index) => index === id);
        deleteDataTasks(task);
        deleteTask(task, lstTask);
        renderListTasks(lstTask);
    });

    // remove done task
    $(document).on('click', '.delete-done', function() {
        const id = $(this).parent().data('id');
        const task = lstDoneTasks.find((val, index) => index === id);
        deleteDataTasks(task);
        deleteTask(task, lstDoneTasks);
        renderListDoneTasks(lstDoneTasks);
    });
});