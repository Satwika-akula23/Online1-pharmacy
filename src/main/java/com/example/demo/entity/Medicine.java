package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double price;

    private String imageUrl;

    private String category;

    @Column(nullable = false)
    private int quantity;

    // ✅ NEW FIELD (for admin / stock control)
    private int stock;

    // ================= CONSTRUCTORS =================
    public Medicine() {}

    public Medicine(String name, double price, String imageUrl, String category, int quantity) {
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.quantity = quantity;
        this.stock = quantity; // default same as quantity
    }

    // ================= GETTERS =================
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public int getQuantity() {
        return quantity;
    }

    public int getStock() {
        return stock;
    }

    // ================= SETTERS =================
    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }
}