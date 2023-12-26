-- Active: 1703450346417@@localhost@5432@ashutosh@public
CREATE Table orders(
    orderId int PRIMARY KEY,
    customerId int,
    employeeId int,
    orderDate date NOT NULL,
    shipperId int,
    FOREIGN KEY (customerId) REFERENCES customers(customerid),
    FOREIGN KEY (employeeId) REFERENCES employees(employeeid),
    FOREIGN KEY (shipperId) REFERENCES shippers(shipperid)
)