pipeline {
  agent any
  stages {
    stage('Initialize') {
      steps {
        sh 'echo "$(pwd)"'
        sh 'echo "Path: ${PATH}"'
        sh 'echo "Node version: $(node --version)"'
        sh 'echo "Npm version: $(npm --version)"'  
      }
    }
    stage('Build') {
      steps {
        dir(path: './client/') {
          sh 'echo "$(pwd)"'
          sh 'npm install'
        } 
      }
    }  
    stage('Unit tests') {
      steps {
        dir(path: './client/') {
          sh 'echo "$(pwd)"'
          sh 'npm run mocha-to-xml'
        }
      }
    }
    stage('End-to-end tests') {
      steps {
        dir(path: './client/') {
          sh 'echo "$(pwd)"'
          sh 'npm run e2e'
        }
      }
    } 
  }
  post {
    always {
      junit "client/test/reports/**/*.xml"
    }
  }
  tools {
    nodejs 'NodeJS'
  }
}