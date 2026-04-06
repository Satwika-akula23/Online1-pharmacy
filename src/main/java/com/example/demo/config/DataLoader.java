package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.demo.entity.Medicine;
import com.example.demo.repository.MedicineRepository;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private MedicineRepository medicineRepository;

    @Override
    public void run(String... args) {

        if (medicineRepository.count() > 0) return;


        medicineRepository.save(new Medicine("Calcium", 120.0, "/images/calcium.png", "Vitamins",20));

        medicineRepository.save(new Medicine("Cough Syrup", 95.0, "/images/cough.png", "Cold",20));
        medicineRepository.save(new Medicine("Nasal Spray", 140.0, "/images/nasal.png", "Cold",20));

        medicineRepository.save(new Medicine("Pain Relief Gel", 150.0, "/images/pain.png", "Pain",20));
        medicineRepository.save(new Medicine("Ibuprofen", 70.0, "/images/ibu.png", "Pain",20));
        medicineRepository.save(new Medicine("Dolo 650", 55.0, "/images/dolo.png", "fever", 20));
        medicineRepository.save(new Medicine("Paracetamol", 40.0, "/images/paracetamol.png", "fever", 20));
        medicineRepository.save(new Medicine("Crocin", 60.0, "/images/crocin.png", "fever", 20));
        medicineRepository.save(new Medicine("Vitamin C", 80.0, "/images/vitamin.png", "vitamins", 20));

        System.out.println("✅ 20 Medicines Loaded Successfully!");
    }
}

