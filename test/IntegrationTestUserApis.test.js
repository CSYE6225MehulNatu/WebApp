const request = require('supertest');
const {app, server} = require('../Server.js');
const {sync} = require("../DbConfig.js");
const {getUserModel} = require("../models/userModel.js");
//const chai = require('chai'); // Add chai for assertion
//const expect = chai.expect;   // Use chai's expect syntax

afterAll(async() => {

  const createduserName = "LOL@gmail.com";
  const userModel = getUserModel();
  const existingUser = userModel.findOne({
            where: { email: createduserName }
  });

  if (existingUser) {
    userModel.destroy({
      where: { email: createduserName }});
  }


  return new Promise(resolve => {
      server.close(resolve)
  })
})


describe("Creating a User and fetching the user", () => {

  describe("POST /v1/user", () => {
    test("saving a user response should be status 200", async() => {
      await sync();
      const response = await request(app)
        .post("/v1/user")
        .send({
          first_name: "Jane",
          last_name: "Doe",
          password: "lol",
          username: "LOL@gmail.com"
        });
      expect(response.statusCode).toBe(201);
    });
  });

  describe("GET v1/user/self", () => {
    test("fetching a user response should be status 200", async() => {
      const token = "TE9MQGdtYWlsLmNvbTpsb2w=";

      const response = await request(app)
      .get("/v1/user/self")
      .set("Authorization", "Basic " + token);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe("LOL@gmail.com");
      expect(response.body.firstname).toBe("Jane");
      expect(response.body.lastname).toBe("Doe");
      expect(response.body.account_created).toBeDefined();
      expect(response.body.account_updated).toBeDefined();
      expect(response.body.id).toBeDefined();

    });
  });
});