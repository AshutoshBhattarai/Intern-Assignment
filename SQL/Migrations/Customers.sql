-- Active: 1703450346417@@localhost@5432@ashutosh@public
CREATE Table customers(
    customerId int PRIMARY KEY,
    customerName VARCHAR NOT NULL,
    contactName VARCHAR,
    address VARCHAR,
    city VARCHAR(30),
    postalcode VARCHAR(15),
    country VARCHAR(30)
)