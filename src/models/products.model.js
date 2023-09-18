const db = require('../helpers/db');

const getProduct = (data) => {
    return new Promise((resolve, reject) => {
        let sql = `select p.id, 
                    p.name, 
                    p.description, 
                    p.price,
                    p.pict_url, 
                    c.category 
                    from products p 
                    join category c on p.category_id = c.id `;

        if (data.category !== undefined && data.name !== undefined) {
            sql += `where lower(c.category) like lower('${data.category}') 
            and lower(p.name) like lower('%${data.name}%') `
        } else if (data.category !== undefined) {
            sql += `where lower(c.category) like lower('${data.category}') `;
        } else if (data.name !== undefined) {
            sql += `where lower(p.name) like lower('%${data.name}%') `;
        } else {
            sql += ''
        }

        switch (data.sortBy) {
            case "nameDesc":
                sql += `order by name desc `;
                break;
            case "cheapest":
                sql += `order by price asc `;
                break;
            case "priciest":
                sql += `order by price desc `;
                break;
            case "idAsc":
                sql += `order by p.id asc `;
                break;
            case "idDesc":
                sql += `order by p.id desc `;
                break;
            default: sql += `order by p.name asc `;
        }

        const limit = Number(data.limit || 10);
        const page = Number(data.page || 1);
        const offset = (page - 1) * limit

        sql += `limit $1 offset $2`
        console.log(sql);
        db.query(sql, [limit, offset], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};

const getSingleProduct = (params) => {
    return new Promise((resolve, reject) => {
        const sql = `select p.name, p.description, p.price, p.pict_url, c.category 
        from products p join category c on p.category_id = c.id where p.id=$1`;
        db.query(sql, [params.id], (err, result) => {
            if (err) {
                return reject(err);

            }
            resolve(result);
        }
        );
    });
};

const getMetaProducts = (data) => {
    return new Promise((resolve, reject) => {
        let sql = `select count(*) as total_products from products p join category c on p.category_id = c.id `;
        let endpoint = `/products?`;
        if (data.category !== undefined) {
            endpoint += `category=${data.category}&`;
            sql += `where lower(category) like lower('${data.category}')`;
        }
        if (data.name !== undefined) {
            endpoint += `name=${data.name}&`;
            sql += `where lower(name) like lower('%${data.name}%')`;
        }
        db.query(sql, (err, result) => {
            if (err) {
                return reject(err)
            }
            console.log(result.rows[0]);
            const totalProduct = Number(result.rows[0].total_products);
            const page = Number(data.page || 1);
            const dataLimit = Number(data.limit || 10);
            const totalPage = Math.ceil(totalProduct / dataLimit);

            switch (data.sortBy) {
                case "nameDesc":
                    endpoint += `sortBy=nameDesc&`;
                    break;
                case "cheapest":
                    endpoint += `sortBy=cheapest&`;
                    break;
                case "priciest":
                    endpoint += `sortBy=priciest&`;
                    break;
                case "idAsc":
                    endpoint += `sortBy=idAsc&`;
                    break;
                case "idDesc":
                    endpoint += `sortBy=idDesc&`;
                    break;
            }
            let prev = `${endpoint}limit=${dataLimit}&page=${page - 1}`;
            let next = `${endpoint}limit=${dataLimit}&page=${page + 1}`;
            if (page === 1) {
                prev = null
            }
            if (page === totalPage) {
                next = null
            }
            const meta = {
                totalProduct,
                totalPage,
                prev,
                next
            }
            resolve(meta)
        })
    })
}

const addProduct = (data) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO products (name, price, description, category_id) values ($1, $2, $3, $4) RETURNING *";
        const values = [data.productName, data.price, data.description, data.categoryId];
        db.query(sql, values, (err, result) => {
            if (err) {
                return reject(err);

            }
            resolve(result);
        }
        );
    });
};

const editProduct = (data, params) => {
    return new Promise((resolve, reject) => {
        const dataAvail = []
        if (data.productName != null) {
            dataAvail.push('name=')
        }
        if (data.price != null) {
            dataAvail.push('price=')
        }
        if (data.description != null) {
            dataAvail.push('description=')
        }
        if (data.categoryId != null) {
            dataAvail.push('category_id=')
        }
        if (data.pictUrl != null) {
            dataAvail.push('pict_url=')
        }
        const dataQuery = dataAvail.map((data, i) => (`${data}$${i + 1}`)).join(`, `)
        const rawValues = [data.productName, data.price, data.description, data.categoryId, data.pictUrl, params.id];
        const values = rawValues.filter(d => d);
        let sql = `update products set ${dataQuery} where id=$${values.length} RETURNING *`;
        db.query(sql, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

const deleteProduct = (params) => {
    return new Promise((resolve, reject) => {
        const sql = `delete from products where id=$1`;
        db.query(sql, [params.id], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        }
        );
    });
};

module.exports = {
    getProduct,
    addProduct,
    editProduct,
    deleteProduct,
    getSingleProduct,
    getMetaProducts
};