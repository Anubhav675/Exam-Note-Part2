//for part 2 with authentication
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const connectDB = require("../config/db");
const Workout = require("../models/workoutModel");
const User = require("../models/userModel");
const api = supertest(app);

const workoutsArray = [
    {
        title: "Pushup",
        difficulty: "Intermediate",
        description: "It makes you healthy",
        price: 30,
    },
    {
        title: "Pullup",
        difficulty: "Beginner",
        description: "It makes you powerful",
        price: 50,
    },
];

const validUser = {
    username: "admin_jane",
    password: "SecurePassword456!",
    phoneNumber: "+19876543210",
    name: "Jane Smith",
    role: "admin"
};
let token = null;
beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
    await Workout.deleteMany({});

    const signup = await api
        .post('/api/users/signup')
        .send(validUser)
        .expect(201);

    token = signup.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

const workoutInDb = async () => {
    const workouts = await Workout.find({});
    return workouts.map((workout) => workout.toJSON())
}

beforeEach(async () => {
    await Workout.deleteMany({});
    for (const workout of workoutsArray) {
        await api
            .post('/api/workouts')
            .send(workout)
            .set("Authorization", `Bearer ${token}`)
            .expect(201);
    }
});

describe("GET /api/workouts", () => {
    it("should return all the workout", async () => {
        const res = await api
            .get("/api/workouts")
            .expect(200)
        expect(res.body).toHaveLength(workoutsArray.length)
    });
    it("should return workout as JSON with status 200", async () => {
        const res = await api
            .get('/api/workouts')
            .expect(200)
            .expect("Content-Type", /application\/json/);

    })
    it("should include a specific workout in the returned list", async () => {
        const res = await api.get('/api/workouts')
        expect(res.body.map((workout) => workout.title)).toContain("Pushup");
    })
});

describe("POST /api/workouts", () => {
    describe("when the user is authenticated", () => {
        it("should return status 201", async () => {
            const res = await api
                .post("/api/workouts")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "Squat",
                    difficulty: "Advanced",
                    description: "It makes you strong",
                    price: 70,
                })
                .expect(201)
                .expect("Content-Type", /application\/json/);

            const workouts = await Workout.find({});

            expect(workouts).toHaveLength(workoutsArray.length + 1);
        });


    });

    describe("when the user is not authenticated", () => {
        it("should return status 401", async () => {
            await api
                .post("/api/workouts")
                .send(workoutsArray[0])
                .expect(401)
        });
        it("should not increase the number of workouts in the database", async () => {
            const workout = await Workout.findOne({ title: "Pushup" })

            const res = await api
                .post("/api/workouts")
                .send(workoutsArray[0])
                .expect(401)

            const workoutsAtEnd = await workoutInDb();
            expect(workoutsAtEnd).toHaveLength(workoutsArray.length)
        })

    });

});

describe("GET /api/workouts/:workoutId", () => {
    describe("when workoutId is valid", () => {
        it("should return the workout with status 200", async () => {
            const workout = await Workout.findOne({ title: "Pushup" });

            const res = await api
                .get(`/api/workouts/${workout._id}`)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(res.body.title).toBe(workout.title)
        });
    });

    describe("when the workoutID does not exist", () => {
        it("should return status 404", async () => {
            const nonExistingId = new mongoose.Types.ObjectId();

            await api
                .get(`/api/workouts/${nonExistingId}`)
                .expect(404);
        });
    });

    describe("when the workoutID is invalid", () => {
        it("should return status 400", async () => {
            const invalidId = "12345";

            await api
                .get(`/api/workouts/${invalidId}`)
                .expect(400);
        });
    });
});

describe("PUT /api/workouts/:workoutId", () => {
    describe("when the user is authenticated", () => {
        it("should return status 200", async () => {
            const workout = await Workout.findOne({ title: "Pushup" });

            await api
                .put(`/api/workouts/${workout._id}`)
                .send({
                    title: "Updated Title",
                    difficulty: "Advanced",
                    description: "Updated Description",
                    price: 100,
                })
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
        });

        it("should persist the updated workout in the database", async () => {
            const workout = await Workout.findOne({ title: "Pushup" });

            const toBeUpdatedWorkout = {
                title: "Updated Title",
                difficulty: "Advanced",
            };

            await api
                .put(`/api/workouts/${workout._id}`)
                .send(toBeUpdatedWorkout)
                .expect(200)
                .set("Authorization", `Bearer ${token}`)
                .expect("Content-Type", /application\/json/);

            const updatedWorkout = await Workout.findById(workout._id);
            expect(updatedWorkout.title).toBe(toBeUpdatedWorkout.title)
            expect(updatedWorkout.difficulty).toBe(toBeUpdatedWorkout.difficulty)
        });
    });

    describe("when the user is not authenticated", () => {
        it("should return status 401", async () => {
            const workout = await Workout.findOne({ title: "Pushup" })
            await api
                .put(`/api/workouts/${workout._id}`)
                .send({
                    title: "Updated Title",
                    difficulty: "Advanced",
                    description: "Updated Description",
                    price: 100,
                })
                .expect(401);
        });
    });
    describe("when the id is invalid", () => {
        it("should return status 404", async () => {
            const invalidID = new mongoose.Types.ObjectId()
            console.log(invalidID)
            await api
                .put(`/api/workouts/${invalidID}`)
                .send({
                    title: "Updated Title",
                    difficulty: "Advanced",
                    description: "Updated Description",
                    price: 100,
                })
                .set("Authorization", `Bearer ${token}`)
                .expect(404)
        })
    })
});

describe("DELETE /api/workouts/:workoutId", () => {
    describe("when user is authenticated", () => {
        it("should return status 204", async () => {
            const workout = await Workout.findOne({ title: "Pushup" });

            await api
                .delete(`/api/workouts/${workout._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(204);
        });

        it("should remove the workout from the database", async () => {
            const workout = await Workout.findOne({ title: "Pushup" });

            await api
                .delete(`/api/workouts/${workout._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(204);

            const workoutInDb = await Workout.findById(workout._id);

            expect(workoutInDb).toBeNull();
        });
    });


    describe("when the user is not authenticated", () => {
        it("should return status 401", async () => {
            const workout = await Workout.findOne({ title: "Pushup" });

            await api
                .delete(`/api/workouts/${workout._id}`)
                .expect(401);
        })
    })
    describe("when the id is invalid", () => {

        it("should return status 404", async () => {
            const invalidId = new mongoose.Types.ObjectId();

            await api
                .delete(`/api/workouts/${invalidId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404);

        });
    });
});