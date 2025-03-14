const { Pool } = require("pg");
const InVariantError = require("../../exceptions/InVariantError");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const NotFoundError = require("../../exceptions/NotFoundError");

class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    async addUser({ username, password, fullname }) {
        await this.verifyNewUsername(username);

        const id = `user-${nanoid(16)}`;
        const hashedPassword = bcrypt.hash(password, 10);

        const query = {
            text: "INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id",
            values: [id, username, hashedPassword, fullname],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InVariantError("User gagal ditambahkan");
        }

        return result.rows[0].id;
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);

        if (result.rows.length) {
            throw new InVariantError('Gagal menambahkan user. Username sudah digunakan');
        }
    }

    async getUserById(userId) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [userId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('User tidak ditemukan');
        }

        return result.rows[0];
    }

    async verifyUserCredentials(username, password) {
        const query = {
            text: 'SELECT id, password, FROM users WHERE username = $1',
            values: [username]
        };

        const result = await this._pool.query(query);

        if (!result.row.length) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }

        const { id, password: hashedPassword } = result.rows[0];
 
        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }

        return id;
    }
}

module.exports = UsersService;