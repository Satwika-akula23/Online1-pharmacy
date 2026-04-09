package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Medicine;
import com.example.demo.service.MedicineService;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    // ✅ GET ALL
    @GetMapping("/medicines")
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    // ✅ ADD MEDICINE
    @PostMapping("/medicines")
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return medicineService.saveMedicine(medicine);
    }

    // ✅ UPDATE MEDICINE (THIS WAS MISSING ❗)
    @PutMapping("/medicines/{id}")
    public Medicine updateMedicine(@PathVariable Long id, @RequestBody Medicine updatedMed) {

        Medicine med = medicineService.getMedicineById(id);

        med.setName(updatedMed.getName());
        med.setPrice(updatedMed.getPrice());
        med.setImageUrl(updatedMed.getImageUrl());
        med.setCategory(updatedMed.getCategory());
        med.setQuantity(updatedMed.getQuantity());
        med.setStock(updatedMed.getStock());

        return medicineService.saveMedicine(med);
    }

    // ✅ DELETE MEDICINE
    @DeleteMapping("/medicines/{id}")
    public String deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return "Medicine deleted successfully";
    }
}