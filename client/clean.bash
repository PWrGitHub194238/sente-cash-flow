#!\bin\bash

find . -type f -name "*.log" -exec rm -vf {} \;

find ./src/ -type f -name "*.js" -exec rm -vf {} \;
find ./src/ -type f -name "*.js.map" -exec rm -vf {} \;

find ./test/e2e/ -type f -name "*.js" -exec rm -vf {} \;
find ./test/e2e/ -type f -name "*.js.map" -exec rm -vf {} \;

find ./test/reports/ -type f -name "*.xml" -exec rm -vf {} \;
find ./test/screenshots/ -type f -name "*.jpg" -exec rm -vf {} \;