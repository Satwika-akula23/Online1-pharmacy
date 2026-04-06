package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Order;
import com.example.demo.service.CartService;
import com.example.demo.service.OrderService;
import com.example.demo.service.PdfService;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private PdfService pdfService;

    // ✅ PLACE ORDER
    @PostMapping("/order/place/{userId}")
    public Map<String, Object> placeOrder(@PathVariable Long userId) {

        // ✅ Just validate cart
        List<Map<String, Object>> items = cartService.getCartByUser(userId);

        if (items == null || items.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // ✅ Call service (handles everything)
        Order order = orderService.placeOrder(userId);

        return Map.of(
                "message", "Order placed successfully",
                "orderId", order.getId(),
                "totalAmount", order.getTotalAmount()
        );
    }

    // ✅ DOWNLOAD INVOICE
    @GetMapping("/invoice/{userId}")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long userId) {

        List<Map<String, Object>> items = cartService.getCartByUser(userId);

        double total = 0;

        for (Map<String, Object> item : items) {
            total += (double) item.get("price") * (int) item.get("quantity");
        }

        byte[] pdf = pdfService.generateInvoice(userId, items, total);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=invoice.pdf")
                .body(pdf);
    }

    // ✅ GET ORDERS
    @GetMapping("/orders/{userId}")
    public List<Order> getOrders(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }
}