using {Northwind} from './external/Northwind';

service CatalogService @(path: '/catalog') {
    entity Products as
        projection on Northwind.Products {
            key ID,
                Name,
                Description,
                ReleaseDate,
                DiscontinuedDate,
                Rating,
                Price
        };
}
