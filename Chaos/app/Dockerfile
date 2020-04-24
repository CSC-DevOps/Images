FROM alpine:3.9.4

RUN apk add --update openssl iproute2 nodejs npm && \
    rm -rf /var/cache/apk/*

COPY service/ /service
RUN cd /service; npm install

ENTRYPOINT [ "node", "/service/index.js" ]