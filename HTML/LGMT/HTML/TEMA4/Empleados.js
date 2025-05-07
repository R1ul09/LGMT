// ENUNCIADO
// El enunciado pide crear una página HTML que imprima los datos de los empleados 
// del archivo Empleados.json
// Vamos a cargar los datos del JSON con fetch
fetch('Empleados.json')
    // Ponemos .then para que cuando la petición se ha hecho
    // se ejecute el código que está dentro de .then
    // y ponemos responde que pase a .json
    .then(response => response.json())
    // Y ahora ponemos que los datos sean lo que pongamos dentro
    .then(data => {

        // Recorremos los empleados y generamos las filas de la tabla
        for (let i = 0; i < data.datos.length; i++) {

            // Creamos una constante con el objeto del empleado
            const empleado = data.datos[i];
            
            // Creamos una variable html en la cual almacenaremos los datos de cada empleado
            let html = `
                <tr>
                    <td>${empleado.Employee}</td>
                    <td>${empleado.Name}</td>
                    <td>${empleado.Age}</td>
                    <td>${empleado.Position}</td>
                    <td>${empleado.Department}</td>
                    <td>${empleado.Salary}</td>
                    <td>${empleado.Location}</td>
                </tr>
            `;
            
            // Añadimos la fila al tbody con id "empleados"
            // Que tbody es un elemento HTML que contiene una tabla es decir
            // t de tabla y body de cuerpo
            document.getElementById('empleados').innerHTML += html;
        }
    });