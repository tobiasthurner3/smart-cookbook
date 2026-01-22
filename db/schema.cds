namespace cookbook;

entity Courses {
    key ID          : UUID;
        name        : String(100);
        description : LargeString;
}

entity Ingredients {
    key ID                : UUID;
        name              : localized String(100);
        description       : localized LargeString;
        imageType         : String      @Core.IsMediaType;
        image             : LargeBinary @Core.MediaType: imageType;

        recipeIngredients : Composition of many RecipeIngredientLink
                                on recipeIngredients.ingredient = $self;
}

entity Recipes {
    key ID                  : UUID;
        name                : String(100);
        instructions        : LargeString;
        preperationTime     : Integer;
        servings            : Integer default 1;
        source              : String(200) default 'google.com';

        instructionsPreview : String = substring(
            instructions, 0, 100
        );

        fullName            : String = concat(
            name, ' (', source, ')'
        ) stored;

        nameUpper           : String = upper(name) stored;

        course              : Association to one Courses;
        recipeIngredients   : Composition of many RecipeIngredientLink
                                  on recipeIngredients.recipe = $self;
}

entity RecipeIngredientLink {
    key ID         : UUID;
        quantity   : Decimal(10, 2);
        unit       : String(50);
        notes      : String(255);

        ingredient : Association to one Ingredients;
        recipe     : Association to one Recipes;
}

entity RecipeDetails as
    select from Recipes {
        ID,
        course,
        course.name as courseName
    }
