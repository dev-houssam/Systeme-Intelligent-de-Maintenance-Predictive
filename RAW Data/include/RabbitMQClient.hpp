


#ifndef RABBITMQCLIENT_HPP
#define RABBITMQCLIENT_HPP

#include <string>
#include <vector>
#include <chrono>
#include <thread>
#include <iostream>
#include <SimpleAmqpClient/SimpleAmqpClient.h>
#include "Capteur.hpp"

class RabbitMQClient {
public:
    RabbitMQClient(const std::string& host,
                   const std::string& queue,
                   const std::string& exchange = "raw_data_exchange",
                   const std::string& routingKey = "capteurs_data");

    void sendMessage(const std::string& message);
    void sendCapteursRealtime(const std::vector<Capteur>& capteurs, int64_t interval_ns);

private:
    std::string queueName;
    std::string exchangeName;
    std::string routingKey;

    AmqpClient::Channel::ptr_t channel;
};


#endif // RABBITMQCLIENT_HPP





/*
#ifndef RABBITMQCLIENT_HPP
#define RABBITMQCLIENT_HPP

#include <string>
#include <vector>
#include <chrono>
#include <thread>
#include <iostream>
#include "Capteur.hpp"

class RabbitMQClient {
private:
    std::string queueName; // nom de la "queue" simulée
public:
    RabbitMQClient(const std::string& host, const std::string& queue);

    void sendMessage(const std::string& message);

    void sendCapteursRealtime(const std::vector<Capteur>& capteurs, int64_t interval_ns);
};

#endif // RABBITMQCLIENT_HPP


*/