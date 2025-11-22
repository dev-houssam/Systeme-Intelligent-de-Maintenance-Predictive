# Configuration


```md
## Nous avons besoin de :
- RabbitMQ
	Lien d'installation : https://www.rabbitmq.com/docs/install-debian
	Commandes : [
		# Copier le script sur le site
		./install_rabbit.sh 
		sudo apt-get update -y
		sudo apt-get install curl gnupg -y
		sudo apt-get install apt-transport-https
		sudo apt-get install curl gnupg apt-transport-https -y
		## Team RabbitMQ's signing key
		curl -1sLf "https://keys.openpgp.org/vks/v1/by-fingerprint/0A9AF2115F4687BD29803A206B73A36E6026DFCA" | sudo gpg --dearmor | sudo tee /usr/share/keyrings/com.rabbitmq.team.gpg > /dev/null
		# Execute this Script Block
		sudo tee /etc/apt/sources.list.d/rabbitmq.list <<EOF
		## Modern Erlang/OTP releases
		##
		deb [arch=amd64 signed-by=/usr/share/keyrings/com.rabbitmq.team.gpg] https://deb1.rabbitmq.com/rabbitmq-erlang/debian/bookworm bookworm main
		deb [arch=amd64 signed-by=/usr/share/keyrings/com.rabbitmq.team.gpg] https://deb2.rabbitmq.com/rabbitmq-erlang/debian/bookworm bookworm main

		## Provides modern RabbitMQ releases
		##
		deb [arch=amd64 signed-by=/usr/share/keyrings/com.rabbitmq.team.gpg] https://deb1.rabbitmq.com/rabbitmq-server/debian/bookworm bookworm main
		deb [arch=amd64 signed-by=/usr/share/keyrings/com.rabbitmq.team.gpg] https://deb2.rabbitmq.com/rabbitmq-server/debian/bookworm bookworm main
		EOF
		sudo apt-get update -y
		# Execute as Commands block
		## Install Erlang packages
		sudo apt-get install -y erlang-base \
		                        erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
		                        erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
		                        erlang-runtime-tools erlang-snmp erlang-ssl \
		                        erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl
		# End block
		## Install rabbitmq-server and its dependencies
		sudo apt-get install rabbitmq-server -y --fix-missing
		sudo apt-get update -y
		# Create next file if not exists
		# /etc/apt/preferences.d/erlang
		# Begin file
		Package: erlang*
		Pin: origin RabbitMQ
		# Note: priority of 1001 (greater than 1000) allows for downgrading.
		# To make package downgrading impossible, use a value of 999
		Pin-Priority: 1001
		# End Of File (EOF)
		sudo apt-cache policy
		# Let to go to work with it (Rabbit Server)
		systemctl start rabbitmq-server
		rabbitmq-diagnostics status
		# check on service status as observed by service manager
		sudo systemctl status rabbitmq-server
		# prints effective node configuration
		sudo rabbitmq-diagnostics environment
		# Start Management UI
		sudo rabbitmq-plugins enable rabbitmq_management
		# https://www.rabbitmq.com/docs/access-control
		# Managing Users
		sudo rabbitmqctl add_user "a-cyc4trice-anyUser" "a-cyc4tricewr0ngOopsStr0ngpa$$w0rd"
		# Print Virtual Hosts
		sudo rabbitmqctl list_vhosts
		# Print Users Lists
		sudo rabbitmqctl list_users
		# Deleting User
		sudo rabbitmqctl delete_user 'username'
		# Third  for read permission on every entity
		sudo rabbitmqctl set_permissions -p "custom-vhost" "a-cyc4trice-anyUser" ".*" ".*" ".*" 
		# Revokes permissions in a virtual host
		sudo rabbitmqctl clear_permissions -p "custom-vhost" "a-cyc4trice-anyUser"
	]
	Configuration système : Debian Bookworm (Linux Mint) | PopOS 
	Configuration Incompatible : VirtualBox (PopOS) with Intel Core i5


- MongoDB
	Lien d'installation : https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-debian/
	Commandes : [
		# ..
		sudo apt-get install gnupg curl
		# ..
		curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   			sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   			--dearmor
   		# ..
   		echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   		# ..
   		sudo apt-get update
   		sudo apt-get install -y mongodb-org
   		# PS
   		ps --no-headers -o comm 1
   		sudo systemctl start mongod
   		sudo systemctl daemon-reload
   		sudo systemctl status mongod
   		sudo systemctl enable mongod
   		# Managing
		mongosh
		# Install Graphical Client
		sudo snap search robomongo
		sudo snap install robomongo

	]
	Configuration système : Debian Bookworm | PopOS | Systemd (systemctl)



- Librairie JSON
	Lien d'installation : 
	Commandes : [
		echo  "import json and use it directly on python"
		sudo apt-get update
		# Ne pas utiliser cette commande
		sudo apt install libjson-c-dev
		# Commande à utiliser
		sudo apt-get -y install nlohmann-json3-dev
	]
	Configuration système : Debian Bookworm | PopOS | Systemd (systemctl)




- SimpleAmqClient
	Lien d'installation : https://github.com/alanxz/SimpleAmqpClient
	Commandes : [
		cmake --version
		sudo apt install libssl-dev libcurl4-openssl-dev
		sudo apt install cmake g++ libboost-all-dev librabbitmq-dev git
		sudo apt install cmake
		sudo apt install build-essential zlib1g-dev libssl-dev -y
		git clone https://github.com/alanxz/SimpleAmqpClient.git
		mkdir simpleamqpclient-build
		cd simpleamqpclient-build
		cmake ..
		make
		sudo make install
		# Don't forget to run that
		export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH
		systemctl status rabbitmq-server
	]
	Configuration système : Debian Bookworm | PopOS | Systemd (systemctl)




- Pymongo
	Lien d'installation : 
	Commandes : [
		pip3 install pymongo
	]
	Configuration système : Debian Bookworm | PopOS | Systemd (systemctl)
	Configuration Incompatible : Mongo30


- Pyka
	Lien d'installation : 
	Commandes : pip3 install pyka
	Configuration système : Debian Bookworm | PopOS | Systemd (systemctl)
	Instabilité : [
		Gestion de Cadence en temps réel : 
			(solution) => [ 
					Gestionnaire de Cadence de Tache ([Sporadique ?, Evenementielle ?, Periodique ?] channel.basic_consume)
					Gestion synchrone du temps logique (Communication à synchroniser sur le système global)
					Gestion du support temps réel pour les bases de données (Occurence : MongoDB, et Pymongo)
				]
	]


```