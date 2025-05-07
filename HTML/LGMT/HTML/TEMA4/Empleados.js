// ENUNCIADO
// El enunciado pide crear una pagina html la cual imprima los datos de los empleados 
// del archivo Empleados.json que es el ejercicio anterior

// Vamos a crear una constante que almacene los datos del archivo json,
fetch('Empleados.json')
    .then(response => response.json())
    .then(data => {
        
        console.log(data);
        
        // Ahora vamos a crear una constante que almacene el html que vamos a imprimir
        const paginahtml = document.getElementById('empleados');
    });
