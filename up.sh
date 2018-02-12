#!/bin/bash
# 应用部署脚本
# Author:   Daniel
# Date:     2017/12/11
# Version:  1.0

name="oc"

docker rm -f $name
docker rmi -f $name

docker build -t $name .
docker run --restart=always -d \
    -e "VIRTUAL_HOST=$name.wosoft.me" \
    -e "LETSENCRYPT_HOST=$name.wosoft.me" \
    --name $name \
    --expose 3000 \
    $name