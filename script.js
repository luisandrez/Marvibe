async function reservarYPagar() {
    const reserva = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        monto: 200000
    };

    const respuesta = await fetch("http://localhost:3000/crear-transaccion", {
        method: "POST",
        hearders: {
            "content-type": "application/json"
        },
        body: JSON.stringify(reserva)
    });
    const datos = await respuesta.json();
    console.log(datos);

    alert("conexion con el servidor realizada correctamente.");

}