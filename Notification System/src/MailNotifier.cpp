#include "MailNotifier.hpp"
#include <iostream>

void MailNotifier::sendNotification(const std::string& sensorId,
                                    const std::string& message,
                                    const std::string& timestamp) {
    std::cout << "[MAIL] " << timestamp
              << " | Capteur: " << sensorId
              << " | Message: " << message << std::endl;
    // TODO: implémenter envoi réel via SMTP
}
