'use strict'
const { Router } = require('express');
const api = Router();
var usuarioController = require('../controllers/usuarioController');


api.post('/seleccionar_usuario/', usuarioController.seleccionar_usuario);
api.get('/seleccionar_usuarioPorId/:Id', usuarioController.seleccionar_usuarioPorId);
api.get('/seleccionar_listaUsuarios/:Id', usuarioController.seleccionar_listaUsuarios);
api.put('/actualizar_usuario/:Id', usuarioController.actualizar_usuario);
api.post('/insertar_usuario/', usuarioController.insertar_usuario);
api.delete('/eliminar_usuario/:Id', usuarioController.eliminar_usuario);

module.exports = api;