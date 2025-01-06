pipeline {
    agent any

    stages {
         stage('Docker Build') {
            steps {
              script  {
                sh "docker build -t shop-dfh:latest --target=build ."
              }
            }
        }

        stage ('Check Formatting and Linting') {
            steps {
              script  {
                // sh "docker run shop-dfh:latest sh -c 'npm run format:verify'"
                // sh "docker run shop-dfh:latest sh -c 'npm run lint'"
              }
            }
        }

        stage ('Test') {
            steps {
              script  {
                sh "docker run shop-dfh:latest sh -c 'npm run test'"
              }
            }
        }

        stage('Docker Build Production & Push') {
            steps {
              script  {
                withDockerRegistry(credentialsId: 'Docker_Hub') {
                    sh "docker build -t shop-dfh:latest ."
                    sh "docker tag shop-dfh:latest andriich/shop-dfh:latest"
                    sh "docker push andriich/shop-dfh:latest"
                    sh "docker image prune -f"
                }
              }
            }
        }

        stage('Deploy') {
            steps {
              script  {
                withDockerRegistry(credentialsId: 'Docker_Hub') {
                    sh "docker stop shop-dfh || true"
                    sh "docker rm shop-dfh || true"
                    sh "docker rmi andriich/shop-dfh:latest || true"
                    sh "docker pull andriich/shop-dfh:latest"
                    sh "docker run -d --name shop-dfh -p 4000:3000 andriich/shop-dfh:latest"
                    sh "docker image prune -f"
                    // sh "docker rmi shop-dfh:latest || true"
                    // sh "docker rmi andriich/shop-dfh:latest || true"
                }
              }
            }
        }
    }
}
