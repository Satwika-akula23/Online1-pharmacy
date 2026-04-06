package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.CartItem;
import com.example.demo.entity.Medicine;
import com.example.demo.entity.Order;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.MedicineRepository;
import com.example.demo.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // ✅ FIXED NAME (use same everywhere)
    @Autowired
    private CartRepository cartItemRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    // ✅ PLACE ORDER WITH STOCK UPDATE + ITEM DETAILS
    public Order placeOrder(Long userId) {

        // ✅ FIXED HERE
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double totalAmount = 0;
        StringBuilder itemsData = new StringBuilder();

        for (CartItem item : cartItems) {

            Medicine med = medicineRepository.findById(item.getMedicineId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));

            // ✅ CHECK STOCK
            // if (med.getQuantity() < item.getQuantity()) {
            //    throw new RuntimeException("Not enough stock for " + med.getName());
            // }

            // ✅ REDUCE STOCK
            med.setQuantity(med.getQuantity() - item.getQuantity());
            medicineRepository.save(med);

            // ✅ CALCULATE TOTAL
            totalAmount += med.getPrice() * item.getQuantity();

            // ✅ STORE ITEM DETAILS
            itemsData.append(med.getName())
                    .append(" x ")
                    .append(item.getQuantity())
                    .append(", ");
        }

        // ✅ CREATE ORDER
        Order order = new Order();
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setCreatedAt(LocalDateTime.now());

        // ✅ SAVE ITEMS STRING
        order.setItems(itemsData.toString());

        // ✅ SAVE ORDER
        Order savedOrder = orderRepository.save(order);

        // ✅ CLEAR CART
        cartItemRepository.deleteByUserId(userId);

        return savedOrder;
    }

    // ✅ GET ORDERS
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}