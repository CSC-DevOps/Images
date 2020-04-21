#!/bin/bash
sudo apt-get update

# Our mac address will change and we cannot rely on default network configuration.
sudo rm /etc/netplan/50-cloud-init.yaml

# Fix networking.
echo "Create netplan config for enp0s3"
cat << 'EOF' | sudo tee /etc/netplan/01-netcfg.yaml;
network:
  version: 2
  ethernets:
    enp0s3:
      dhcp4: true
EOF


# NodeJs
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install nodejs -y

# Docker
sudo curl -sSL https://get.docker.com/ | sh
sudo usermod -aG docker $(whoami)

# Prepare directory for files
sudo mkdir -p /app
sudo chown vagrant:vagrant /app
