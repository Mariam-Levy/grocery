// Seleccionar elementos del DOM y asignarlos a variables
const alert =  document.querySelector('.alert');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const grocery = document.getElementById('grocery');
const clearBtn = document.querySelector('.clear-btn');
const submitBtn = document.querySelector('.submit-btn');
const form = document.querySelector('.grocery-form');


// Variables para la edición de elementos
let editElement;
let editFlag = false;
let editID = '';


// -------------------- Event listeners -----------------------
// Agregar evento de submit al formulario:
form.addEventListener('submit', addItem)
// Agregar evento de clic al botón de limpiar
clearBtn.addEventListener('click', clearItems);
// Agregar evento al cargar la página para mostrar los elementos guardados
window.addEventListener('DOMContentLoaded', setupItems);




// ------------ FUNCIONES ------------

// Función para agregar un elemento a la lista
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();  //se utiliza para generar un identificador único para cada elemento que se agrega a la lista de compras

    // si 'value' no es un string vacio y 'editFlag' es falso(no estamos editando)
    if(value !== '' && !editFlag) {
        /* console.log('agregando un item a la lista'); */

        // Crear un nuevo elemento <article> para representar un ítem de la lista de compras
        const element = document.createElement('article');
        // Crear un nuevo atributo llamado 'data-id' para almacenar el identificador único del elemento
        let attr = document.createAttribute('data-id');
        // Asignar el valor del atributo 'data-id' con el identificador único generado previamente
        attr.value = id;
        // Añadir el atributo 'data-id' al elemento <article>
        element.setAttributeNode(attr);
        // Añadir la clase CSS 'grocery-item' al elemento <article> para aplicar estilos específicos
        element.classList.add('grocery-item');

        // Asignar HTML al elemento creado
        element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
                <button class="edit-btn"> 
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Agregar event listeners a los botones de editar y borrar
        const deleteBtn = element.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', deleteItem);
        const editBtn = element.querySelector('.edit-btn');
        editBtn.addEventListener('click', editItem);


        //agregar el elemento al DOM
        list.appendChild(element);
        //mostrar una alerta de exito
        displayAlert('Item added to the list', 'success');
        //mostrar el contenedor de la lista
        container.classList.add('show-container');

        // Guardar en el almacenamiento local
        addToLocalStorage(id, value);
        // Restaurar a los valores por defecto
        setBackToDefault();

    // si 'value' no es un string vacio y 'editFlag' es true(modo editar)
    } else if (value !== '' && editFlag) {
        // Modificar el contenido del elemento en edición
        editElement.innerHTML = value;
        // Mostrar una alerta de éxito
        displayAlert('value changed', 'success');
        // Modificar el almacenamiento local
        editLocalStorage()
        // Restaurar a los valores por defecto
        setBackToDefault();

    // cuando no se introduce un valor:
    } else {
        displayAlert('please enter value', 'danger')
    }
}


// Función para mostrar una alerta
function displayAlert(text, action) {
    // Asignar el texto de la alerta al contenido del elemento 'alert'
    alert.textContent = text;

    // Añadir una clase dinámica al elemento 'alert' para aplicar estilos específicos
    alert.classList.add(`alert-${action}`);

    // Configurar un temporizador para eliminar la alerta después de 1000 milisegundos (1 segundo)
    setTimeout(function() {
        //limpia el texto de la alerta despues de 1seg
        alert.textContent = '';

        //elimina la clase dinamica que se agrego previamente para restablecer los estilo
        alert.classList.remove(`alert-${action}`)
    }, 1000);
}


// Función para limpiar la lista
function clearItems() {
    // Obtener todos los elementos con la clase 'grocery-item'
    const items = document.querySelectorAll('.grocery-item');

    // Verificar si hay elementos en la lista
    if(items.length > 0) {
        // Iterar sobre cada elemento encontrado
        items.forEach(item => {
            // Eliminar cada elemento de la lista
            list.removeChild(item);
        });
    }
    // Ocultar el contenedor de la lista
    container.classList.remove('show-container');
    // Mostrar una alerta de lista vacía
    displayAlert('empty list', 'danger');
    // Restaurar a los valores por defecto
    setBackToDefault();
    // Eliminar el almacenamiento local
    localStorage.removeItem('list');
}

