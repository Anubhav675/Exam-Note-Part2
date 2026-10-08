//for part 1 without authentication
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const connectDB = require("../config/db");
const Workout = require("../models/workoutModel");

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

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Workout.deleteMany({});
  await Workout.insertMany(workoutsArray);
});

describe("GET /api/workouts", () => {
  it("should return all the workout as JSON with status 200", async () => {
    const res = await api
      .get("/api/workouts")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const content = res.body.map((workout) => workout.title);

    expect(content).toContain("Pushup");
  });
});

describe("POST /api/workouts", () => {
  describe("when payload is valid", () => {
    it("should create a new workout and return it as JSON with status 201", async () => {
      const res = await api
        .post("/api/workouts")
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

  describe("when payload is invalid", () => {
    it("should return status 400 when title is missing", async () => {
      const initialLength = await Workout.find({});

      await api
        .post("/api/workouts")
        .send({
          difficulty: "Advanced",
          description: "It makes you strong",
          price: 70,
        })
        .expect(400);

      const workoutsAfterRequest = await Workout.find({});

      expect(workoutsAfterRequest).toHaveLength(initialLength.length);
    });
  });
});

describe("GET /api/workouts/:workoutId", () => {
  describe("when workoutId is valid", () => {
    it("should return the workout with status 200", async () => {
      const workout = await Workout.findOne();

      await api
        .get(`/api/workouts/${workout._id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
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
  describe("when workoutId is valid", () => {
    it("should update the workout and return it with status 200", async () => {
      const workout = await Workout.findOne();

      await api
        .put(`/api/workouts/${workout._id}`)
        .send({
          title: "Updated Title",
          difficulty: "Advanced",
          description: "Updated Description",
          price: 100,
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    it("should persist the updated workout in the database", async () => {
      const workout = await Workout.findOne();

      const updatedWorkout = {
        title: "Updated Title",
        difficulty: "Advanced",
        description: "Updated Description",
        price: 100,
      };

      await api
        .put(`/api/workouts/${workout._id}`)
        .send(updatedWorkout)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const workoutInDb = await Workout.findById(workout._id);

      expect(workoutInDb.title).toBe(updatedWorkout.title);
      expect(workoutInDb.difficulty).toBe(updatedWorkout.difficulty);
      expect(workoutInDb.description).toBe(updatedWorkout.description);
      expect(workoutInDb.price).toBe(updatedWorkout.price);
    });
  });

  describe("when the workoutID is invalid", () => {
    it("should return status 404", async () => {
      const nonExistingId = new mongoose.Types.ObjectId();

      await api
        .put(`/api/workouts/${nonExistingId}`)
        .send({
          title: "Updated Title",
          difficulty: "Advanced",
          description: "Updated Description",
          price: 100,
        })
        .expect(404);
    });

    it("should return status 400 for invalid workoutId", async () => {
      const invalidId = "12345";

      await api
        .put(`/api/workouts/${invalidId}`)
        .send({
          title: "Updated Title",
          difficulty: "Advanced",
          description: "Updated Description",
          price: 100,
        })
        .expect(400);
    });
  });
});

describe("DELETE /api/workouts/:workoutId", () => {
  describe("when workoutId is valid", () => {
    it("should delete the workout and return status 204", async () => {
      const workout = await Workout.findOne();

      await api
        .delete(`/api/workouts/${workout._id}`)
        .expect(204);
    });

    it("should remove the workout from the database", async () => {
      const workout = await Workout.findOne();

      await api
        .delete(`/api/workouts/${workout._id}`)
        .expect(204);

      const workoutInDb = await Workout.findById(workout._id);

      expect(workoutInDb).toBeNull();
    });
  });

  describe("when the workoutID does not exist", () => {
    it("should return status 404", async () => {
      const nonExistingId = new mongoose.Types.ObjectId();

      await api
        .delete(`/api/workouts/${nonExistingId}`)
        .expect(404);
    });

    it("should return status 400 for invalid workoutId", async () => {
      const invalidId = "12345";

      await api
        .delete(`/api/workouts/${invalidId}`)
        .expect(400);
    });
  });
});