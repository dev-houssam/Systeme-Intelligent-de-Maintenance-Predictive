#include "ServeurCapteurs.hpp"
#include <iostream>
#include <exception>

ServeurCapteurs::ServeurCapteurs(const std::string& filePath, const std::string& rabbitHost,
                                 const std::string& queueName, int64_t interval)
    : loader(filePath), mqClient(rabbitHost, queueName), interval_ns(interval) {}

void ServeurCapteurs::run() {
    while (true) {
        try {
            std::vector<Capteur> capteurs = loader.loadData();
            mqClient.sendCapteursRealtime(capteurs, interval_ns);
        } catch (const std::exception& e) {
            std::cerr << "Erreur: " << e.what() << std::endl;
        }
    }
}
