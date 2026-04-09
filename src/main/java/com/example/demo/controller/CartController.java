package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.CartRequest;
import com.example.demo.entity.CartItem;
import com.example.demo.service.CartService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class CartController {

    @Autowired
    private CartService cartService;

    // ✅ ADD TO CART
    @PostMapping("/cart/add")
    public CartItem addToCart(@RequestBody CartRequest req) {

        CartItem item = new CartItem();
        item.setUserId(req.getUserId());
        item.setMedicineId(req.getMedicineId());
        item.setQuantity(req.getQuantity());

        return cartService.addToCart(item);
    }

    // ✅ GET CART BY USER
    @GetMapping("/cart/{userId}")
    public List<Map<String, Object>> getCart(@PathVariable Long userId) {
        return cartService.getCartByUser(userId);
    }
}