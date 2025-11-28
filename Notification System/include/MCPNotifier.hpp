#ifndef MCP_NOTIFIER_HPP
#define MCP_NOTIFIER_HPP

#include "Notifier.hpp"

class MCPNotifier : public Notifier {
public:
    void sendNotification(const std::string& sensorId,
                          const std::string& message,
                          const std::string& timestamp) override;
};

#endif // MCP_NOTIFIER_HPP
