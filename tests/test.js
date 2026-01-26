const cds = require("@sap/cds/lib");
const { POST, expect } = cds.test(__dirname + "../../");

jest.setTimeout(10000);

describe("CookbookService - addCourse", () => {
    beforeEach(async () => {
        await cds.run(DELETE.from("Courses"));
    });

    it("should fail if courseName is missing", async () => {
        try {
            await POST("/cookbook/addCourse", { courseID: "C1" });
            throw new Error("Expected request to fail, but it succeeded");

        } catch (err) {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.error.message).to.equal("courseName cannot be null");
        }
    });

    it("should fail if courseID is missing", async () => {
        try {
            await POST("/cookbook/addCourse", {
                courseName: "Cooking Basics",
            });
            throw new Error("Expected request to fail, but it succeeded");

        } catch (error) {
            expect(error.response.data.error.message).to.equal("courseID cannot be null");
        }
    });

    it("should create a course successfully", async () => {
        const { status, data } = await POST("/cookbook/addCourse", {
            courseID: "C1",
            courseName: "Cooking Basics"
        });

        expect(status).to.equal(200);
        expect(data.value).to.equal("Course created with Name: Cooking Basics and ID: C1");

        const [course] = await cds.run(SELECT.from("Courses").where({ ID: "C1" }));

        expect(course).to.not.be.undefined;
        expect(course.name).to.equal("Cooking Basics");
    });

    it("should fail if course already exists", async () => {
        try {
            await cds.run(INSERT.into("Courses").entries({ ID: "C1", name: "Existing Course" }));
            await POST("/cookbook/addCourse", {
                courseID: "C1",
                courseName: "Cooking Basics",
            });

            throw new Error("Expected request to fail, but it succeeded");
        } catch (error) {
            expect(error.response.data.error.message).to.equal("Course with ID C1 already exists");
        }
    });
});