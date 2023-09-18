const db = require('../helpers/db');


const getUsers = (query) => {
    return new Promise((resolve, reject) => {
        let sql = `select * from users order by `;
        let orderValue = `id asc `;
        if (query.sortBy === 'idDesc') {
            orderValue = `id desc `;
        }

        sql += orderValue;

        if (query.limit !== undefined) {
            sql += `limit ${query.limit}`;
        }

        db.query(sql, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        }
        );
    });
};

const findUsers = (params) => {
    return new Promise((resolve, reject) => {
        const sql = `select email, display_name, phone_number, pict_url, first_name, last_name, gender, address, birth_date, fcm_token from users where id=$1`;
        const values = [params.id];
        db.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        }
        );
    });
};

const createUsers = (email, password, phoneNumber) => {
    return new Promise((resolve, reject) => {
        
        const sql = `INSERT INTO users ("email", "password", phone_number, created_at) values ($1, $2, $3, now()) RETURNING *`;
        const values = [email, password, phoneNumber];
        db.query(sql, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        }
        );
    });
};

const updateUsers = (data, params) => {
    return new Promise((resolve, reject) => {
        const dataAvail = []
        if (data.displayName) {
            dataAvail.push('display_name=')
        }
        if (data.firstName) {
            dataAvail.push('first_name=')
        }
        if (data.lastName) {
            dataAvail.push('last_name=')
        }
        if (data.birthDate) {
            dataAvail.push('birth_date=')
        }
        if (data.gender) {
            dataAvail.push('gender=')
        }
        if (data.address) {
            dataAvail.push('address=')
        }
        if (data.pictUrl) {
            dataAvail.push('pict_url=')
        }
        if(data.fcmToken) {
            dataAvail.push('fcm_token=')
        }
        const dataQuery = dataAvail.map((data, i) => (`${data}$${i + 1}`)).join(`, `)
        const rawValues = [data.displayName, data.firstName, data.lastName, data.birthDate, data.gender, data.address, data.pictUrl, data.fcmToken, params.id];
        const values = rawValues.filter(d => d);
        let sql = `update users set ${dataQuery} where id=$${values.length} RETURNING display_name, first_name, last_name, birth_date, gender, address, pict_url`;
        console.log(sql);
        db.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            resolve(result);
        }
        );
    });
};

const deleteUsers = (params) => {
    return new Promise((resolve, reject) => {
        const sql = `delete from users where id=$1`;
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
    getUsers,
    createUsers,
    updateUsers,
    deleteUsers,
    findUsers
};