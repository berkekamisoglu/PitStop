package com.example.demo.service;

import com.example.demo.entity.Invoice;
import com.example.demo.repository.InvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @Transactional(readOnly = true)
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Invoice getInvoiceById(int id) {
        return invoiceRepository.findById(id).orElse(null);
    }

    @Transactional
    public Invoice createInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    @Transactional
    public Invoice updateInvoice(int id, Invoice updated) {
        Invoice existing = invoiceRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setUser(updated.getUser());
            existing.setPayment(updated.getPayment());
            existing.setInvoiceDate(updated.getInvoiceDate());
            existing.setTotalAmount(updated.getTotalAmount());
            return invoiceRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean deleteInvoice(int id) {
        if (invoiceRepository.existsById(id)) {
            invoiceRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
