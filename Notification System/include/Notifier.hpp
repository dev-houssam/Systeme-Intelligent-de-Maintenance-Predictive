#ifndef NOTIFIER_HPP
#define NOTIFIER_HPP

#include <string>

class Notifier {
public:
    virtual ~Notifier() {}

    // Méthode pure virtuelle pour envoyer une notification
    virtual void sendNotification(const std::string& sensorId,
                                  const std::string& message,
                                  const std::string& timestamp) = 0;
};

#endif // NOTIFIER_HPP
