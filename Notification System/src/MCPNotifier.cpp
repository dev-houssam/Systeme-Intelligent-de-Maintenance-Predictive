#include "MCPNotifier.hpp"
#include <iostream>

void MCPNotifier::sendNotification(const std::string& sensorId,
                                   const std::string& message,
                                   const std::string& timestamp) {
    std::cout << "[MCP/LLM] " << timestamp
              << " | Capteur: " << sensorId
              << " | Message: " << message << std::endl;
    // TODO: implémenter appel à LLM ou MCP pour traitement
}
