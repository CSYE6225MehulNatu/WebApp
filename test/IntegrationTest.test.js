const request = require('supertest');
const {app, server} = require('../Server.js');
const {UserModel, db, sync} = require("../DbConfig.js");




beforeAll(async() => {
  await sync();
  
})


afterAll(async () => {

  const createduserName = "LOL@gmail.com";
  const existingUser = await UserModel.findOne({
            where: { email: createduserName }
  });

  if (existingUser) {
    await UserModel.destroy({
      where: { email: createduserName }});
  }
  
  db.close();

  return new Promise(resolve => {
    server.close(resolve)
  });
 
})



describe("Integration test for User APIs", () => {

  describe("POST /v3/user", () => {
    test("saving a user response should be status 200", async() => {
      //await sync();
      const response = await request(app)
        .post("/v3/user")
        .send({
          first_name: "Jane",
          last_name: "Doe",
          password: "lol",
          username: "LOL@gmail.com"
        });
      
      expect(response.statusCode).toBe(201);
      //expect(201).toBe(201);
    });
  });

  describe("Get v3/user/self", () => {
    test("fetching a user response should be status 200", async() => {
      const token = "TE9MQGdtYWlsLmNvbTpsb2w=";

      const response = await request(app)
      .get("/v3/user/self")
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

  describe("update v3/user/self", () => {
    test("Updating a user, response should be status 204", async() => {
      const token = "TE9MQGdtYWlsLmNvbTpsb2w=";

      const response = await request(app)
      .put("/v3/user/self")
      .set("Authorization", "Basic " + token)
      .send({
        first_name: "Peter",
        last_name: "Parker",
        password: "loll"
      });

      expect(response.statusCode).toBe(204);
    });
  });

  describe("GET updated v3/user/self", () => {
    test("fetching a user response should be status 200", async() => {
      const token = "TE9MQGdtYWlsLmNvbTpsb2xs";
      const response = await request(app)
      .get("/v3/user/self")
      .set("Authorization", "Basic " + token);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe("LOL@gmail.com");
      expect(response.body.firstname).toBe("Peter");
      expect(response.body.lastname).toBe("Parker");
      expect(response.body.account_created).toBeDefined();
      expect(response.body.account_updated).toBeDefined();
      expect(response.body.id).toBeDefined();
    });
  });
});


describe("Integration Util APIs", () => {

  describe("Get /healthz", () => {
    test("Fetching db status, it should be status 200", async() => {
      const response = await request(app)
        .get("/healthz")
        .send();
      
      expect(response.statusCode).toBe(200);
    });
  });
});