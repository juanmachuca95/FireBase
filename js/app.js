// console.log("agregado");
const db = firebase.firestore();

const taskform = document.getElementById('task-form');
const taskscontainer = document.getElementById('tasks-container');


/**Estado del Formulario */
let editStatus = false;
let id = "";
/**Guarda la tarea en la Collection TASKS */
const saveTask = (title, description) =>
    db.collection("tasks").doc().set({
        title,
        description
    });

/**Obtiene las tareas de la Collection TASKS */
const getTasks = () => db.collection("tasks").get();

/**Obtiene una tarea de la Collection TASKS a traves de su id */
const getTask = (id) => db.collection("tasks").doc(id).get();

/**Actualiza cada vez que haya un cambio */
const onGetTask = (callback) => db.collection("tasks").onSnapshot(callback)

/**Delete Task */
const deleteTask = id => db.collection("tasks").doc(id).delete();

/**Edit Task */
const updateTask = (id, updatedTask) => db.collection("tasks").doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async e => {
    onGetTask((querySnapshot) => {
        taskscontainer.innerHTML = '';
        querySnapshot.forEach(doc => {
            // console.log(doc.data());
            const docId = doc.id;//Obtenemos el ID DEL DOCUMENTO
            taskscontainer.innerHTML +=
                "<div class='col-sm-12 col-md-4'>" +
                "<div class='card-body'>" +
                "<h4 class='card-title'>" + doc.data().title + "</h4>" +
                "<p class='lead'>" + doc.data().description + "</p>" +
                "<div>" +
                "<button class='btn btn-primary btn-delete' data-id='" + docId + "'>Delete</button>" +
                "<button class='btn btn-primary btn-edit' data-id='" + docId + "'>Editar</button>" +
                "</div>" +
                "</div>" +
                "</div>";

            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    console.log(e.target.dataset.id);//Muestro por consola como se obtuvo el id
                    await deleteTask(e.target.dataset.id);
                })
            });

            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    //console.log(e.target.dataset.id);//Muestro por consola como se obtuvo el id
                    const doc = await getTask(e.target.dataset.id);
                    //console.log(doc.data());
                    const task = doc.data();
                    console.log(task);
                    editStatus = true;
                    id = doc.id;
                    taskform['task-title'].value = task.title;
                    taskform['task-descripcion'].value = task.description;
                    taskform['btn-task-form'].innerHTML = 'Update';
                })
            });
        });


    })


})


/**Evento del formulario que carga las tareas */
taskform.addEventListener('submit', async e => {
    e.preventDefault();
    const title = taskform['task-title'].value;
    const description = taskform['task-descripcion'].value;
    console.log(title, description);

    if (!editStatus) {
        await saveTask(title, description);
       
    } else {
        await updateTask(id, {
            title:title,
            description:description
        });
    }
    taskform.reset();
    console.log("Enviando");
    id = "";
    taskform['btn-task-form'].innerHTML = "Save";
});