// Función para eliminar un elemento de la lista de compras
function deleteItem(e) {
    console.log('item eliminado');
    // Obtener el elemento padre del botón de eliminar que fue clicado
    const element = e.currentTarget.parentElement.parentElement;
    // Obtener el identificador único (data-id) del elemento
    const id = element.dataset.id;
    // Eliminar el elemento del DOM
    list.removeChild(element);

    // Verificar si la lista está vacía después de la eliminación
    if(list.children.length === 0) {
        // Ocultar el contenedor de la lista si está vacío
        container.classList.remove('show-container')
    }

    // Mostrar una alerta indicando que el elemento fue eliminado con éxito
    displayAlert('item removed', 'danger');
    // Restablecer a los valores por defecto
    setBackToDefault();
    // Eliminar el elemento del almacenamiento local
    removeFromLocalStorage(id);
}


//
function editItem(e) {
    // Obtener el elemento <article> padre del botón de editar que fue clicado
    const element = e.currentTarget.parentElement.parentElement;
    // Establecer el elemento de edición como el contenido anterior del elemento <p>
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // Establecer el valor del campo de entrada 'grocery' con el contenido actual del elemento
    grocery.value = editElement.innerHTML;
    // Establecer la bandera de edición a 'true'
    editFlag = true;
    // Obtener el identificador único (data-id) del elemento
    editID = element.dataset.id;
    // Cambiar el texto del botón de envío a 'edit'
    submitBtn.textContent = 'edit';
}


// Función para restablecer los valores por defecto después de agregar/editar un elemento
function setBackToDefault() {
    // Limpiar el valor del campo de entrada 'grocery'
    grocery.value = '';

    //Restablecer la bandera de edicion a 'false'
    editFlag = false;

    //Limpiar el identificador de edicion
    editID = '';

    //Restablecer el texto del boton de submit
    submitBtn.textContent = 'submit'
}

// Función para agregar elementos al almacenamiento local
function addToLocalStorage(id, value) {
    const grocery = {id, value};
    //Obtener los elementos almacenados en el almacenamiento local
    let items = getLocalStorage();
    // Agregar el nuevo elemento al final de la lista
    items.push(grocery);
    // Actualizar el almacenamiento local con la nueva lista de elementos
    localStorage.setItem('list', JSON.stringify(items));
};


// Función para eliminar un elemento del almacenamiento local
function removeFromLocalStorage(id) {
    // Obtener los elementos almacenados en el almacenamiento local
    let items = getLocalStorage();

    // Filtrar los elementos, excluyendo el que tiene el identificador proporcionado
    items = items.filter(function(item) {
        if(item.id !== id) {
            return item;
        }
    })
    // Actualizar el almacenamiento local con la nueva lista de elementos
    localStorage.setItem('list', JSON.stringify(items));
}


// Función para editar un elemento en el almacenamiento local
function editLocalStorage(id, value) {
    // Obtener los elementos almacenados en el almacenamiento local
    let items = getLocalStorage();
    // Mapear la lista de elementos y actualizar el valor del elemento con el identificador proporcionado
    items = items.map(function(item) {
        if(item.id === id) {
            item.value = value;
        }
        return item;
    })
    // Actualizar el almacenamiento local con la lista de elementos modificada
    localStorage.setItem('list', JSON.stringify(items));
}


// Función para obtener los elementos del almacenamiento local
function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}


// Función para configurar y mostrar los elementos al cargar la página
function setupItems() {
    // Obtener la lista de elementos almacenados en el almacenamiento local
    let items = getLocalStorage();

    // Verificar si hay elementos en la lista
    if(items.length > 0) {
        // Iterar sobre cada elemento almacenado
        items.forEach(function(item) {
            // Crear y mostrar un nuevo elemento en la interfaz de usuario
            createListItem(item.id, item.value);
        });
        // Mostrar el contenedor de la lista si hay elementos
        container.classList.add('show-container');
    }
}

// Función para crear y mostrar un elemento de la lista en la interfaz de usuario
function createListItem(id, value) {
    //Crear un nuevo elemento <article> para representar un item de la lista
    const element = document.createElement('article');

    //crear un nuevo atributo <data-id> para almacenar el idetificador unico del elemento
    let attr = document.createAttribute('data-id');
    attr.value = id;

    //Añadir el atributo 'data-id al elemento <article>
    element.setAttributeNode(attr);

    // Añadir la clase CSS 'grocery-item' al elemento <article> para aplicar estilos
    element.classList.add('grocery-item');

    // Asignar el HTML al elemento creado con el valor del ítem
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
                <button class="edit-btn"> 
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
    `;

    //Obtener las referencias a los botones de editar y eliminar en el nuevo elemento
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');

    // Añadir event listeners a los botones para manejar las acciones correspondientes
    deleteBtn.addEventListener('click', deleteBtn);
    editBtn.addEventListener('click',editBtn);

    //Añadir el nuevo elemento a la lista en la interfaz de usuario
    list.appendChild(element);
}
// ----------------------------------------------




