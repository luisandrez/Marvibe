const express = require("express");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();



const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

console.log("SUPABASE_URL:", process.env.SUPABASE_URL)
console.log(
    "SERVICE KEY:",
    process.env.SUPABASE_SERVICE_ROLE_KEY ? "CARGADA" : "NO CARGADA"

);
const app = express();

function crearVoucher(reserva) {
    return new Promise((resolve, reject) => {


        const archivo = `voucher_${reserva.id}.pdf`;

        const doc = new PDFDocument({
            size: "A4",
            margin: 0
        });
        const stream = fs.createWriteStream(archivo);

        doc.pipe(stream);
        
        doc.rect(0, 0, 595, 90)
            .fill("#0B6E99");

        doc.rect(0, 45, 595, 45)
            .fill("#00A8D8")

        doc.image("images/logo.png", 30, 12, {
            width: 95
        });

        doc.fillColor("white")
            .fontSize(28)
            .text("MAR VIBE", 145, 18);

        doc.fillColor("white")
            .fontSize(10)
            .font("Helvetica")
            .text("Premium water Sports", 170, 58);

        doc.fillColor("#EAF7FB")
            .fontSize(9)
            .text(
                "Adventure ~ luxury ~ Caribbean Experience",
                145,
                68
            );



        doc.rect(30, 290, 535, 35)
            .fill("#0B6E99");

        doc.fillColor("white")
            .fontSize(12)
            .font("Helvetica-Bold")
            .text("Jet Ski Experience - Cartagena", 145, 291);


        doc.image("images/jetski2.jpg", 30, 90, {
            width: 535,
            height: 190
        });

        doc.fillColor("white")
            .fontSize(22)
            .font("Helvetica-Bold")
            .text("¡Tu aventura comienza aqui!", 45, 125);

        doc.fontSize(11)
            .font("Helvetica")
            .text("Voucher oficial de reserva - Mar Vibe Cartagena", 45, 155);



        doc.fillColor("#0AA84F")
            .fontSize(16)
            .text("RESERVA CONFIRMADA", 45, 185);






        doc.opacity(0.08);
        doc.image("images/logo.png", 120, 330, {
            width: 350

        });

        doc.opacity(1);

        doc.rect(30, 300, 535, 8)
            .fill("#00A8D8");

        doc.image("images/sello-pagado.png", 395, 125, {
            width: 120
        });

        doc.moveTo(30, 305)
            .lineTo(565, 305)
            .stroke("#0B6E99");

        doc.fillColor("#0B6E99")
            .fontSize(16)
            .text("PUNTO DE ENCUENTRO", 40, 372);

        doc.fillColor("#555555")
            .fontSize(11)
            .text(
                "Nos alegra darte la bienvenida a una experiencia inolvidable en el Caribe colombiano.",
                40,
                440,
                {
                    width: 500,
                    align: "left"
                }
            );


        doc.fillColor("black")
            .fontSize(12)
            .text("Playa El Laguito Cartagena de Indias", 40, 400);

        doc.text("Cartagena, Colombia", 40, 417);

        doc.image("images/qr-googlemaps.png", 445, 335, {
            width: 80
        });

        doc.fontSize(8)
            .fillColor("gray")
            .text("Abrir Ubicacion", 455, 419);

        doc.fontSize(7)
            .fillColor("#777777")
            .text("Google Maps", 455, 427);



        doc.roundedRect(430, 325, 110, 120, 8)
            .lineWidth(1)
            .stroke("#cccccc");


        doc.roundedRect(30, 320, 535, 400, 12)
            .lineWidth(2)
            .stroke("#0B6E99");

        doc.fillColor("#0B6E99")
            .fontSize(20)
            .font("Helvetica-Bold")
            .text("VOUCHER DE RESERVA", 50, 330);

        doc.moveTo(40, 360)
            .lineTo(300, 360)
            .lineWidth(1)
            .stroke("#00A8D8")





        doc.fillColor("#555555")
            .fontSize(11)
            .text("Gracias por elegir Mar Vibe.", 40, 450 );

        doc.fillColor("#0B6E99")
            .fontSize(15)
            .text("DATOS DEL CLIENTE", 50, 490),

            doc.fillColor("black")
                .fontSize(12);
        doc.text(`Nombre: ${reserva.nombre}`, 50, 520);
        doc.text(`Correo: ${reserva.email}`, 50, 545);
        doc.text(`Telefono: ${reserva.telefono}`, 50, 570);

        doc.fillColor("#0B6E99")
            .fontSize(15)
            .text("DETALLES DE LA RESERVA", 320, 490);

        doc.fillColor("black")
            .fontSize(12);

        doc.text(`Servicio: ${reserva.servicio}`, 320, 520);
        doc.text(`Fecha: ${reserva.fecha}`, 320, 545);
        doc.text(`Hora: ${reserva.hora}`, 320, 570);
        doc.fillColor("#0AA84F")
            .text("Estado: PAGADO", 320, 595);
        doc.fillColor("black");
        doc.text(
            `Referencia:
        ${reserva.referencia_pago}`,
            320,
            620,
            {
                width: 190
            });

        doc.fillColor("#0B6E99")
            .fontSize(13)
            .text(
                `Voucher N.°: MV-${reserva.id.substring(0, 8).toUpperCase()}`,
                50,
                640
            );

        doc.fillColor("gray")
            .fontSize(10)
            .text(
                `Emitido: ${new Date().toLocaleDateString("es-CO")}`,
                50,
                660
            );

        doc.rect(40, 675, 515, 5)
            .fill("#0B6E99");

        doc.roundedRect(40, 690, 515, 110, 8)
            .fillAndStroke("#F5F9FC", "#0B6E99");

        doc.fillColor("#0B6E99")
            .fontSize(14)
            .text("INFORMACION IMPORTANTE", 55, 705);

        doc.fillColor("black")
            .fontSize(10);


        doc.text("~ Presenta este voucher al llegar.", 60, 728);
        doc.text("~ Llega 15 minutos antes de la hora reservada.", 60, 746);
        doc.text("~ Lleva un documento de identidad.", 60, 764);
        doc.text("~ Usa el chaleco salvavidas durante toda la actividad.", 60, 782);



        doc.fillColor("black")
            .fontSize(10);

        doc.text("https://marvibe.onrender.com", 50, 810);
        doc.text("Instagram: @1marvibe0", 50, 825);
        doc.text("Cartagena- Colombia", 200, 825);
        doc.text("Email: 1vibemar0@gmail.com", 350, 825);
        










        doc.image("images/qr-whatsapp.png", 450, 695, {
            width: 70
        });



        doc.fontSize(9)
            .fillColor("black")
            .text("Escanea para Contactarnos", 400, 765);







        doc.fillColor("#00A8D8")
            .fontSize(11)
            .text("¡Vive el mar. Vive la Velocidad. Vive Mar vibe!.", 40, 460);


        doc.moveTo(30, 815)
            .lineTo(565, 815)
            .stroke("#cccccc");




        doc.rect(0, 835, 595, 7)
            .fill("#0B6E99");

        doc.end();
        stream.on("finish", () => resolve(archivo));
        stream.on("error", reject);
    });
}
async function enviarVoucher(email, archivo) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Tu reserva en Mar vibe esta confirmada",
        text: "Gracias por reservar con Mar Vibe. adjuntamos tu voucher de reserva",
        attachments: [
            {
                filename: "Voucher-Marvibe.pdf",
                path: archivo
            }
        ]
    });
}

