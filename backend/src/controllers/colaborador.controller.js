const db = require('../config/database.js'); 
const response = require('../utils/response.js')

exports.createColaborador = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { 
            cpf_colaborador, nome, email, senha, cargo, telefone, data_admissao, status,
            cep, logradouro, numero, complemento, bairro, cidade, uf 
        } = req.body;

        const [resEnd] = await connection.execute(
            'INSERT INTO endereco (cep, logradouro, numero, complemento, bairro, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [cep, logradouro, numero, complemento, bairro, cidade, uf]
        );
        const id_endereco = resEnd.insertId;

        await connection.execute(
            'INSERT INTO colaboradores (cpf_colaborador, nome, email, senha, cargo, telefone, data_admissao, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [cpf_colaborador, nome, email, senha, cargo, telefone, data_admissao, status]
        );

        await connection.execute(
            'INSERT INTO colaboradores_endereco (cpf_colaborador, id_endereco, data_inicio, status) VALUES (?, ?, CURDATE(), ?)',
            [cpf_colaborador, id_endereco, status]
        );

        await connection.commit();
        return response.success(res, 'Colaborador cadastrado com sucesso!', 201);
    } catch (error) {
        await connection.rollback();
        return response.error(res, error.message);
    } finally {
        connection.release();
    }
};

exports.getColaboradores = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT c.*, e.cep, e.logradouro, e.numero, e.bairro, e.cidade, e.uf 
            FROM colaboradores c
            INNER JOIN colaboradores_endereco ce ON c.cpf_colaborador = ce.cpf_colaborador
            INNER JOIN endereco e ON ce.id_endereco = e.id_endereco
            WHERE ce.status = 'ativo'
        `);
        return response.success(res, rows);
    } catch (error) {
        return response.error(res, error.message);
    }
};

exports.deleteColaborador = async (req, res) => {
    try {
        const { cpf } = req.params;
        await db.execute('UPDATE colaboradores SET status = "inativo" WHERE cpf_colaborador = ?', [cpf]);
        await db.execute('UPDATE colaboradores_endereco SET status = "inativo" WHERE cpf_colaborador = ?', [cpf]);
        res.json({ message: 'Colaborador desativado.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateColaborador = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { cpf } = req.params; 
        const { 
            nome, email, cargo, telefone, status,
            cep, logradouro, numero, complemento, bairro, cidade, uf 
        } = req.body;


        await connection.execute(
            'UPDATE colaboradores SET nome=?, email=?, cargo=?, telefone=?, status=? WHERE cpf_colaborador=?',
            [nome, email, cargo, telefone, status, cpf]
        );


        const [rows] = await connection.execute(
            'SELECT id_endereco FROM colaboradores_endereco WHERE cpf_colaborador = ?',
            [cpf]
        );

        if (rows.length > 0) {
            const id_endereco = rows[0].id_endereco;
            await connection.execute(
                'UPDATE endereco SET cep=?, logradouro=?, numero=?, complemento=?, bairro=?, cidade=?, uf=? WHERE id_endereco=?',
                [cep, logradouro, numero, complemento, bairro, cidade, uf, id_endereco]
            );
        }

        await connection.commit();
        res.json({ message: 'Dados atualizados com sucesso!' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};    
