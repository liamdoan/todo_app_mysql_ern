const express = require('express');
const { getTodos, saveToDo, updateTodo, deleteTodo, toogleCompleted } = require('../controllers/ToDoController');
const router = express.Router();

router.get('/get', getTodos);
router.post('/save', saveToDo);
router.put('/update/:id', updateTodo);
router.delete('/delete/:id', deleteTodo);
router.put('/toggle/:id', toogleCompleted);

module.exports = router;