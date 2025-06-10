package com.example.demo.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "paymentmethods")
public class PaymentMethod {
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String methodName;

    @ManyToOne
    @JoinColumn(name = "tire_shop_id")
    private TireShop tireShop;

    // Getter and Setter methods

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public TireShop getTireShop() {
        return tireShop;
    }

    public void setTireShop(TireShop tireShop) {
        this.tireShop = tireShop;
    }

}

