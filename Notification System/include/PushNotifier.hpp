#ifndef PUSH_NOTIFIER_HPP
#define PUSH_NOTIFIER_HPP

#include "Notifier.hpp"

class PushNotifier : public Notifier {
public:
    void sendNotification(const std::string& sensorId,
                          const std::string& message,
                          const std::string& timestamp) override;
};

#endif // PUSH_NOTIFIER_HPP
