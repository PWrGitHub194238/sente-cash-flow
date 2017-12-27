#!\bin\bash

container_id="$(docker ps | grep "node:carbon" | sed 's/\s\+/ /g' | cut -d " " -f1)"
docker stop "${container_id}"
docker rm "${container_id}"

docker_img_id="$(docker images | grep -E "node\s+carbon" | sed 's/\s\+/ /g' | cut -d " " -f3)"

docker rmi "${docker_img_id}" -f

docker_img_id="$(docker images | grep -E "node\s+<none>" | sed 's/\s\+/ /g' | cut -d " " -f3)"

docker rmi "${docker_img_id}" -f

rm Dockerfile
rm .dockerignore

rm package-lock.json
rm -rf node_modules

rm -fr dist/*