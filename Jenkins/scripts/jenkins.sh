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

# Java
sudo apt-get install openjdk-11-jdk-headless -y

# Nodejs
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install nodejs -y

# Job builder
sudo apt-get install python3-pip -y
pip3 install --user jenkins-job-builder
sudo ln -s ~/.local/bin/jenkins-job /usr/bin/jenkins-job

# Jenkins
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
echo "deb https://pkg.jenkins.io/debian binary/" | sudo tee -a /etc/apt/sources.list
sudo apt-get update
sudo apt-get install jenkins -y

# Example
cat << 'EOF' > ~/test-pipeline.yml
- job:
    name: test-pipeline
    project-type: pipeline
    dsl: |
      node {
          stage('Source') {
              git 'https://github.com/CSC-DevOps/App'
          }
          stage('Build') {
              sh 'npm install'
          }
          stage('Test') {
              sh 'npm test'
          }
      }
EOF
