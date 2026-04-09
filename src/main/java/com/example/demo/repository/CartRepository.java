package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.CartItem;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);

    @Transactional
    void deleteByUserId(Long userId);

    // ✅ FIXED QUERY
    @Transactional
    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.medicineId = :medicineId")
    void deleteByMedicineId(@Param("medicineId") Long medicineId);
}