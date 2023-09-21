//declaro una constante con la direccion de los productos
const apiUrl = '../api/productos.json';

//funcion asincrona para recaudar la informacion de la api
obtenerProductos = async () => {
    //creo una promesa
    return new Promise(async (resolve, reject) => {
        //un try en lugar de then por buenas practicas
        try {
            // utilizo fetch para traer los datos y lo guardo en response
            const response = await fetch(apiUrl);
            //traigo los datos en json
            const productos = await response.json();
            //resuelvo con lo que me trae
            resolve(productos);
        }
        // genero el catch por si falla algo en el try
         catch (error) {
            // muestra el error
            console.error(error);
            //rechaza
            reject(error);
            //Aquí muestro un mensaje de error al usuario con sweetalert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema con los productos'
            });
        }
    });
}

// Función para mostrar los productos disponibles
function mostrarProductos(productos) {
    // Traigo al DOM el div donde se colocarán los productos
    const contenedorTarjetas = document.getElementById('contenedorTarjetas');
    // Genero un ciclo para iterar en el array de productos de mi JSON
    productos.forEach((producto, index) => {
        // Por cada producto, creo un div
        const card = document.createElement('div');
        // Le doy la clase 'card' ya que sirve con Bootstrap
        card.className = 'card';
        // Agrego el contenido: imagen, nombre, precio y el botón para agregar al carrito
        card.innerHTML = `
        <img class="imagen" src=${producto.img} alt=${producto.name}>
        <p class="titulo">${producto.name}</p>
        <p class="precio">Precio: $${producto.precio}</p>
        <button class="btn btn-primary agregarCarrito" data-index="${index}">Agregar al Carrito</button>
        `;
        // Agrego cada nuevo div al div ya creado 'contenedorTarjetas'
        contenedorTarjetas.appendChild(card);
    });


 // Agrego una variable que encierre todos los botones "Agregar al Carrito"
 const btnAgregarCarrito = document.querySelectorAll(".agregarCarrito");

 // Agrego un foreach para todos los btnagregarcarrito
btnAgregarCarrito.forEach(boton => {
    //agrego un evento a cada boton del tipo click
  boton.addEventListener('click', () => {
   // crea una constante que agarra el atributo (osea, el producto) correspondiente a cada boton dependiendo su index
  const productoIndex = boton.getAttribute('data-index');
  // llamo a la funcion anterior y pongo como parametro el producto del boton clickeado
  agregarAlCarrito(productoIndex);
        });
    });
}

// creo el array donde estaran los productos
let productos = [];

//llamo a la funcion
obtenerProductos()
//
    .then(productosObtenidos => {
        productos = productosObtenidos;
        mostrarProductos(productos);
    })
    .catch(error => {
        console.error(error);
    });

    
// Creo el array donde estará mi carrito
let carrito = [];

// Función para agregar un producto al carrito
function agregarAlCarrito(index) {
    // Verifico si el índice es válido
    if (productos[index]) {
        // Si es válido, la función sigue y añade el producto
        const productoSeleccionado = productos[index];
        carrito.push(productoSeleccionado);
        // Actualizo el carrito en el localStorage, pasando los elementos a JSON
        localStorage.setItem('carrito', JSON.stringify(carrito));

        //agrego un toastify que se activa cuando tocan el boton de agregar carrito
        Toastify({
            text: `${productoSeleccionado.name} se ha agregado al carrito`,
            duration: 2000,
            newWindow: true,
            close: true,
            gravity: 'top',
            position: 'right',
            style: {
                background: '#28a745',
                color: 'white',
            },
            stopOnFocus: true,
        }).showToast();
    }
}


// aqui me fijo si ya tenia un carrito guardado, en cuyo caso lo traigo
localStorage.getItem('carrito') && (carrito = JSON.parse(localStorage.getItem('carrito')));

//traigo al dom los elementos necesarios para el carrito
const listaCarrito = document.getElementById('listaCarrito');
const totalCarrito = document.getElementById('totalCarrito');

// Función para mostrar los productos en el carrito 
function mostrarCarrito(){
    //limpio el modal
    listaCarrito.innerHTML = ''; 
    //ciclo foreach por cada elemento del carrito
    carrito.forEach(producto => {
        //por cada producto se crea un li
        const itemCarrito = document.createElement('li');
        //se asigna clase de bootstrap
        itemCarrito.className = 'list-group-item';
        //dentro de los li este será el texto, siendo el nombre y precio el respectivo de cada producto dentro de carrito
        itemCarrito.textContent = `${producto.name} - $${producto.precio}`;
        //agregamos los li como hijos de la lista ul
        listaCarrito.appendChild(itemCarrito);
    });

    // hacemos que total empiece con valor 0
    let total = 0;
    //realizo un foreach para que el total valla sumandose al precio de cada uno de los objetos
    carrito.forEach(producto => {
        total += producto.precio;
    });
    //agrego el texto el total a pagar
    totalCarrito.textContent = total;
}

// traigo al dom los elementos para el modal
const abrirModal = document.getElementById('abrirModal');
const modalCarrito = document.getElementById('modalCarrito');
const cerrarModal = document.getElementById('cerrarModal');
const finalizarCompra = document.getElementById("finalizarCompra")

//agrego el evento para cuando se precione el boton sea habra el modal
abrirModal.addEventListener('click', () => {
    //si carrito tiene contenido, utilizara la funcion anteriormente explicada agregarACarrito, y aparte mostrará
    if (carrito.length > 0) {
        mostrarCarrito(); 
        modalCarrito.style.display = 'block'; 
    }
});

//aqui agrego un evento apra volver a ocultar el modal
cerrarModal.addEventListener('click', () => {
    modalCarrito.style.display = 'none';
});

//al finalizar compra, el localstorage hace clear y se completa el ciclo
finalizarCompra.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});


