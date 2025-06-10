🚗 PitStop - Tire Roadside Assistance App
PitStop is a modern web application that provides quick and reliable roadside assistance for vehicle owners experiencing tire issues. Users can easily schedule appointments for tire changes, repairs, and other emergency situations to receive professional help.

🛠️ Technology Stack
Backend
Spring Boot - Main framework
Spring Security - Security and authentication
Spring Data JPA - Data access layer
PostgreSQL - Database
Maven - Dependency management
Frontend
React - User interface
React Router - Page navigation
Axios - HTTP requests
Bootstrap/Material-UI - UI components
Redux - State management
🏗️ Project Architecture
Design Patterns
1. Strategy Pattern 🎯
Used for tire filtering strategies. Provides dynamic filtering based on different tire types and criteria.

java
public interface TireFilterStrategy {
    List<Tire> filter(List<Tire> tires, FilterCriteria criteria);
}

public class BrandFilterStrategy implements TireFilterStrategy { ... }
public class SizeFilterStrategy implements TireFilterStrategy { ... }
public class PriceFilterStrategy implements TireFilterStrategy { ... }
2. Factory Pattern 🏭
Used for creating payment processors. Supports different payment methods (credit card, bank transfer, cash).

java
public interface PaymentProcessor {
    PaymentResult process(PaymentRequest request);
}

public class PaymentProcessorFactory {
    public static PaymentProcessor createProcessor(PaymentType type) { ... }
}
3. Observer Pattern 👁️
Used for appointment notifications. Automatically sends notifications to relevant parties when appointment status changes.

java
public interface AppointmentObserver {
    void update(AppointmentEvent event);
}

public class NotificationService implements AppointmentObserver { ... }
public class EmailService implements AppointmentObserver { ... }
4. Builder Pattern 🔨
Used for creating complex appointment objects.

java
public class AppointmentBuilder {
    public AppointmentBuilder setCustomer(Customer customer) { ... }
    public AppointmentBuilder setService(Service service) { ... }
    public AppointmentBuilder setDateTime(LocalDateTime dateTime) { ... }
    public Appointment build() { ... }
}
5. Adapter Pattern 🔌
Used for integration with different map services (Google Maps, OpenStreetMap).

java
public interface MapService {
    Location getLocation(String address);
    double calculateDistance(Location from, Location to);
}

public class GoogleMapsAdapter implements MapService { ... }
public class OpenStreetMapAdapter implements MapService { ... }
6. MVC Pattern 📋
Used for overall application architecture.

Model: Entity classes and data models
View: React components
Controller: Spring REST Controllers
7. Repository Pattern 💾
Used for data access layer abstraction.

java
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomerId(Long customerId);
    List<Appointment> findByStatus(AppointmentStatus status);
    List<Appointment> findByDateBetween(LocalDateTime start, LocalDateTime end);
}
8. Service Layer Pattern 🔧
Used for business logic separation.

java
@Service
public class AppointmentService {
    public Appointment createAppointment(AppointmentRequest request) { ... }
    public void cancelAppointment(Long appointmentId) { ... }
    public List<Appointment> getCustomerAppointments(Long customerId) { ... }
}
9. DTO Pattern 📦
Used for data transfer between layers.

java
public class AppointmentDTO {
    private Long id;
    private String customerName;
    private String serviceType;
    private LocalDateTime scheduledTime;
    // getters and setters
}
🚀 Features
User Registration & Authentication - Secure user management
Service Booking - Easy appointment scheduling
Real-time Tracking - Live location tracking of service providers
Payment Integration - Multiple payment options
Notification System - SMS and email notifications
Service History - Complete service records
Rating & Reviews - Customer feedback system
Emergency Services - 24/7 roadside assistance
📱 Screenshots
Add screenshots of your application here

🛠️ Installation & Setup
Prerequisites
Java 17+
Node.js 16+
PostgreSQL 12+
Maven 3.6+
Backend Setup
Clone the repository
bash
git clone https://github.com/yourusername/pitstop.git
cd pitstop/backend
Configure database in application.properties
properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pitstop
spring.datasource.username=your_username
spring.datasource.password=your_password
Run the application
bash
mvn clean install
mvn spring-boot:run
Frontend Setup
Navigate to frontend directory
bash
cd pitstop/frontend
Install dependencies
bash
npm install
Start the development server
bash
npm start
📊 Database Schema
Main Entities
Users - Customer and service provider information
Appointments - Service booking details
Services - Available service types
Payments - Payment transaction records
Notifications - System notifications
Reviews - Customer feedback
🔧 API Endpoints
Authentication
POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/logout - User logout
Appointments
GET /api/appointments - Get user appointments
POST /api/appointments - Create new appointment
PUT /api/appointments/{id} - Update appointment
DELETE /api/appointments/{id} - Cancel appointment
Services
GET /api/services - Get available services
GET /api/services/{id} - Get service details
Payments
POST /api/payments/process - Process payment
GET /api/payments/history - Payment history
🧪 Testing
Backend Tests
bash
mvn test
Frontend Tests
bash
npm test
🚀 Deployment
Docker Deployment
bash
docker-compose up -d
Production Build
bash
# Backend
mvn clean package

# Frontend
npm run build
🤝 Contributing
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

📞 Support
For support and questions:

Email: berkekamisoglu1@gmail.com
Issues: GitHub Issues
🙏 Acknowledgments
Spring Boot community for excellent documentation
React team for the amazing frontend framework
All contributors who helped make this project better
PitStop - Your reliable partner on the road! 🛣️

