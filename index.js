const { request, response } = require("express")
const express = require("express")
const res = require("express/lib/response")
const uuid = require("uuid")

const port = 3000
const app = express()
app.use(express.json())

const orders = []

const chekOrderid = (request, response, next) => {
    const { id } = request.body


    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const  method = (request, response, next) => {

    console.log(`Method: ${request.method},\n URL: https://localhost:3000${request.url}`)
    

    next()
}

app.use(method)

//new order
app.post("/users", (request, response) => {
    const { order, clientName, price } = request.body

    const orderPlaced = {
        id: uuid.v4(), order, clientName, price,
        status: "Em preparação"
    }

    orders.push(orderPlaced)

    return response.status(201).json(orders)
})
// orders
app.get("/users", (request, response) => {
    return response.json(orders)
})
// update order
app.put("/users/:id", chekOrderid, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId


    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder

    return response.json(updateOrder)

})
// search order
app.get("/users/:id", chekOrderid, (request, response) => {

    const id = request.body.id

    const clientId = orders.filter(order => {
        return order.id == id        
    })
    return response.json(clientId)
})
// order ready
app.patch("/users/:id", chekOrderid, (request, response) => {

    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId


    const updateOrder = { id, order, clientName, price, status: "pronto" }

    orders[index] = updateOrder

    return response.json(updateOrder)
    
    
})
// delete order
app.delete("/users/:id", chekOrderid, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1) 



    return response.json({ message: "Order Deletd" })
})












app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})