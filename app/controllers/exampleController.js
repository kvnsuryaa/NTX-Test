const db = require("../models");
const Survey = db.survey;
const User = db.user;
const Attack = db.attack;
const axios = require("axios");
const WebSocket = require("ws");
const redis = require("redis");
const jwt = require("jsonwebtoken");
// const { Op } = require("sequelize");

exports.refactoreMe1 = (req, res) => {
  // function ini sebenarnya adalah hasil survey dri beberapa pertnayaan, yang mana nilai dri jawaban tsb akan di store pada array seperti yang ada di dataset
  try {
    db.sequelize.query(`select * from "surveys"`).then((data) => {
      let index1 = [];
      let index2 = [];
      let index3 = [];
      let index4 = [];
      let index5 = [];
      let index6 = [];
      let index7 = [];
      let index8 = [];
      let index9 = [];
      let index10 = [];

      // change data to data[0] because got one select data
      data[0].map((e) => {
        if (e.values) {
          let values1 = e.values[0];
          let values2 = e.values[1];
          let values3 = e.values[2];
          let values4 = e.values[3];
          let values5 = e.values[4];
          let values6 = e.values[5];
          let values7 = e.values[6];
          let values8 = e.values[7];
          let values9 = e.values[8];
          let values10 = e.values[9];

          index1.push(values1);
          index2.push(values2);
          index3.push(values3);
          index4.push(values4);
          index5.push(values5);
          index6.push(values6);
          index7.push(values7);
          index8.push(values8);
          index9.push(values9);
          index10.push(values10);
        }
      });

      let totalIndex1 = index1.reduce((a, b) => a + b, 0) / 10;
      let totalIndex2 = index2.reduce((a, b) => a + b, 0) / 10;
      let totalIndex3 = index3.reduce((a, b) => a + b, 0) / 10;
      let totalIndex4 = index4.reduce((a, b) => a + b, 0) / 10;
      let totalIndex5 = index5.reduce((a, b) => a + b, 0) / 10;
      let totalIndex6 = index6.reduce((a, b) => a + b, 0) / 10;
      let totalIndex7 = index7.reduce((a, b) => a + b, 0) / 10;
      let totalIndex8 = index8.reduce((a, b) => a + b, 0) / 10;
      let totalIndex9 = index9.reduce((a, b) => a + b, 0) / 10;
      let totalIndex10 = index10.reduce((a, b) => a + b, 0) / 10;

      let totalIndex = [
        totalIndex1,
        totalIndex2,
        totalIndex3,
        totalIndex4,
        totalIndex5,
        totalIndex6,
        totalIndex7,
        totalIndex8,
        totalIndex9,
        totalIndex10,
      ];

      res.status(200).send({
        statusCode: 200,
        success: true,
        data: totalIndex,
      });
    });
  } catch (err) {
    res.status(500).send("error");
  }
};

exports.refactoreMe2 = (req, res) => {
  // function ini untuk menjalakan query sql insert dan mengupdate field "dosurvey" yang ada di table user menjadi true, jika melihat data yang di berikan, salah satu usernnya memiliki dosurvey dengan data false
  Survey.create({
    userId: req.body.userId,
    values: req.body.values, // [] kirim array
  })
    .then((data) => {
      User.update(
        {
          dosurvey: true,
        },
        {
          where: { id: req.body.userId }, // change id to userId
        }
      )
        .then(() => {
          console.log("success");
        })
        .catch((err) => console.log(err));

      res.status(201).send({
        statusCode: 201,
        message: "Survey sent successfully!",
        success: true,
        data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        statusCode: 500,
        message: "Cannot post survey.",
        success: false,
      });
    });
};

const fetchDataFromAPI = async (ws) => {
  try {
    const response = await axios.get(
      "https://livethreatmap.radware.com/api/map/attacks?limit=10"
    );
    const datas = response.data;
    let combined_data = [];
    if (datas) {
      let i = 0;
      while (i < datas.length) {
        const data = datas[i];
        combined_data = [...combined_data, ...data];
        i++;
      }

      console.log("start to bulk insert");
      await Attack.bulkCreate(combined_data);
      console.log("success insert data");
    }
  } catch (error) {
    console.error("Error on fetch data", error);
  }
};

exports.callmeWebSocket = (server) => {
  const wss = new WebSocket.Server({ server: server });

  wss.on("connection", async function connection(ws, connectionRequest) {
    console.log("New Connection to Websocket");
    await fetchDataFromAPI(ws);
    setInterval(async () => {
      await fetchDataFromAPI(ws);
    }, 180000); // 3 minutes

    ws.on("message", async (message) => {});
  });

  return wss;
};

exports.getData = async (req, res) => {
  const { type, value } = req.query;

  if (!value) {
    console.log("Invalid Requests");
    return res.status(400).send({
      success: false,
      statusCode: 400,
      data: {
        label: [],
        total: [],
      },
    });
  }

  let filter_type = `"sourceCountry"`;
  if (type === "destinationCountry") filter_type = `"destinationCountry"`;

  // checking data on redis
  const RedisClient = redis.createClient("redis://localhost:6379");
  await RedisClient.connect();
  const key = `data_${filter_type}_${value}`;
  const data = await RedisClient.get(key);
  if (data) {
    console.log("data found on caching redis for key", key);
    return res.status(200).send(JSON.parse(data));
  }

  const sql = `SELECT "type", COUNT(*) AS total FROM attacks WHERE ${filter_type} = '${value}' GROUP BY "type"`;
  const seq = await db.sequelize.query(sql);
  const datas = seq[0];

  const label = [];
  const total = [];

  let i = 0;
  while (i < datas.length) {
    const data = datas[i];
    label.push(data["type"]);
    total.push(Number(data["total"]) || 0);
    i++;
  }

  const resp_data = {
    success: true,
    statusCode: 200,
    data: {
      label: label,
      total: total,
    },
  };

  // redis key will expired after 3 minutes
  await RedisClient.set(key, JSON.stringify(resp_data), {
    EX: 180,
  });
  return res.status(200).send(resp_data);
};

exports.generateToken = async (req, res) => {
  const { userId: id } = req.query;
  if (!id) {
    console.log("Invalid Requests");
    return res.status(400).send({
      success: false,
      statusCode: 400,
      data: {},
    });
  }

  // checking for user
  const user = await User.findOne({
    where: {
      id: id,
    },
  });

  if (!user) {
    console.log("User not found!");
    return res.status(404).send({
      success: false,
      statusCode: 404,
      data: {},
    });
  }

  const token = jwt.sign(
    {
      id: id,
      workType: user["workType"],
    },
    process.env.SECRET || "SECRET"
  );

  return res.status(200).send({
    success: true,
    statusCode: 200,
    data: {
      token: token,
    },
  });
};
