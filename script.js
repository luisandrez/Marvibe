async function reservarYPagar() {
    const reserva = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        servicio: document.getElementById("servicio").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value,
        notas: document.getElementById("notas").value,
        monto: 200000
    };
    try {

        const respuesta = await fetch("crear-link-pago", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(reserva)
        });
        const datos = await respuesta.json();
        console.log(datos);
        if (datos.ok) {
            window.location.href = datos.url;
        } else {
            alert("conexion con el servidor realizada correctamente.");

        }


    } catch (error) {

        console.log(error);
        alert("No hay conexion con el servidor");

    }

}
