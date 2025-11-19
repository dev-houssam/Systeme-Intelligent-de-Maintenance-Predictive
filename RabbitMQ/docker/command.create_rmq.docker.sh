# latest RabbitMQ 4.x
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
# docker run -d --hostname localhost --name myrabbit-cycatrice -p 5672:15672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=admin_cycatrice -e RABBITMQ_DEFAULT_PASS=p_at_cyc4A rabbitmq:3-management
