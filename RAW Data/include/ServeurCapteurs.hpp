#ifndef SERVEURCAPTEURS_HPP
#define SERVEURCAPTEURS_HPP

#include <vector>
#include <string>
#include "Capteur.hpp"
#include "CapteurDataLoader.hpp"
#include "RabbitMQClient.hpp"

class ServeurCapteurs {
private:
    CapteurDataLoader loader;
    RabbitMQClient mqClient;
    int64_t interval_ns;

public:
    ServeurCapteurs(const std::string& filePath, const std::string& rabbitHost,
                     const std::string& queueName, int64_t interval);

    void run();
};

#endif // SERVEURCAPTEURS_HPP
