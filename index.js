const express = require('express')
const { listen } = require('express/lib/application')
const res = require('express/lib/response')
const app = express()
const mongoose = require('mongoose')
const Person = require('./model/Person')


mongoose
    .connect(
        'mongodb+srv://jackeline-code:598902Ja@cluster0.yxdao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    )
    .then(() => {
        console.log('Conectou o banco!')
        app.listen(3000)
    })
    .catch((err) => console.log(err))

app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(express.json())

//GET
//app.get("/", (req, res) => {
    //res.json({ message: "Oi Express!"});
//});

//POST
app.post('/person', async (req, res) => {
    const{ name, salary, approved } = req.body

    const person = {
        name,
        salary,
        approved,
    }

    try {
        await Person.create(person)

        res.status(201).json({ message: 'Pessoa inserida no sistema com sucesso!'})
    } catch (error) {
        res.status(500).json({erro:error})
    }
})

//GET 
app.get('/person', async (req, res) => {
    try {
        const people = await Person.find()

        res.status(200).json(people)
    } catch (error) {
        res.status(500).json({ erro: error})
    }
})

//GET por id - reutilizando o código de GET
app.get('/person/:id', async (req, res) => {
    const id = req.params.id
    
    try {
        const person = await Person.findOne({_id: id})

        //Validação
        if (!person) {
            res.status(422).json({ message: 'Usuário não encontrado!'})
            return
        }

        res.status(200).json(person)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

//UPDATE
//método PATCH, que realiza atualizações parciais nos dados, sem ter a necessidade de receber todos os campos que possui o registro.
app.patch('/person/:id', async (req, res) => {
    const id = req.params.id

    const { name, salary, approved } = req.body

    const person = {
        name,
        salary,
        approved,
    }

    try {
        const updatedPerson = await Person.updateOne({ _id: id }, person)

        if (updatedPerson.matchedCount === 0) {
            res.status(422).json({ message: 'Usuário não encontrado!'})
            return
        }

        res.status(200).json(person)
    } catch (error) {
        res.status(500).json({ erro: error})
    }
})

//DELETE
app.delete('/person/:id', async (req, res) => {
    const id = req.params.id

    const person = await Person.findOne({ _id:id })

    if (!person) {
        res.status(422).json({ message: 'Usuário não encontrado!'})
        return
    }

    try {
        await Person.deleteOne({ _id: id })

        res.status(200).json({ message: 'Usuário removido com sucesso!'})
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})



