#!\bin\bash

container_id="$(docker ps | grep -E "jenkins/jenkins:lts" | sed 's/\s\+/ /g' | cut -d " " -f1)"
docker stop "${container_id}"
docker rm "${container_id}"

docker run -p 9000:8080 -p 50000:50000 -v /c/Users/strza/Desktop/jenkins/jenkins_home:/var/jenkins_home -d jenkins/jenkins:lts