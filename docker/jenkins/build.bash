#!\bin\bash

docker pull jenkins/jenkins:lts

touch "Dockerfile"

echo "FROM jenkins/jenkins:lts
EXPOSE 8080" > "Dockerfile"

docker build --no-cache --force-rm -t jenkins/jenkins:lts .