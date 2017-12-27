#!\bin\bash

container_id="$(docker ps | grep "node:carbon" | sed 's/\s\+/ /g' | cut -d " " -f1)"

docker exec -it "${container_id}" /bin/bash