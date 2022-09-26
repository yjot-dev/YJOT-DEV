'use strict'
const util = require('util');
const connection = require('../bd/db');
const query = util.promisify(connection.query).bind(connection);
const bcrypt = require('bcrypt');

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

//Seleccionar usuario admin y cliente por nombre o correo con clave
const seleccionar_usuario = async function(req, res){
    const Usuario = req.body.Usuario;
    const Clave = req.body.Clave;
    const sql1 = `SELECT Clave FROM usuarios WHERE Usuario = ${connection.escape(Usuario)} OR 
                        Email = ${connection.escape(Usuario)}`;
    const reg1 = await query(sql1);
    if(isEmptyObject(reg1)){
        res.status(200).send(reg1);
    }else{
        const data = Object.values(JSON.parse(JSON.stringify(reg1)));
        const clave_hash = data[0].Clave;
        const esLaClave = bcrypt.compareSync(Clave, clave_hash);
        if(esLaClave)
        {
            const sql = `SELECT * FROM usuarios WHERE Usuario = ${connection.escape(Usuario)} OR 
                        Email = ${connection.escape(Usuario)} AND 
                        Clave = ${connection.escape(clave_hash)}`;
            const reg = await query(sql);
            res.status(200).send(reg);
        }
    }
}
//Seleccionar usuario admin y cliente por id
const seleccionar_usuarioPorId = async function(req, res){
    const Id = req.params.Id;
    const sql = `SELECT * FROM usuarios WHERE Id = ${connection.escape(Id)}`;
    const reg = await query(sql);
    res.status(200).send(reg);
}
//Seleccionar usuarios clientes
const seleccionar_listaUsuarios = async function(req, res){
    const Id = req.params.Id;
    const sql = `SELECT * FROM usuarios WHERE Id != ${connection.escape(Id)}`;
    const reg = await query(sql);
    res.status(200).send(reg);
}
//Actualizar usuario admin y cliente
const actualizar_usuario = async function(req, res){
    const Id = req.params.Id;
    const Clave = req.body.Clave;
    const sql1 = `SELECT Clave FROM usuarios WHERE Id = ${connection.escape(Id)}`;
    const reg1 = await query(sql1);
    if(isEmptyObject(reg1)){
        res.status(200).send(reg1);
    }else{
        const data = Object.values(JSON.parse(JSON.stringify(reg1)));
        const clave_hash = data[0].Clave;
        if(Clave != clave_hash)
        {
            req.body.Clave = bcrypt.hashSync(Clave, 10);
        }
        const sql = `UPDATE usuarios SET ${connection.escape(req.body)} WHERE Id = ${connection.escape(Id)}`;
        const reg = await query(sql);
        res.status(200).send(reg);
    }
}
//Insertar usuario cliente (Por usuario admin)
const insertar_usuario = async function(req, res){
    req.body.Clave = bcrypt.hashSync(req.body.Clave, 10);
    const sql = `INSERT INTO usuarios SET ${connection.escape(req.body)}`;
    const reg = await query(sql);
    res.status(200).send(reg);
}
//Eliminar usuario cliente (Por usuario admin)
const eliminar_usuario = async function(req, res){
    const Id = req.params.Id;
    const sql = `DELETE FROM usuarios WHERE Id = ${connection.escape(Id)}`;
    const reg = await query(sql);
    res.status(200).send(reg);
}

module.exports = {
    seleccionar_usuario,
    seleccionar_usuarioPorId,
    seleccionar_listaUsuarios,
    actualizar_usuario,
    insertar_usuario,
    eliminar_usuario
};