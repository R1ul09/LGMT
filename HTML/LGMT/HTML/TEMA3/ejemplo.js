l// Guardamos el objeto document de jQuery en una variable para poder usarlo más fácilmente
let obj_documento = $(document);

// Cuando el documento esté listo, se ejecutará la función inicio
obj_documento.ready(inicio);

// Creamos la funcion inicio
function inicio() {
    // Guardamos el botón con el id botonizq en una variable
    let obj_izq = $("#botonizq");
    // Cuando se haga clic en botonizq, se ejecuta la función fn_click_izq
    // Que sera creada mas adelante
    obj_izq.click(fn_click_izq);

    // Guardamos el botón con el id botonder en una variable
    let obj_der = $("#botonder");
    // Cuando se haga clic en botonder, se ejecuta la función fn_click_der
    // Que sera creada tambien mas adelante
    obj_der.click(fn_click_der);
}

// Inicializamos la función fn_click_izq
function fn_click_izq() {
    // Guardamos el elemento con el id texto en una variable
    let obj_div = $("#texto");
    // Ocultamos el elemento con un efecto de desvanecimiento, en este caso el fadeOut
    obj_div.fadeOut();
}

function fn_click_der() {
    // Guardamos el elemento con id texto en una variable
    let obj_div = $("#texto");
    // Mostramos el elemento con un efecto de aparición, en este caso el fadeIn
    obj_div.fadeIn();
}
