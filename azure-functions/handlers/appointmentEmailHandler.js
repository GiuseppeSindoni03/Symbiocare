const { httpPost } = require("../functions/utils/httpClient");

async function handleAppointmentEmail(message, context) {
  const logicAppUrl = process.env.LOGIC_APP_URL;

  if (!logicAppUrl) {
    throw new Error("LOGIC_APP_URL non configurata");
  }

  context.log("📨 Invio messaggio alla Logic App...");

  await httpPost(logicAppUrl, message);

  context.log("📬 Logic App chiamata con successo");
}

module.exports = { handleAppointmentEmail };
