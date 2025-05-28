// Funcion que se va a ejecutar si le doy al boton
function calcularNota() {
    // Cogemos cuantas preguntas ha acertado del id de aciertos que emos creaado previamente
    let aciertos = parseInt(document.getElementById("aciertos").value);
    let totalPreguntas = 27;

    // Si no ha puesto nada o se pasa de rango, pues le damos un aviso
    if (isNaN(aciertos) || aciertos < 0 || aciertos > totalPreguntas) {
        document.getElementById("resultado").textContent = "Illo, pon un numero entre 0 y 27 colegaaaaaa";
        return;
    }

    // Cogemos cuanto resta por fallo según la opción elegida
    let penalizacion = parseFloat(document.getElementById("penalizacion").value);

    // Calculamos cuántas preguntas ha fallado
    let fallos = totalPreguntas - aciertos;

    // Calculamos la nota
    let nota = (aciertos * 10 / totalPreguntas) - (fallos * penalizacion);

    // Si la nota es menor de 0, la dejamos en 0
    if (nota < 0) {
        nota = 0;
    }

    // Mostramos el resultado con 2 decimales (por si acaso =)
    document.getElementById("resultado").textContent = "Tu nota final es: " + nota.toFixed(2) + " sobre 10.";
}