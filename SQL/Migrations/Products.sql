-- Active: 1703450346417@@localhost@5432@ashutosh@public
CREATE TABLE products(
    productid int PRIMARY KEY,
    Productname varchar(50),
    supplierid int,
    categoryid int,
    unit VARCHAR,
    price FLOAT,
    Foreign Key (supplierid) REFERENCES suppliers(supplierid),
    Foreign Key (categoryid) REFERENCES category(categoryid)
)