#include "SMSNotifier.hpp"
#include <iostream>

void SMSNotifier::sendNotification(const std::string& sensorId,
                                   const std::string& message,
                                   const std::string& timestamp) {
    std::cout << "[SMS] " << timestamp
              << " | Capteur: " << sensorId
              << " | Message: " << message << std::endl;
    // TODO: implémenter envoi réel via API SMS
}
