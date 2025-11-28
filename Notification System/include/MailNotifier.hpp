#ifndef MAIL_NOTIFIER_HPP
#define MAIL_NOTIFIER_HPP

#include "Notifier.hpp"

class MailNotifier : public Notifier {
public:
    void sendNotification(const std::string& sensorId,
                          const std::string& message,
                          const std::string& timestamp) override;
};

#endif // MAIL_NOTIFIER_HPP
