# Jenkins

To build image, run:

```
packer build ovf.json
```

Will build a vagrant box with:

* Java OpenJDK 11 (headless)
* Node JS 10.x
* Jenkins Job Builder
* Jenkins
* Sample job.yml