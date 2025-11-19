#include "RabbitMQClient.hpp"
#include <chrono>
#include <thread>
#include <iostream>

RabbitMQClient::RabbitMQClient(
    const std::string& host,
    const std::string& queue,
    const std::string& exchange,
    const std::string& routingKey)
    : queueName(queue), exchangeName(exchange), routingKey(routingKey)
{
    try {
        // Connexion
        channel = AmqpClient::Channel::Create(host);

        // 1 Déclaration de l'exchange (durable, direct)
        channel->DeclareExchange(
            exchangeName,
            AmqpClient::Channel::EXCHANGE_TYPE_TOPIC,
            true,   // durable
            false   // autoDelete
        );
        //AmqpClient::Channel::EXCHANGE_TYPE_DIRECT,


        // 2 Déclaration de la queue
        channel->DeclareQueue(queueName, false, true, false, false);

        // 3 Binding queue <-> exchange via routingKey
        channel->BindQueue(queueName, exchangeName, routingKey);

        std::cout << "[RabbitMQ] Exchange '" << exchangeName
                  << "' bindé à Queue '" << queueName
                  << "' via clé '" << routingKey << "'." << std::endl;

    } catch (const std::exception& e) {
        std::cerr << "Erreur RabbitMQ: " << e.what() << std::endl;
        channel = nullptr;
    }
}

void RabbitMQClient::sendMessage(const std::string& message) {
    if (!channel) {
        std::cerr << "Impossible d'envoyer: connexion RabbitMQ indisponible." << std::endl;
        return;
    }

    try {
        // 4️⃣ Publication vers l'exchange avec la bonne routingKey
        channel->BasicPublish(
            exchangeName,
            routingKey,
            AmqpClient::BasicMessage::Create(message)
        );

    } catch (const std::exception& e) {
        std::cerr << "Erreur lors de l'envoi du message: " << e.what() << std::endl;
    }
}

void RabbitMQClient::sendCapteursRealtime(const std::vector<Capteur>& capteurs, int64_t interval_ns) {
    for (const auto& capteur : capteurs) {
        auto start = std::chrono::high_resolution_clock::now();

        sendMessage(capteur.toJson());
        std::cout << "Envoyé: " << capteur.id << std::endl;

        auto end = std::chrono::high_resolution_clock::now();
        auto elapsed_ns = std::chrono::duration_cast<std::chrono::nanoseconds>(end - start).count();

        if (elapsed_ns < interval_ns) {
            std::this_thread::sleep_for(std::chrono::nanoseconds(interval_ns - elapsed_ns));
        }
    }
}
