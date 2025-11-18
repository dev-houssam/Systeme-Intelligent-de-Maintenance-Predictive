
#include "RabbitMQClient.hpp"
#include <chrono>
#include <thread>
#include <iostream>

RabbitMQClient::RabbitMQClient(const std::string& host, const std::string& queue) : queueName(queue) {
    try {
        // Création du channel avec la méthode dépréciée Create()
        channel = AmqpClient::Channel::Create(host);
        channel->DeclareQueue(queueName, false, true, false, false);
    } catch (const AmqpClient::AmqpLibraryException& e) {
        std::cerr << "Erreur de connexion RabbitMQ: " << e.what() << std::endl;
        channel = nullptr; // Évite les crashs si on tente d'envoyer des messages
    } catch (const AmqpClient::ChannelException& e) {
        std::cerr << "Erreur de channel RabbitMQ: " << e.what() << std::endl;
        channel = nullptr;
    } catch (const std::exception& e) {
        std::cerr << "Erreur inattendue: " << e.what() << std::endl;
        channel = nullptr;
    }
}

void RabbitMQClient::sendMessage(const std::string& message) {
    if (!channel) {
        std::cerr << "Impossible d'envoyer le message: pas de connexion RabbitMQ." << std::endl;
        return;
    }

    try {
        channel->BasicPublish("", queueName, AmqpClient::BasicMessage::Create(message));
    } catch (const AmqpClient::AmqpLibraryException& e) {
        std::cerr << "Erreur lors de l'envoi du message: " << e.what() << std::endl;
    } catch (const AmqpClient::ChannelException& e) {
        std::cerr << "Erreur de channel lors de l'envoi: " << e.what() << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Erreur inattendue lors de l'envoi: " << e.what() << std::endl;
    }
}

void RabbitMQClient::sendCapteursRealtime(const std::vector<Capteur>& capteurs, int64_t interval_ns) {
    for (const auto& capteur : capteurs) {
        auto start = std::chrono::high_resolution_clock::now();

        // Envoi du message avec gestion d'erreur
        sendMessage(capteur.toJson());
        std::cout << "Envoyé: " << capteur.id << std::endl;

        auto end = std::chrono::high_resolution_clock::now();
        auto elapsed_ns = std::chrono::duration_cast<std::chrono::nanoseconds>(end - start).count();
        if (elapsed_ns < interval_ns) {
            std::this_thread::sleep_for(std::chrono::nanoseconds(interval_ns - elapsed_ns));
        }
    }
}



/*

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


*/