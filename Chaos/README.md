# Chaos

To build image, run:

```
packer build ovf.json
```

Will build a vagrant box with:

* Docker
* nodejs
* Simple load balancer app running round robin requests to docker containers.
* Chaos scripts
