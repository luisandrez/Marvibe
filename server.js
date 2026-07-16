const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log("SUPABASE_URL:", process.env.SUPABASE_URL)
console.log(
    "SERVICE KEY:",
    process.env.SUPABASE_SERVICE_ROLE_KEY ? "CARGADA" : "NO CARGADA"

);
const app = express();

app.use(express.json());
app.use(express.static(__dirname))
app.use(cors())
app.get("/api", (req, res) => {
    res.json({
        message: "Bienvenido a la API de Mar Vibe"
    });
});
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const PORT = process.env.PORT || 3000;





app.post("/crear-link-pago", async (req, res) => {
    try {
        const {
            nombre,
            email,
            telefono,
            servicio,
            fecha,
            hora,
            notas,
            monto,
        } = req.body;
        const { error } = await supabase
            .from("reservas")
            .insert([
                {
                    nombre,
                    email,
                    telefono,
                    servicio,
                    fecha,
                    hora,
                    notas,
                    estado: "pendiente"

                }
            ]);
        if (error) {
            console.log("ERROR SUPBASE:", JSON.stringify(error, null, 2));
            return res.status(500).json({
                ok: false,
                error
            });
        }
        console.log("WOMPI_PRIVATE_KEY:", process.env.WOMPI_PRIVATE_KEY);
        const respuesta = await axios.post(
            "https://sandbox.wompi.co/v1/payment_links",
            {
                name: `Reserva Mar Vibe - ${nombre}`,
                description: servicio,
                single_use: true,
                collect_shipping: false,
                currency: "COP",
                amount_in_cents: monto * 100,
                redirect_url: "https://marvibe.onrender.com/pago-exitoso.html"
            }
            , {
                headers: {
                    Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`
                }
            }
        );
        const id = respuesta.data.data.id;
        res.json({
            ok: true,
            url: `https://checkout.wompi.co/l/${id}`
        });
    } catch (error) {
        console.log(error.response?.data || error.message);

        res.status(500).json({
            ok: false,
            mensaje: "Error al crear el link de pago"
        });
    }
});
app.post("/webhook/wompi", async (req, res) => {
    try {
        console.log("webhook recibido:");
        console.log(JSON.stringify(req.body, null, 2));

        res.status(200).send("OK");

    } catch (error) {
        console.error(error);
        res.status(500).send("ERROR");
    }

});
app.get("/webhook/wompi", (req, res) => {
    res.send("/Webhook funcionando");
});

app.listen(PORT, () => {
    console.log(`Servidor iniciando en http://localhost:${PORT}`);
});

