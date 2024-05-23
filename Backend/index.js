const express = require('express');
const { createTodo, updateTodo } = require('./types');
const { connectDB } = require('./DB/connection');
const { Todo } = require('./Models/Todo.model');
const app = express();


app.use(express.json());

connectDB("mongodb://127.0.0.1:27017/testDb")
  .then(() => {
    console.log("MongoDB Connection established");
  })
  .catch((err) => {
    console.log("MongoDB Connection error: " + err);
  });

app.get('/todos', async (req, res) => {
    const todos = await Todo.find({})
    console.log(todos);

    return res.status(200).json({
        todos
    })
})

app.post('/todo', async (req, res) => {
    const createPayLoad = req.body;

    const parsePayLoad = createTodo.safeParse(createPayLoad)

    if(!parsePayLoad) {
        return res.status(411).json({
            msg: "Invalid inputs"
        })
    }

    await Todo.create({
      title: createPayLoad.title,
      description: createPayLoad.description,
      isCompleted: false,
    });

    return res.status(201).json({
        msg: "Success"
    })
})

app.put('/completed', async(req, res) => {
    const updatePayLoad = req.body;
    const parsePayLoad = updateTodo.safeParse(updatePayLoad);

    if (!parsePayLoad) {
      return res.status(411).json({
        msg: "Invalid inputs",
      });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
        req.body.id,
        {
            $set: {
                isCompleted: true,
            }
        },
        {
            new: true
        }
    )

    return res.status(200).json({
        msg: "Todo Updated",
        updatedTodo: updatedTodo
    })
})

const PORT = 8085;
app.listen(PORT, (req, res) => {
    console.log(`Server listening on port ${PORT}`);
})