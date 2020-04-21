FROM ubuntu:16.04

RUN apt-get update
# Basics
RUN apt-get install -y build-essential git vim curl

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
# Networking tools
RUN apt-get install -y iproute2
