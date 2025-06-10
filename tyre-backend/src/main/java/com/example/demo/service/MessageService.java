package com.example.demo.service;

import com.example.demo.entity.Message;
import com.example.demo.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Transactional(readOnly = true)
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Message getMessageById(int id) {
        return messageRepository.findById(id).orElse(null);
    }

    @Transactional
    public Message createMessage(Message message) {
        return messageRepository.save(message);
    }

    @Transactional
    public Message updateMessage(int id, Message updated) {
        Message existing = messageRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setContent(updated.getContent());
            existing.setSender(updated.getSender());
            existing.setReceiver(updated.getReceiver());
            return messageRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean deleteMessage(int id) {
        if (messageRepository.existsById(id)) {
            messageRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
