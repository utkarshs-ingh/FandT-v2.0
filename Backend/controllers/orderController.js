const asyncHandler = require('express-async-handler')
const Order = require('../model/orderModel')

const addOrderItems = asyncHandler(async(req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body
    if(orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order Items')
    }
    else {
        const order = new Order({
            orderItems, 
            user: req.user._id,
            shippingAddress, 
            paymentMethod, 
            itemsPrice, 
            shippingPrice, 
            taxPrice, 
            totalPrice
        })
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }

})

const getOrderById = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if(order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order Not Found')
    }
})

const updateOrderToPaid = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)
    if(order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_Time: req.body.update_Time,
            email_address: req.body.payer.email_address
        }
        const updatedOrder = await order.save()
        res.json(updatedOrder)
        
    } else {
        res.status(404)
        throw new Error('Order Not Found')
    }
})

const getMyOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
})

module.exports = { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders }