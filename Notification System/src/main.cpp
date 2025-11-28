#include <SimpleAmqpClient/SimpleAmqpClient.h>
#include <iostream>
#include <vector>
#include <memory>
#include <string>
#include "Notifier.hpp"
#include "MailNotifier.hpp"
#include "SMSNotifier.hpp"
#include "PushNotifier.hpp"
#include "MCPNotifier.hpp"
#include <nlohmann/json.hpp> // pour parser JSON

using json = nlohmann::json;

int main() {
    // Création des notifiers
    std::vector<std::unique_ptr<Notifier>> notifiers;
    notifiers.push_back(std::make_unique<MailNotifier>());
    notifiers.push_back(std::make_unique<SMSNotifier>());
    notifiers.push_back(std::make_unique<PushNotifier>());
    notifiers.push_back(std::make_unique<MCPNotifier>());

    // Connexion RabbitMQ
    std::string queue_name = "notification_queue";
    AmqpClient::Channel::ptr_t channel = AmqpClient::Channel::Create("localhost");

    // Assurer que la queue existe
    channel->DeclareQueue(queue_name, true, false, false, false);

    std::cout << "🟢 Notification Consumer prêt, en attente de messages..." << std::endl;

    while (true) {
        AmqpClient::Envelope::ptr_t envelope = channel->BasicConsumeMessage(queue_name);

        std::string body = envelope->Message()->Body();
        try {
            auto data = json::parse(body);

            std::string sensorId = data["sensor_id"].get<std::string>();
            std::string message  = data["message"].get<std::string>();
            std::string timestamp = data["timestamp"].get<std::string>();

            // Envoyer la notification à tous les notifiers
            for (auto& notifier : notifiers) {
                notifier->sendNotification(sensorId, message, timestamp);
            }

        } catch (const json::parse_error& e) {
            std::cerr << "Erreur JSON : " << e.what() << std::endl;
        } catch (const json::type_error& e) {
            std::cerr << "Erreur type JSON : " << e.what() << std::endl;
        }
    }

    return 0;
}
