using cookbook from '../db/schema';

service CookbookService @(path: '/cookbook') {
    @(requires: 'recipesAccess')
    entity Recipes     as projection on cookbook.Recipes;

    entity Courses     as projection on cookbook.Courses
        actions {
            function getNameOfCourse()                                       returns cookbook.Courses:name;
            action   updateName(in: many $self, name: cookbook.Courses:name) returns Courses;
        };

    function sum(x: Integer, y: Integer)                                  returns Integer;
    action   addCourse(courseID: UUID, courseName: cookbook.Courses:name) returns String;

    @readonly
    entity Ingredients as projection on cookbook.Ingredients;

    function testQueries()                                                returns array of {};
}

annotate CookbookService.Courses with @(restrict: [
    {
        grant: ['UPDATE'],
        to   : ['onlyUpdate']
    },
    {
        grant: [
            'getNameOfCourse',
            'updateName'
        ],
        to   : ['callMethodsOnCourses']
    }
]);

service DetailService @(path: '/details') {
    entity RecipeDetails as projection on cookbook.RecipeDetails;
}
