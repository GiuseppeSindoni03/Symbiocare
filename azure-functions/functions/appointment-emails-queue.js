const { app } = require("@azure/functions");
const {
  handleAppointmentEmail,
} = require("../handlers/appointmentEmailHandler");

app.serviceBusQueue("appointment-emails-queue", {
  connection: "AZURE_SERVICE_BUS_CONNECTION_STRING",
  queueName: "appointment-emails-queue",
  handler: async (message, context) => {
    context.log("📩 Messaggio ricevuto dalla queue:", message);

    try {
      await handleAppointmentEmail(message, context);
      context.log("✅ Elaborazione completata");
    } catch (err) {
      context.log("❌ Errore durante l’elaborazione:", err);
      throw err; // permette retry automatici del Service Bus
    }
  },
});
