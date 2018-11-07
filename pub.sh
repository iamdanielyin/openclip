#!/bin/bash

tag="yinfxs/openclip"
cd ./root && npm run build
cd ../ && npm run build
mkdir -p ./dist/public
cp -rf ./root/dist/ ./dist/public
docker build -t $tag  .
docker push $tag