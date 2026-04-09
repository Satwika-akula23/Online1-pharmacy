package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Medicine;
import com.example.demo.repository.MedicineRepository;
import com.example.demo.repository.CartRepository;

import java.util.List;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private CartRepository cartRepository; // ✅ NEW

    // ✅ GET ALL MEDICINES
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // ✅ ADD / SAVE MEDICINE
    public Medicine saveMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    // ✅ GET MEDICINE BY ID
    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    // ✅ DELETE MEDICINE (FIXED)
    @Transactional
    public void deleteMedicine(Long id) {

        // ✅ Step 1: remove from cart_items
        cartRepository.deleteByMedicineId(id);

        // ✅ Step 2: delete medicine
        medicineRepository.deleteById(id);
    }
}