async function subirVoucher(archivo) {
    const nombreArchivo = path.basename(archivo);

    const { error } = await supabase.storage
        .from("vouchers")
        .upload(nombreArchivo, fs.readFileSync(archivo), {
            contentType: "application/pdf",
            upsert: true

        });
    if (error) throw error;

    const { data } = supabase.storage
        .from("vouchers")
        .getPublicUrl(nombreArchivo)

    return data.publicUrl

}

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
        const { data: reserva, error } = await supabase
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
            ])
            .select()
            .single();

        if (error) {
            console.log("ERROR SUPBASE:", JSON.stringify(error, null, 2));
            return res.status(500).json({
                ok: false,
                error
            });
        }

        const referencia = `RESERVA_${reserva.id}`;

        console.log("WOMPI_PRIVATE_KEY:", process.env.WOMPI_PRIVATE_KEY);
        const respuesta = await axios.post(
            "https://sandbox.wompi.co/v1/payment_links",
            {
                name: `Reserva Mar Vibe - ${nombre}`,
                description: servicio,
                reference: referencia,
                single_use: true,
                collect_shipping: false,
                currency: "COP",
                amount_in_cents: monto * 100,
                redirect_url: "https://marvibe.onrender.com/pago-exitoso.html"
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`
                }
            }
        );

        const paymentLinkId = respuesta.data.data.id;

        await supabase
            .from("reservas")
            .update({
                payment_link_id: paymentLinkId
            })
            .eq("id", reserva.id);
        res.json({
            ok: true,
            url: `https://checkout.wompi.co/l/${paymentLinkId}`
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

    console.log("=====WEBHOOK=====");
    console.log(req.body);


    const transaction = req.body?.data?.transaction;

    if (!transaction) {
        console.log("No llego informacion de la transsation");
        return res.sendStatus(200);

    }
    console.log("Referancia recibida:", transaction.reference);
    console.log("Payment Link ID:", transaction.payment_link_id);
    console.log("Estado", transaction.status);

    if (transaction.status === "APPROVED") {
        const { data, error } = await supabase
            .from("reservas")
            .update({
                estado: "pagado",
                estado_pago: "pagado",
                transaction_id: transaction.id,
                fecha_pago: new Date().toISOString(),
                referencia_pago: transaction.reference

            })
            .eq("payment_link_id", transaction.payment_link_id)
            .select();
        if (error) {
            console.log("Error actualizando reserva:", error);

        } else {
            console.log("Reserva actualizada correctamente");
            console.log("Resultado", data);

            const reserva = data[0];
            const voucher = await crearVoucher(reserva);
            const urlVoucher = await subirVoucher(voucher);
            await supabase
                .from("reservas")
                .update({
                    voucher_url: urlVoucher
                })
                .eq("id", reserva.id);
            console.log("Voucher:", urlVoucher);

            try {
                await enviarVoucher(reserva.email, voucher);
                console.log("Voucher enviado correctamente");
            } catch (err) {
                console.error("Error enviado el correo:", err);
            }



            console.log("Vouchcer creado:", voucher);
        }
    }

    res.sendStatus(200)
});
app.get("/webhook/wompi", (req, res) => {
    res.send("/Webhook funcionando");
});

app.listen(PORT, () => {
    console.log(`Servidor iniciando en http://localhost:${PORT}`);
});



