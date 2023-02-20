const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
// const sendEmail = require("./sendEmail");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c8jqjnz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const contacts = client.db("markall").collection("contact");
    app.post("/contact", async (req, res) => {
      const user = req.body;
      const contact = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        message: user.message,
      };

      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: `${process.env.USER}`,
          pass: `${process.env.PASS}`,
          //   user: "johnathon77@ethereal.email",
          //   pass: "VRKXAjWEhwqf14njNC",
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `${contact.name} ${contact.email}`, // sender address
        to: "assignment@spreadinindia.in", // list of receivers
        subject: "Hello ✔", // Subject line
        text: `${contact.message}`, // plain text body
        html: `<b>${contact.message}</b>`, // html body
      });

      const result = await contacts.insertOne(contact);
      if (info.messageId && result) {
        res.send({ result, info });
      } else {
        res.send("Error");
      }
    });
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
