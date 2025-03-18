pipeline {
    agent none
    options {
        disableConcurrentBuilds()
    }
    environment {
        DOCKER_IMAGE_PREFIX = "murhyun2"
        EC2_PUBLIC_HOST = "j12b209.p.ssafy.io"
        EC2_BACKEND_HOST = "backend.j12b209.p.ssafy.io"
        EC2_FRONTEND_HOST = "frontend.j12b209.p.ssafy.io"
        COMPOSE_PROJECT_NAME = "yoohoo"
        EC2_PUBLIC_SSH_CREDENTIALS_ID = "ec2-ssh-key"
        EC2_BACKEND_SSH_CREDENTIALS_ID = "ec2-backend-ssh-key"
        EC2_FRONTEND_SSH_CREDENTIALS_ID = "ec2-frontend-ssh-key"
        GIT_CREDENTIALS_ID = "gitlab-token"
        GIT_REPOSITORY_URL = "https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21B209"
        PROJECT_DIRECTORY = "jenkins"
        EC2_USER = "ubuntu"
        DOCKER_HUB_CREDENTIALS_ID = "dockerhub-token"
        STABLE_TAG = "stable-${env.BUILD_NUMBER}"
        CANARY_TAG = "canary-${env.BUILD_NUMBER}"
        TRAFFIC_SPLIT = 10
    }
    stages {
        stage('Checkout') {
            agent any
            steps {
                git branch: "develop", credentialsId: "${GIT_CREDENTIALS_ID}", url: "${GIT_REPOSITORY_URL}"
            }
        }

        stage('Prepare Environment') {
            agent any
            steps {
                withCredentials([file(credentialsId: 'env-file-content', variable: 'ENV_FILE_PATH')]) {
                    script {
                        def envContent = readFile(ENV_FILE_PATH)
                        dir("${PROJECT_DIRECTORY}") {
                            writeFile file: '.env', text: envContent
                        }
                    }
                }
            }
        }

        stage('Build & Push Images') {
            parallel {
                stage('Build Backend') {
                    agent { label 'backend-dev' }
                    steps {
                        script {
                            docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS_ID}") {
                                dir("${PROJECT_DIRECTORY}") {
                                    sh """
                                        docker compose build --no-cache canary_backend
                                        docker tag ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-backend:latest ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-backend:${CANARY_TAG}
                                        docker push ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-backend:${CANARY_TAG}
                                    """
                                }
                            }
                        }
                    }
                }
                stage('Build Frontend') {
                    agent { label 'frontend-dev' }
                    steps {
                        script {
                            docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS_ID}") {
                                dir("${PROJECT_DIRECTORY}") {
                                    sh """
                                        docker compose build --no-cache canary_frontend
                                        docker tag ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-frontend:latest ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-frontend:${CANARY_TAG}
                                        docker push ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-frontend:${CANARY_TAG}
                                    """
                                }
                            }
                        }
                    }
                }
                stage('Configure Nginx') {
                    agent { label 'public-dev' }
                    steps {
                        script {
                            dir("${PROJECT_DIRECTORY}/nginx") {
                                def nginxConfig = """
                                    upstream backend {
                                        server ${EC2_BACKEND_HOST}:8080 weight=${100 - TRAFFIC_SPLIT};
                                        server ${EC2_BACKEND_HOST}:8081 weight=${TRAFFIC_SPLIT};
                                    }
                                    upstream frontend {
                                        server ${EC2_FRONTEND_HOST}:80 weight=${100 - TRAFFIC_SPLIT};
                                        server ${EC2_FRONTEND_HOST}:81 weight=${TRAFFIC_SPLIT};
                                    }
                                    server {
                                        listen 80;
                                        location /api {
                                            proxy_pass http://backend;
                                            proxy_set_header Host \$host;
                                            proxy_set_header X-Real-IP \$remote_addr;
                                        }
                                        location / {
                                            proxy_pass http://frontend;
                                            proxy_set_header Host \$host;
                                            proxy_set_header X-Real-IP \$remote_addr;
                                        }
                                    }
                                """
                                writeFile file: 'nginx.conf', text: nginxConfig
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy Canary') {
            agent none
            options {
                lock('ec2-deployment-lock')
            }
            steps {
                script {
                    parallel(
                        "Backend Deployment": {
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_BACKEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
                                sh """
                                    ssh -i ${SSH_KEY} ${EC2_USER}@${EC2_BACKEND_HOST} "
                                        cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME}
                                        docker compose pull canary_backend
                                        docker compose up -d --no-deps canary_backend
                                    "
                                """
                            }
                        },
                        "Frontend Deployment": {
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_FRONTEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
                                sh """
                                    ssh -i ${SSH_KEY} ${EC2_USER}@${EC2_FRONTEND_HOST} "
                                        cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME}
                                        docker compose pull canary_frontend
                                        docker compose up -d --no-deps canary_frontend
                                    "
                                """
                            }
                        }
                    )

                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
                        sh """
                            scp -i ${SSH_KEY} ${PROJECT_DIRECTORY}/nginx/nginx.conf ${EC2_USER}@${EC2_PUBLIC_HOST}:/home/${EC2_USER}/${COMPOSE_PROJECT_NAME}/nginx/
                            ssh -i ${SSH_KEY} ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME}
                                docker compose up -d nginx
                                docker exec ${COMPOSE_PROJECT_NAME}-nginx-1 nginx -s reload
                            "
                        """
                    }
                }
            }
        }

        stage('Approval') {
            agent any
            steps {
                input message: '카나리 테스트를 승인하시겠습니까?', ok: '프로덕션 배포'
            }
        }

        stage('Promote to Stable') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS_ID}") {
                        sh """
                            docker tag ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-backend:${CANARY_TAG} ${DOCKER_IMAGE_PREFIX}/yoohoo-stable-backend:${STABLE_TAG}
                            docker tag ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-frontend:${CANARY_TAG} ${DOCKER_IMAGE_PREFIX}/yoohoo-stable-frontend:${STABLE_TAG}
                            docker push ${DOCKER_IMAGE_PREFIX}/yoohoo-stable-backend:${STABLE_TAG}
                            docker push ${DOCKER_IMAGE_PREFIX}/yoohoo-stable-frontend:${STABLE_TAG}
                        """
                    }

                    parallel(
                        "Backend Promotion": {
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_BACKEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
                                sh """
                                    ssh -i ${SSH_KEY} ${EC2_USER}@${EC2_BACKEND_HOST} "
                                        cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME}
                                        docker compose pull stable_backend
                                        docker compose up -d --no-deps stable_backend
                                        docker compose stop canary_backend
                                        docker compose rm -f canary_backend
                                    "
                                """
                            }
                        },
                        "Frontend Promotion": {
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_FRONTEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
                                sh """
                                    ssh -i ${SSH_KEY} ${EC2_USER}@${EC2_FRONTEND_HOST} "
                                        cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME}
                                        docker compose pull stable_frontend
                                        docker compose up -d --no-deps stable_frontend
                                        docker compose stop canary_frontend
                                        docker compose rm -f canary_frontend
                                    "
                                """
                            }
                        }
                    )

                    dir("${PROJECT_DIRECTORY}/nginx") {
                        writeFile file: 'nginx.conf', text: """
                            upstream backend {
                                server ${EC2_BACKEND_HOST}:8080;
                            }
                            upstream frontend {
                                server ${EC2_FRONTEND_HOST}:80;
                            }
                            server {
                                listen 80;
                                location /api {
                                    proxy_pass http://backend;
                                }
                                location / {
                                    proxy_pass http://frontend;
                                }
                            }
                        """
                    }

                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
                        sh """
                            scp -i ${SSH_KEY} ${PROJECT_DIRECTORY}/nginx/nginx.conf ${EC2_USER}@${EC2_PUBLIC_HOST}:/home/${EC2_USER}/${COMPOSE_PROJECT_NAME}/nginx/
                            ssh -i ${SSH_KEY} ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME}
                                docker compose up -d nginx
                                docker exec ${COMPOSE_PROJECT_NAME}-nginx-1 nginx -s reload
                            "
                        """
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Email = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                def Commit_Message = sh(script: "git log -1 --pretty=%s", returnStdout: true).trim()
                def Branch_Name = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                def Build_Time = new Date(currentBuild.startTimeInMillis).format("yyyy년 MM월 dd일 HH시 mm분 ss초", TimeZone.getTimeZone("Asia/Seoul"))
                def Duration = currentBuild.durationString.replace(' and counting', '')
                def Status = currentBuild.result ?: "SUCCESS"
                def Color = (Status == "SUCCESS") ? 'good' : 'danger'
                def Icon = (Status == "SUCCESS") ? "✅" : "❌"

                def Message = """\
                ${Icon} *BUILD ${Status}*
                - *Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
                - *Branch:* ${Branch_Name}
                - *Author:* ${Author_ID} (${Author_Email})
                - *Commit:* ${Commit_Message}
                - *시작 시간:* ${Build_Time}
                - *소요 시간:* ${Duration}
                [🔍 *Details*](${env.BUILD_URL})
                """.stripIndent()

                mattermostSend(
                    color: Color,
                    message: Message,
                    endpoint: 'https://meeting.ssafy.com/hooks/3wgn4b8xz7nnpcfb7rkdrwr1mo',
                    channel: 'B209-Jenkins-Result'
                )
            }
        }
    }
}