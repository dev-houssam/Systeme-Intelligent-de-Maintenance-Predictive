#ifndef SMS_NOTIFIER_HPP
#define SMS_NOTIFIER_HPP

#include "Notifier.hpp"

class SMSNotifier : public Notifier {
public:
    void sendNotification(const std::string& sensorId,
                          const std::string& message,
                          const std::string& timestamp) override;
};

#endif // SMS_NOTIFIER_HPP
