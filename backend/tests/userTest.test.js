const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require("../app");
const connectDB = require("../config/db");
const User = require('../models/userModel');
// const { expect } = require('vitest');
// const { describe } = require('vitest');
// const { describe, it } = require('vitest');



const api = supertest(app);

const validUser = {
    username: "admin_jane",
    password: "SecurePassword456!",
    phoneNumber: "+19876543210",
    name: "Jane Smith",
    role: "admin"
};


beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await User.deleteMany({})
})

describe("POST /api/users/signup", () => {
    describe("when the payload is valid", () => {
        it("should return status 201", async () => {
            await api
                .post('/api/users/signup')
                .send(validUser)
                .expect(201)
        })
        it("should return an username and token", async () => {
            const res = await api
                .post('/api/users/signup')
                .send(validUser)
                .expect(201)
            console.log(res.body)

            expect(res.body).toHaveProperty("token")
            expect(res.body.username).toBe(validUser.username)
        })
        it("should persist the user in the database", async () => {
            const res = await api
                .post('/api/users/signup')
                .send(validUser)
                .expect(201)

            const savedUser = await User.findOne({ username: validUser.username })

            expect(savedUser).not.toBeNull();
            expect(savedUser.username).toBe(validUser.username)
        })

    })
    describe("when the payload is invalid", () => {
        it("should return status 400 when required fiedls are missing", async () => {
            const res = await api
                .post('/api/users/signup')
                .send({
                    username: "nana",
                    password: "SecurePassword456!",
                    name: "Jane Smith",
                    role: "admin"
                })
                .expect(400)
            // expect (res.body).toHaveProperty("error","Please add all fields")
        })

    })
    describe('when the username is already registered', () => {
        it("should return status 400", async () => {
            await api
                .post('/api/users/signup')
                .send(validUser)
                .expect(201)

            const res = await api
                .post('/api/users/signup')
                .send(validUser)
                .expect(400)
            expect(res.body).toHaveProperty("error", "User already exists")
        })

    })
})

describe("POST /api/users/login", () => {
    describe("when the credentials are valid", () => {
        it("should return status 200", async () => {
            await api
                .post('/api/users/signup')
                .send(validUser)
                .expect(201)

            await api
                .post('/api/users/login')
                .send({
                    username: validUser.username,
                    password: validUser.password
                })
                .expect(200)

        })
        it("should return and username and token", async () => {
            await api
                .post('/api/users/signup')
                .send(validUser)
                .expect(201)
            const res = await api
                .post('/api/users/login')
                .send({
                    username: validUser.username,
                    password: validUser.password
                })
                .expect(200)

            expect(res.body).toHaveProperty("token")
            expect(res.body.username).toBe(validUser.username)
        })
    })
    describe("when the credentials are invalid", () => {
        it("should return status 400", async () => {
            await api
                .post('/api/users/signup')
                .send(validUser)
                .expect(201)
            await api
                .post('/api/users/login')
                .send({
                    username: validUser.username,
                    password: "wrongPassword1234@@"
                })
                .expect(400)

            await api
                .post('/api/users/login')
                .send({
                    username: "wrongemail@email.com",
                    password: validUser.password
                })
                .expect(400)
        })
    })
})