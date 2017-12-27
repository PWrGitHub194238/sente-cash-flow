#!\bin\bash

container_id="$(docker ps | grep -E "jenkins/jenkins:lts" | sed 's/\s\+/ /g' | cut -d " " -f1)"
docker stop "${container_id}"
docker rm "${container_id}"

docker_img_id="$(docker images | grep -E "jenkins/jenkins\s+lts" | sed 's/\s\+/ /g' | cut -d " " -f3)"

docker rmi "${docker_img_id}" -f

docker_img_id="$(docker images | grep -E "jenkins/jenkins\s+<none>" | sed 's/\s\+/ /g' | cut -d " " -f3)"

docker rmi "${docker_img_id}" -f

rm Dockerfile
rm -rf jenkins_home
