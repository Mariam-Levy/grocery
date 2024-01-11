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


// Event listeners
form.addEventListener('submit', addItem)





// ------------ Funciones ------------

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

        //...................................


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
        console.log('editando el item de la lista');

    // cuando no se introduce un valor:
    } else {
        console.log('No hay ningun valor');
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
    console.log('added to local storage');
};


// ----------------------------------------------




