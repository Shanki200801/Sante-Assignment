const express = require("express");
const mysql = require("mysql2");
const accountSid = "ACd3e2e105506aac38164ea86bb72cd5f1";
const authToken = "9d65e763d45ff563a9da1d079cb1ca76";
const client = require("twilio")(accountSid, authToken);

const app = express();
const port = 8000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "s3kreee7",
  database: "my_db",
  port: 3306,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/send", (req, res) => {
  client.messages
    .create({
      body: "Hello this is my first SMS",
      from: "+14124447354",
      to: "+917259430938",
    })
    .then((message) => console.log(message.sid));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/users", (req, res) => {
  connection.connect();
  connection.query("SELECT 1 + 1 AS solution", (err, rows, fields) => {
    if (err) throw err;

    console.log("The solution is: ", rows[0].solution);
  });
});

app.get("/customeraddressing", (req, res) => {
  connection.connect();
  connection.query(
    "Select template from sms_templates where name = 'General Addressing'",
    (err, rows, fields) => {
      if (err) throw err;

      console.log("The solution is: ", rows);
      res.send(rows[0].template);
    }
  );
});

app.get("/productshowcase", (req, res) => {
  connection.connect();
  connection.query(
    "Select template from sms_templates where name = 'Product Showcase'",
    (err, rows, fields) => {
      if (err) throw err;

      console.log("The solution is: ", rows);
      res.send(rows[0].template);
    }
  );
});

app.get("/salenotification", (req, res) => {
  connection.connect();
  connection.query(
    "Select template from sms_templates where name = 'Sale Notification'",
    (err, rows, fields) => {
      if (err) throw err;

      console.log("The solution is: ", rows);
      res.send(rows[0].template);
    }
  );
});

app.post("/updateTemplate", (req, res) => {
  const { templateName, template } = req.body;
  console.log("update template post req made");
  if (!templateName || !template) {
    return res
      .status(400)
      .send("Missing templateName or template in request body");
  }

  const query = "UPDATE sms_templates SET template = ? WHERE name = ?";
  connection.connect();
  connection.query(query, [template, templateName], (err, result) => {
    if (err) {
      console.error("Error updating template:", err);
      return res.status(500).send("Error updating template");
    }

    res.send("Template updated successfully");
  });
});

app.post("/sendSMS", (req, res) => {
  const { template, data } = req.body;

  // This is a placeholder for the actual SMS sending logic.
  console.log(`Sending SMS with template: ${template} and data: ${data}`);
  data.customer_data.map((customer) => {
    client.messages
      .create({
        body: template,
        from: "+14124447354",
        to: customer.phone_number,
      })
      .then((message) => console.log(message.sid));
  });
  // After the SMS is sent, you can send a response back to the client.
  res.json({ message: "SMS sent successfully" });
});
// to start server
//docker-compose up -d
// to start sql
// docker exec -it sms-app-server-db-1 mysql -p
