#!\bin\bash

tsc -p .

tsc -p "../../client"
cp -r "../../client" "./dist/client"

container_id="$(docker ps | grep "node:carbon" | sed 's/\s\+/ /g' | cut -d " " -f1)"
docker stop "${container_id}"
docker rm "${container_id}"

docker run -p 9001:8081 -v "$(pwd)/dist":"/usr/nodejs/dist" node:carbon