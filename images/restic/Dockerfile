FROM golang:1.14 as builder

ARG VERSION="v0.12.0"
ARG REPO="https://github.com/restic/restic.git"

WORKDIR /src

RUN git clone --depth=1 "${REPO}" --branch=$(git ls-remote --tags --refs -q "${REPO}" "${VERSION}*" | tail -n 1 | awk -F/ '{ print $3 }') /src \
    && go run build.go

FROM docker.pkg.github.com/project0/container-hub/base:20210716-24

# install additional tools
RUN yum -y install mariadb postgresql curl wget \
    && yum -y update \
    && yum clean all \
    && rm -rf /var/cache/yum

COPY --from=builder /src/restic /usr/local/bin/
COPY entrypoint.sh /entrypoint.sh

RUN chmod a+x /entrypoint.sh
VOLUME /data
WORKDIR /data

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "restic" ]