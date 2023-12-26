-- Active: 1703450346417@@localhost@5432@ashutosh@public
CREATE Table orderDetail(
    orderDetailid int PRIMARY KEY,
    orderid int,
    productid int,
    quantity int,
    Foreign Key (orderid) REFERENCES orders(orderid),
    Foreign Key (productid) REFERENCES products(productid)
)