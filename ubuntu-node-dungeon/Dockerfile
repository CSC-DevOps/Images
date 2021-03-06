FROM ubuntu:18.04 AS kernel
# workaround for grub-pc loop
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=845563
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y linux-virtual virtualbox-guest-dkms && \
    apt-get clean

FROM ubuntu:18.04 AS install
ARG SSHPUBKEY
# For optional packages
ARG PKGS

USER root
RUN mkdir -p /etc/ssh /root/.ssh && chmod 0700 /root/.ssh
RUN echo $SSHPUBKEY > /root/.ssh/authorized_keys && \
    chmod 600 /root/.ssh/authorized_keys

COPY --from=kernel /lib/modules /lib/modules

# copy the kernel for later use
COPY --from=kernel /boot/vmlinuz-* /vmlinuz

RUN apt-get update && \
    apt-get install -y ca-certificates util-linux openssh-server openssh-client \
                       rng-tools dhcpcd5 kmod virtualbox-guest-utils
RUN [ ! -z "$PKGS" ] && apt-get install -y $PKGS || echo "No optional pkgs provided."
RUN apt-get clean

COPY files/init /init

# enable root autologin on tty1
RUN cp /lib/systemd/system/getty@.service /lib/systemd/system/autologin@.service && \
    sed -i -E 's/ExecStart=.+/ExecStart=-\/sbin\/agetty -a root %I 38400/' \
        /lib/systemd/system/autologin@.service && \
    ln -sf /lib/systemd/system/autologin@.service /etc/systemd/system/getty.target.wants/getty@tty1.service

# sshd requires /var/run/sshd to exist, but for some reason it doesn't get created
# and if we create it in the docker container, it ends up getting overwritten since it's
# a tmpfs.
RUN sed -i -E '/ExecStartPre=.+/i \
                    ExecStartPre=-/bin/mkdir -p \/var\/run\/sshd' \
                /lib/systemd/system/ssh.service

RUN sed -i 's/root:!/root:*/' /etc/shadow

RUN sed -i '/floppy:x:11:root/d' /etc/group

#### Deleting apt package lists
RUN rm -rf /var/lib/apt/lists/*

#### Dungeon files
COPY files/level0 /srv/level0

COPY files/level1 /srv/level1
COPY files/.bash_profile /root/.bash_profile

#### setting motd
RUN chmod -x /etc/update-motd.d/*
COPY /files/motd /etc/motd