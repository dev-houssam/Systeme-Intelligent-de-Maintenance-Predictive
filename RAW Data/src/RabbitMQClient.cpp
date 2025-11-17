/*


#include "RabbitMQClient.hpp"




RabbitMQClient::RabbitMQClient(const std::string& host, const std::string& queue) : queueName(queue) {
    channel = AmqpClient::Channel::Create(host);
    channel->DeclareQueue(queueName, false, true, false, false);
}

void RabbitMQClient::sendMessage(const std::string& message) {
    channel->BasicPublish("", queueName, AmqpClient::BasicMessage::Create(message));
}

void RabbitMQClient::sendCapteursRealtime(const std::vector<Capteur>& capteurs, int64_t interval_ns) {
    for (const auto& capteur : capteurs) {
        auto start = std::chrono::high_resolution_clock::now();
        sendMessage(capteur.toJson());
        auto end = std::chrono::high_resolution_clock::now();
        std::cout << "Envoyé: " << capteur.id << std::endl;

        // Sleep pour respecter l'intervalle approximatif
        auto elapsed_ns = std::chrono::duration_cast<std::chrono::nanoseconds>(end - start).count();
        if (elapsed_ns < interval_ns) {
            std::this_thread::sleep_for(std::chrono::nanoseconds(interval_ns - elapsed_ns));
        }
    }
}
*/




#include "RabbitMQClient.hpp"

RabbitMQClient::RabbitMQClient(const std::string& host, const std::string& queue)
    : queueName(queue) {
    std::cout << "Simulateur RabbitMQ connecté à " << host << " sur la queue " << queueName << std::endl;
}

void RabbitMQClient::sendMessage(const std::string& message) {
    std::cout << "[Simulé] Envoyé: " << message << std::endl;
}

void RabbitMQClient::sendCapteursRealtime(const std::vector<Capteur>& capteurs, int64_t interval_ns) {
    for (const auto& c : capteurs) {
        auto start = std::chrono::high_resolution_clock::now();
        sendMessage(c.toJson());
        auto end = std::chrono::high_resolution_clock::now();

        auto elapsed_ns = std::chrono::duration_cast<std::chrono::nanoseconds>(end - start).count();
        if (elapsed_ns < interval_ns) {
            std::this_thread::sleep_for(std::chrono::nanoseconds(interval_ns - elapsed_ns));
        }
    }
}
