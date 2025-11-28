#include "PushNotifier.hpp"
#include <iostream>

void PushNotifier::sendNotification(const std::string& sensorId,
                                    const std::string& message,
                                    const std::string& timestamp) {
    std::cout << "[PUSH] " << timestamp
              << " | Capteur: " << sensorId
              << " | Message: " << message << std::endl;
    // TODO: implémenter notification desktop réelle
}
