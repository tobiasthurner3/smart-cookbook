const cds = require("@sap/cds");

class CookbookService extends cds.ApplicationService {
    init() {
        this.on("addCourse", this.addCourse);
        this.on("sum", (req) => req.data.x + req.data.y);

        this.on("getNameOfCourse", this.getNameOfCourse);
        this.on("updateName", this.updateName);

        this.on("testQueries", this.testQueries);

        return super.init();
    }

    testQueries = async function (req) {
        const uuid = "a1dd9db6-6e91-4271-9c62-e90581433c1e";

        await DELETE.from("Courses").where({ ID: uuid });

        const result = await SELECT.from("Courses");
        return result;
    };

    addCourse = async function (req) {
        const { courseID, courseName } = req.data;

        if (!courseName) {
            req.error(400, "courseName cannot be null");
            return;
        }

        if (!courseID) {
            req.error(400, "courseID cannot be null");
            return;
        }

        const existing = await SELECT.one("Courses").where({ ID: courseID });

        if (existing) {
            req.error(400, `Course with ID ${courseID} already exists`);
            return;
        }

        const result = await INSERT.into("Courses").entries({
            ID: courseID,
            name: courseName,
        });

        return `Course created with Name: ${courseName} and ID: ${courseID}`;
    };

    getNameOfCourse = async function (req) {
        const param = req.params[0];
        const result = await SELECT.one("Courses").where({ ID: param.ID });

        if (!result) {
            req.error(400, "Could not find record with ID: " + (param.ID));
            return;
        }

        return result.name;
    };

    updateName = async function (req) {
        const { name } = req.data;
        const param = req.params[0];

        await UPDATE("Courses").where({ ID: param.ID }).set({ name: name });

        const updatedCourse = await SELECT.one("Courses").where({ ID: param.ID });
        return updatedCourse;
    };
}

module.exports = { CookbookService };