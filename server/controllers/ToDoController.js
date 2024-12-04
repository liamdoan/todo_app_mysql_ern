const pool = require('../database/database');

// get all todos
module.exports.getTodos = async (req, res) => {
    try {
        // when execute a query, returned result is an array,
        // 1st element is the actual data,
        // 2nd element is metadata of the query
        const [todos] = await pool.execute('select * from todos');
        
        if (todos.length > 0) {
            console.log("fetch todos successfully!");
        }

        res.status(200).json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            messagefe: 'failed to get data',
            error: error.message
        });
    }
};

// create a new todos
module.exports.saveToDo = async (req, res) => {
    const {task_name, task_description} = req.body;
    const created_at = new Date();
    const updated_at = null;
    const is_completed = false;

    try {
        const [addedTodo] = await pool.execute(`
            insert into todos (task_name, task_description, created_at, updated_at, is_completed)
            value (?, ?, ?, ?, ?)
            `,
            [task_name, task_description, created_at, updated_at, is_completed]
        );

        console.log("task create successully!");

        res.status(201).json({
            message: 'created successfully a todo',
            todo: {
                id: addedTodo.insertId,
                task_name,
                task_description,
                created_at,
                updated_at,
                is_completed
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "failed to create a todo",
            error: error.message
        });
    }
};

// update a todo
module.exports.updateTodo = async (req, res) => {
    const {id} = req.params;
    const {task_name, task_description} = req.body
    const updated_at = new Date();

    try {
        const [updatedTodo] = await pool.execute(`
            update todos set task_name = ?, task_description  = ?, updated_at = ?
            where id = ?
            `,
            [task_name, task_description, updated_at, id]
        );

        if (updatedTodo.affectedRows > 0) {
            console.log("update successfully");
            res.status(200).json({
                message: 'update successfully',
                updatedTodo: {
                    id,
                    task_name,
                    task_description,
                    updated_at
                }
            })
        } else {
            res.status(404).json({
                message: 'todo not found'
            })
        };
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'failed to update',
            error: error.message
        })
    };
};

// delete a todo
module.exports.deleteTodo = async (req, res) => {
    const {id} = req.params;

    try {
        const [deleteTodo] = await pool.execute(`
            delete from todos where id = ?
            `,
            [id]
        );

        if (deleteTodo.affectedRows > 0) {
            console.log("delete successfully");
            res.status(200).json({
                message: 'delete successfully'
            })
        } else {
            res.status(404).json({
                message:'todo not found'
            })
        };
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'failed to delete todo',
            error: error.message
        })
    };
};


// toggle
module.exports.toggleCompleted = async (req, res) => {
    const {id} = req.params;

    try {
        const [todo] = await pool.execute(`
            select * from todos where id = ?    
            `,
            [id]
        );
        
        if (!todo || todo.length === 0) {
            res.status(404).json({ message: 'todo not found' })
            return;
        };

        const toggleIsCompleted = !todo[0].is_completed;
        
        const [updatedTodo] = await pool.execute(`
            update todos set is_completed = ? where id = ?
            `,
            [toggleIsCompleted, id]
        );

        if (updatedTodo.affectedRows > 0) {
            res.status(200).json({
                message: 'toggle successfully',
                updatedTodo: {
                    id,
                    is_completed: toggleIsCompleted
                }
            }); 
            // fetch again this specific todo if expected to log the whole todo model
            // with select * from todos where id = ?
        } else {
            res.status(404).json({
                message: 'todo not found!'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'failed to toggle status.',
            error: error.message
        })
    }
};
